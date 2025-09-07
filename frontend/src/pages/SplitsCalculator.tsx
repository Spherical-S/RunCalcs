import { useState, useEffect, useRef } from "react";
import formatTime from "../utils/FormatSecondsToTime.ts"

type splitDistUnits = {km: number, mi: number, m: number, yds: number}
type split = {distance: splitDistUnits, cumulativeDistance: splitDistUnits, time: number, cumulativeTime: number}

export default function SplitsCalculator() {

    const distanceMap: Record<string, number> = { km: 0, mi: 1, m: 2, yds: 3 };
    const paceMap: Record<string, number> = { TotalTime: 4, PacePerKm: 0, PacePerMi: 1, "PaceKm/h": 2, "PaceMi/h": 3};

    const resultsRef = useRef<HTMLDivElement | null>(null);

    const [errorMessage, setErrorMessage] = useState("Waiting for API...");

    const [paceUnit, setPaceUnit] = useState("TotalTime");
    const [distanceUnit, setDistanceUnit] = useState("km");

    const [distance, setDistance] = useState("");

    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const [pacePerHour, setPacePerHour] = useState("");

    const [splitsDistance, setSplitsDistance] = useState("");
    const [splitsDistanceUnit, setSplitsDistanceUnit] = useState("km");

    const [results, setResults] = useState<split[]>();

    useEffect(() => {
        document.title = "RunCalcs: Splits Calculator";
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

    useEffect(() => {
        if (results && results.length > 0 && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [results]);

    function handleSplitsByTime(){

        setErrorMessage("");

        const dist = distance === "" ? 0 : Number(distance);
        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);
        const sdist = splitsDistance === "" ? 0 : Number(splitsDistance);

        const distUnit = distanceMap[distanceUnit];
        const sDistUnit = distanceMap[splitsDistanceUnit];

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

        if(sdist <= 0){
            setErrorMessage("Please provide a positive split length value");
            return;
        }

        var url = import.meta.env.VITE_API_URL + `/splitscalc/bytime?splitLen=${sdist}&splitUnit=${sDistUnit}&time=${time}&distance=${dist}&distUnit=${distUnit}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setResults(data.result as split[]);
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    function handleSplitsByPace(){
        setErrorMessage("");

        const dist = distance === "" ? 0 : Number(distance);
        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);
        const pperhr = pacePerHour === "" ? 0 : Number(pacePerHour);
        const sdist = splitsDistance === "" ? 0 : Number(splitsDistance);

        const distUnit = distanceMap[distanceUnit];
        const sDistUnit = distanceMap[splitsDistanceUnit];

        if(dist <= 0){
            setErrorMessage("Please provide a positive distance value");
            return;
        }

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

        if(sdist <= 0){
            setErrorMessage("Please provide a positive split length value");
            return;
        }

        var url = import.meta.env.VITE_API_URL + `/splitscalc/bypace?splitLen=${sdist}&splitUnit=${sDistUnit}&pace=${p}&paceUnit=${pUnit}&distance=${dist}&distUnit=${distUnit}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setResults(data.result);
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });
    }

    return (
        <div className="flex flex-col gap-2 relative">
            <h1 className="font-sans font-bold text-4xl m-2 text-center">RunCalcs Splits Calculator</h1>

            {/*Page body*/}
            <div className="flex flex-col">

                {/*Calculator body*/}
                <div className="relative flex justify-center gap-10 flex-col">
                    
                    {/*Calculator card*/}
                    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 w-full max-w-125 mt-6 mx-auto">
                        <h2 className="text-xl font-bold text-gray-800">Splits Calculator</h2>

                        <div className="space-y-4">

                            {/* Distance input */}
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

                            {/* Splits every...? input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Splits Length</label>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="0" value={splitsDistance} onChange={(e) => setSplitsDistance(e.target.value)}
                                    className="w-24 rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500" />

                                    <select value={splitsDistanceUnit} onChange={(e) => setSplitsDistanceUnit(e.target.value)}
                                    className="rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                        <option value="km">km</option>
                                        <option value="mi">mi</option>
                                        <option value="m">m</option>
                                        <option value="yds">yds</option>
                                    </select>
                                </div>
                            </div>

                            <button onClick={ paceUnit === "TotalTime" ? handleSplitsByTime : handleSplitsByPace}
                            className="w-full bg-cyan-600 text-white py-2 rounded-xl shadow hover:bg-cyan-700 hover:cursor-pointer transition">Calculate Splits</button>

                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{errorMessage}</div>
                            )}
                        </div>
                    </div>
                    
                    {results && results.length > 0 && (
                        <div ref={resultsRef} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mt-6 mx-auto">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Splits</h3>
                            <table className="w-full text-sm border-separate border-spacing-y-1">
                                <thead>
                                    <tr className="bg-cyan-100 text-gray-800">
                                        <th className="px-3 py-2 text-left rounded-l-lg">Split Distance</th>
                                        <th className="px-3 py-2 text-left">Total Distance</th>
                                        <th className="px-3 py-2 text-left">Split Time</th>
                                        <th className="px-3 py-2 text-left rounded-r-lg">Total Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((split, i) => (
                                        <tr key={i} className="bg-gray-50 hover:bg-gray-100 transition">
                                            <td className="px-3 py-2">{split.distance[splitsDistanceUnit as keyof splitDistUnits]}{splitsDistanceUnit}</td>
                                            <td className="px-3 py-2">{split.cumulativeDistance[splitsDistanceUnit as keyof splitDistUnits]}{splitsDistanceUnit}</td>
                                            <td className="px-3 py-2">{formatTime(split.time)}</td>
                                            <td className="px-3 py-2">{formatTime(split.cumulativeTime)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}