import { useState, useEffect } from "react";
import formatSecToPace from "../utils/FormatSecondsToTime.ts"


export default function SteepleLapsCalculator() {

    const distanceMap: Record<string, number> = { km: 0, mi: 1, m: 2, yds: 3 };
    const paceMap: Record<string, number> = { TotalTime: 4, PacePerKm: 0, PacePerMi: 1, "PaceKm/h": 2, "PaceMi/h": 3};

    const [errorMessage, setErrorMessage] = useState("Waiting for API...");

    const [paceUnit, setPaceUnit] = useState("TotalTime");
    const [distanceUnit, setDistanceUnit] = useState("km");
    const [pitType, setPitType] = useState("outside");

    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const [pacePerHour, setPacePerHour] = useState("");

    const [distance, setDistance] = useState("");

    const [results, setResults] = useState("");

    useEffect(() => {
        document.title = "RunCalcs: Steeplechase Calculator";
    }, []);

    useEffect(() => {
            const url = import.meta.env.VITE_API_URL + "/ping"
            fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                setErrorMessage("");
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("API is sleeping... Calculators may not work or take longer than usual");
            });
    }, []);

    function handleSplitsByPace(){

        setErrorMessage("");

        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);
        const pperhr = pacePerHour === "" ? 0 : Number(pacePerHour);

        const pUnit = paceMap[paceUnit];

        var p = 0;

        if(pUnit === 0 || pUnit === 1){
            if(hrs < 0 || mins < 0 || secs < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = secs + (mins*60) + (hrs * 60 * 60);

            if(p === 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

        }else{
            if(pperhr < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = pperhr;

        }

        var url = import.meta.env.VITE_API_URL + `/steeplesplitscalc/bypace?pace=${p}&paceUnit=${pUnit}&pitType=${pitType}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setResults(formatSecToPace(Number(data.timeperlap)));
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    function handleSplitsByTime(){

        setErrorMessage("");

        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);
        const dist = distance === "" ? 0 : Number(distance)

        const distUnit = distanceMap[distanceUnit];

        if(dist <= 0){
            setErrorMessage("Please provide a positive distance value");
            return;
        }

        if(hrs < 0 || mins < 0 || secs < 0){
            setErrorMessage("Please provide positive time values");
            return;
        }

        const time = secs + (mins*60) + (hrs*60*60);

        if(time <= 0){
            setErrorMessage("Please provide time values");
            return;
        }

        var url = import.meta.env.VITE_API_URL + `/steeplesplitscalc/bytime?time=${time}&distance=${dist}&distUnit=${distUnit}&pitType=${pitType}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setResults(formatSecToPace(Number(data.timeperlap)));
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    return (
        <div className="flex flex-col gap-2 relative">
            <h1 className="font-sans font-bold text-4xl m-2 text-center">RunCalcs Steeplechase Lap Time Calculator</h1>

            {/*Page body*/}
            <div className="flex flex-col">

                {/*Calculator body*/}
                <div className="relative flex justify-center gap-10 flex-col">
                    
                    {/*Calculator card*/}
                    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 w-full max-w-125 mt-6 mx-auto">
                        <h2 className="text-xl font-bold text-gray-800">Steeple Lap Calculator</h2>

                        <div className="space-y-4">

                            {/* Pace inputs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{(paceUnit === "PacePerKm" || paceUnit === "PacePerMi" || paceUnit === "TotalTime") ? "Pace or Time (hh:mm:ss.ss)":"Pace"}</label>
                                <div className="flex gap-2">

                                    {(paceUnit === "PacePerKm" || paceUnit === "PacePerMi" || paceUnit === "TotalTime") &&(
                                        <>
                                        <input type="number" placeholder="hh" value={hours} onChange={(e) => setHours(e.target.value)}
                                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                        <span className="self-center">:</span>

                                        <input type="number" placeholder="mm" value={minutes} onChange={(e) => setMinutes(e.target.value)}
                                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                        <span className="self-center">:</span>

                                        <input type="number" placeholder="ss" value={seconds} onChange={(e) => setSeconds(e.target.value)}
                                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />
                                        </>
                                    )}

                                    {(paceUnit === "PaceKm/h" || paceUnit === "PaceMi/h") &&(
                                        <>
                                        <input type="number" placeholder="0" value={pacePerHour} onChange={(e) => setPacePerHour(e.target.value)}
                                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />
                                        </>
                                    )}
                                    

                                    <select value={paceUnit} onChange={(e) => setPaceUnit(e.target.value)}
                                    className="rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                        <option value="TotalTime">Total Time</option>
                                        <option value="PacePerKm">Per km</option>
                                        <option value="PacePerMi">Per mi</option>
                                        <option value="PaceKm/h">km/h</option>
                                        <option value="PaceMi/h">mi/h</option>
                                    </select>

                                </div>
                            </div>

                            {/* Distance input */}
                            {paceUnit === "TotalTime" &&(
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="0" value={distance} onChange={(e) => setDistance(e.target.value)}
                                        className="w-24 rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500" />

                                        <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}
                                        className="rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                            <option value="km">km</option>
                                            <option value="mi">mi</option>
                                            <option value="m">m</option>
                                            <option value="yds">yds</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Pit Type Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pit Location</label>
                                <div className="flex gap-2">
                                    <select value={pitType} onChange={(e) => setPitType(e.target.value)}
                                    className="rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                        <option value="outside">Outside Pit (~418m)</option>
                                        <option value="inside">Inside Pit (~395m)</option>
                                    </select>
                                </div>
                            </div>

                            <button onClick={ paceUnit === "TotalTime" ? handleSplitsByTime : handleSplitsByPace}
                            className="w-full bg-cyan-600 text-white py-2 rounded-xl shadow hover:bg-cyan-700 hover:cursor-pointer transition">Calculate Splits</button>

                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{errorMessage}</div>
                            )}

                            {results && (
                                <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                                    <p>
                                        <span className="font-semibold">Time per Lap:</span>{" "}
                                        <span className="text-cyan-700">{results}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}