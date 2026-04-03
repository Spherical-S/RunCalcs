import { useState, useEffect } from "react";
import formatSecToPace from "../utils/FormatSecondsToTime.ts"
import elevationToGrade from "../utils/ElevationToGrade.ts";

export default function GAPCalculator() {

    const distanceMap: Record<string, number> = { km: 0, mi: 1, m: 2, yds: 3 };
    const paceMap: Record<string, number> = { PacePerKm: 0, PacePerMi: 1, "PaceKm/h": 2, "PaceMi/h": 3 };

    const [timeOpen, setTimeOpen] = useState(true);
    const [paceOpen, setPaceOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("Waiting for API...");

    const [paceUnit, setPaceUnit] = useState("PacePerKm");
    const [distanceUnit, setDistanceUnit] = useState("km");

    const [pacePerHour, setPacePerHour] = useState("");
    const [paceHours, setPaceHours] = useState("");
    const [paceMinutes, setPaceMinutes] = useState("");
    const [paceSeconds, setPaceSeconds] = useState("");

    const [distance, setDistance] = useState("");

    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");

    const [elevation, setElevation] = useState("");
    const [elevationUnit, setElevationUnit] = useState("%");

    const [timeCalcResults, setTimeCalcResults] = useState({ "Time": "" });
    const [paceCalcResults, setPaceCalcResults] = useState({ "PacePerKm": "", "PacePerMi": "", "PaceKm/h": "", "PaceMi/h": "" });

    useEffect(() => {
        document.title = "RunCalcs: Elevation Pace Calculator";
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

    function handleTimeClick() {
        setTimeOpen(true);
        setPaceOpen(false);
        setDistance("");
        setDistanceUnit("km");
        setHours("");
        setMinutes("");
        setSeconds("");
        setElevation("");
        setElevationUnit("%");
        setTimeCalcResults({ "Time": "" });
    }

    function handlePaceClick() {
        setTimeOpen(false);
        setPaceOpen(true);
        setPaceHours("");
        setPaceMinutes("");
        setPaceSeconds("");
        setPacePerHour("");
        setElevation("");
        setElevationUnit("%");
        setPaceCalcResults({ "PacePerKm": "","PacePerMi": "","PaceKm/h": "","PaceMi/h": "" });
    }

    function handleSubmitTimeCalculation() {

        setErrorMessage("");

        const dist = distance === "" ? 0 : Number(distance);
        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);
        const elev = elevation === "" ? 0 : Number(elevation);
        const grade = elevationToGrade(elev, elevationUnit, dist, distanceUnit);

        if (dist <= 0) {
            setErrorMessage("Please provide a distance value greater than 0");
            return;
        }

        if (hrs < 0 || mins < 0 || secs < 0) {
            setErrorMessage("Please provide positive time values");
            return;
        }

        if (grade < -45 || grade > 45) {
            if (elevationUnit === "%") {
                setErrorMessage("Please provide a valid grade between -45% and 45%");
            } else {
                setErrorMessage("Please provide valid elevation (calculated grade must be between -45% and 45%, current grade: " + grade.toFixed(2) + "%)");
            }
            return;
        }

        const distUnit = distanceMap[distanceUnit];
        const time = secs + (mins*60) + (hrs * 60 * 60);

        const url = import.meta.env.VITE_API_URL + `/gradeadjustedpacecalc/time?time=${time}&distance=${dist}&distUnit=${distUnit}&grade=${grade}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const timeFormatted = formatSecToPace(Number(data.time));
                setTimeCalcResults({ "Time": timeFormatted });
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    function handleSubmitPaceCalculation() {

        setErrorMessage("");

        const phrs = paceHours === "" ? 0 : Number(paceHours);
        const pmins = paceMinutes === "" ? 0 : Number(paceMinutes);
        const psecs = paceSeconds === "" ? 0 : Number(paceSeconds);
        const pperhr = pacePerHour === "" ? 0 : Number(pacePerHour);
        const grade = elevation === "" ? 0 : Number(elevation);

        const pUnit = paceMap[paceUnit];

        if (grade < -45 || grade > 45) {
            setErrorMessage("Please provide a valid grade between -45% and 45%");
            return;
        }

        let p = 0;

        if (pUnit === 0 || pUnit === 1) {
            if (phrs < 0 || pmins < 0 || psecs < 0) {
                setErrorMessage("Please provide positive pace values");
                return;
            }
            p = psecs + (pmins*60) + (phrs * 60 * 60);
        } else {
            if (pperhr < 0) {
                setErrorMessage("Please provide positive pace values");
                return;
            }
            p = pperhr;
        }

        const url = import.meta.env.VITE_API_URL + `/gradeadjustedpacecalc/pace?pace=${p}&paceUnit=${pUnit}&grade=${grade}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const pacePerKmFormatted = formatSecToPace(Number(data.secPerKm));
                const pacePerMiFormatted = formatSecToPace(Number(data.secPerMi));
                setPaceCalcResults({ "PacePerKm": pacePerKmFormatted, "PacePerMi": pacePerMiFormatted,"PaceKm/h": data.KmsPerHour, "PaceMi/h": data.MisPerHour });
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    return (

        <div className="flex flex-col gap-2 relative">
            <h1 className="font-sans font-bold text-4xl m-2 text-center">RunCalcs Elevation Conversion Tool</h1>

            {/*Page body*/}
            <div className="flex flex-col">

                {/*Mode select buttons*/}
                <div className="text-center">
                    <button onClick={handleTimeClick} className={`${timeOpen ? "bg-white border-b-white text-black":"bg-cyan-600 text-white hover:bg-white hover:text-black hover:border-b-white"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-20 mr-1`}>Time</button>
                    <button onClick={handlePaceClick} className={`${paceOpen ? "bg-white border-b-white text-black":"bg-cyan-600 text-white hover:bg-white hover:text-black hover:border-b-white"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-20 mr-1`}>Pace</button>
                </div>

                {/*Calculator body*/}
                <div className="relative">

                    {/*Time Calculator*/}
                    {timeOpen && (
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Elevation time converter</h2>

                            <div className="space-y-4">
                                {/* Time inputs */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time (hh:mm:ss.ss)</label>
                                    <div className="flex gap-2">

                                        <input type="number" placeholder="hh" value={hours} onChange={(e) => setHours(e.target.value)}
                                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                        <span className="self-center">:</span>

                                        <input type="number" placeholder="mm" value={minutes} onChange={(e) => setMinutes(e.target.value)}
                                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                        <span className="self-center">:</span>

                                        <input type="number" placeholder="ss" value={seconds} onChange={(e) => setSeconds(e.target.value)}
                                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                    </div>
                                </div>

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

                                {/* Elevation input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Elevation or Grade %</label>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="0" value={elevation} onChange={(e) => setElevation(e.target.value)}
                                            className="w-24 rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500" />

                                        <select value={elevationUnit} onChange={(e) => setElevationUnit(e.target.value)}
                                            className="rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                            <option value="%">%</option>
                                            <option value="m">m</option>
                                            <option value="yds">yds</option>
                                            <option value="ft">ft</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            <button onClick={handleSubmitTimeCalculation}
                                className="w-full bg-cyan-600 text-white py-2 rounded-xl shadow hover:bg-cyan-700 hover:cursor-pointer transition">Calculate Time</button>

                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{errorMessage}</div>
                            )}

                            {timeCalcResults && (
                                <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                                    <p>
                                        <span className="font-semibold">Time:</span>{" "}
                                        <span className="text-cyan-700">{timeCalcResults.Time}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                    )}

                    {/*Pace calculator*/}
                    {paceOpen && (
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Elevation pace converter</h2>

                            <div className="space-y-4">
                                {/* Pace inputs */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pace{(paceUnit === "PacePerKm" || paceUnit === "PacePerMi") ? " (hh:mm:ss.ss)":""}</label>
                                    <div className="flex gap-2">

                                        {(paceUnit === "PacePerKm" || paceUnit === "PacePerMi") &&(
                                            <>
                                                <input type="number" placeholder="hh" value={paceHours} onChange={(e) => setPaceHours(e.target.value)}
                                                    className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                                <span className="self-center">:</span>

                                                <input type="number" placeholder="mm" value={paceMinutes} onChange={(e) => setPaceMinutes(e.target.value)}
                                                    className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                                <span className="self-center">:</span>

                                                <input type="number" placeholder="ss" value={paceSeconds} onChange={(e) => setPaceSeconds(e.target.value)}
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
                                            <option value="PacePerKm">Per km</option>
                                            <option value="PacePerMi">Per mi</option>
                                            <option value="PaceKm/h">km/h</option>
                                            <option value="PaceMi/h">mi/h</option>
                                        </select>

                                    </div>
                                </div>

                                {/* Elevation input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade %</label>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="0" value={elevation} onChange={(e) => setElevation(e.target.value)}
                                            className="w-24 rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500" />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSubmitPaceCalculation}
                                className="w-full bg-cyan-600 text-white py-2 rounded-xl shadow hover:bg-cyan-700 hover:cursor-pointer transition">Calculate Pace</button>

                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{errorMessage}</div>
                            )}

                            {paceCalcResults && (
                                <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                                    <p>
                                        <span className="font-semibold">Pace per km:</span>{" "}
                                        <span className="text-cyan-700">{paceCalcResults.PacePerKm}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold">Pace per mi:</span>{" "}
                                        <span className="text-cyan-700">{paceCalcResults.PacePerMi}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold">Speed (km/h):</span>{" "}
                                        <span className="text-cyan-700">{paceCalcResults["PaceKm/h"]}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold">Speed (mph):</span>{" "}
                                        <span className="text-cyan-700">{paceCalcResults["PaceMi/h"]}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}