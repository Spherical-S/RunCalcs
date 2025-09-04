import { useState, useEffect } from "react";

function formatSecToPace(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const secondsRaw = time % 60;

    const seconds = `${Math.floor(secondsRaw).toString().padStart(2, '0')}.${(secondsRaw % 1).toFixed(2).slice(2)}`;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${seconds}`;
    } else {
        return `${minutes}:${seconds}`;
    }
}

export default function PaceCalculator() {

    const distanceMap: Record<string, number> = { km: 0, mi: 1, m: 2, yds: 3 };
    const paceMap: Record<string, number> = { PacePerKm: 0, PacePerMi: 1, "PaceKm/h": 2, "PaceMi/h": 3 };

    const [paceOpen, setPaceOpen] = useState(true);
    const [timeOpen, setTimeOpen] = useState(false);
    const [distanceOpen, setDistanceOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("Waiting for API...");

    const [paceUnit, setPaceUnit] = useState("PacePerKm");
    const [distanceUnit, setDistanceUnit] = useState("km");

    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");

    const [pacePerHour, setPacePerHour] = useState("");
    const [paceHours, setPaceHours] = useState("");
    const [paceMinutes, setPaceMinutes] = useState("");
    const [paceSeconds, setPaceSeconds] = useState("");

    const [distance, setDistance] = useState("");

    const [paceCalcResults, setPaceCalcResults] = useState({"PacePerKm": "", "PacePerMi": "", "PaceKm/h": "", "PaceMi/h": ""});
    const [timeCalcResults, setTimeCalcResults] = useState({"Time": ""});
    const [distanceCalcResults, setDistanceCalcResults] = useState({"km": "", "mi": "", "m": "", "yds": ""});

    useEffect(() => {
        document.title = "RunCalcs: Pace Calculator";
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

    function handlePaceClick(){
        setPaceOpen(true);
        setTimeOpen(false);
        setDistanceOpen(false);
        setDistanceUnit("km");
        setDistance("");
        setHours("");
        setMinutes("");
        setSeconds("");
        setPaceCalcResults({"PacePerKm": "","PacePerMi": "","PaceKm/h": "","PaceMi/h": ""});
    }

    function handleTimeClick(){
        setPaceOpen(false);
        setTimeOpen(true);
        setDistanceOpen(false);
        setPaceUnit("PacePerKm");
        setDistanceUnit("km");
        setDistance("");
        setPaceHours("");
        setPaceMinutes("");
        setPaceSeconds("");
        setTimeCalcResults({"Time": ""});
    }

    function handleDistanceClick(){
        setPaceOpen(false);
        setTimeOpen(false);
        setDistanceOpen(true);
        setPaceUnit("PacePerKm");
        setPaceHours("");
        setPaceMinutes("");
        setPaceSeconds("");
        setHours("");
        setMinutes("");
        setSeconds("");
        setDistanceCalcResults({"km": "", "mi": "", "m": "", "yds": ""});
    }

    function handleSubmitPaceCalculation(){

        setErrorMessage("");

        const dist = distance === "" ? 0 : Number(distance);
        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);

        if(dist <= 0){
            setErrorMessage("Please provide a distance value greater than 0");
            return;
        }

        if(hrs < 0 || mins < 0 || secs < 0){
            setErrorMessage("Please provide positive time values");
            return;
        }

        var time = secs + (mins*60) + (hrs * 60 * 60)

        const distUnit = distanceMap[distanceUnit];

        var url = import.meta.env.VITE_API_URL + `/pacecalc/pace?time=${time}&distance=${dist}&unit=${distUnit}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                var pacePerKmFormatted = formatSecToPace(Number(data.secPerKm));
                var pacePerMiFormatted = formatSecToPace(Number(data.secPerMi));
                setPaceCalcResults({"PacePerKm": pacePerKmFormatted, "PacePerMi": pacePerMiFormatted,"PaceKm/h": data.KmsPerHour, "PaceMi/h": data.MisPerHour});
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    function handleSubmitTimeCalculation(){

        setErrorMessage("");

        const dist = distance === "" ? 0 : Number(distance);
        const phrs = paceHours === "" ? 0 : Number(paceHours);
        const pmins = paceMinutes === "" ? 0 : Number(paceMinutes);
        const psecs = paceSeconds === "" ? 0 : Number(paceSeconds);
        const pperhr = pacePerHour === "" ? 0 : Number(pacePerHour);

        if(dist < 0){
            setErrorMessage("Please provide a positive distance value");
            return;
        }

        const pUnit = paceMap[paceUnit];

        const distUnit = distanceMap[distanceUnit];

        var p = 0;

        if(pUnit === 0 || pUnit === 1){
            if(phrs < 0 || pmins < 0 || psecs < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = psecs + (pmins*60) + (phrs * 60 * 60);

        }else{
            if(pperhr < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = pperhr;

        }


        var url = import.meta.env.VITE_API_URL + `/pacecalc/time?distance=${distance}&distUnit=${distUnit}&pace=${p}&paceUnit=${pUnit}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                var timeFormatted = formatSecToPace(Number(data.time));
                setTimeCalcResults({"Time": timeFormatted});
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });
    }

    function handleSubmitDistanceCalculation(){
        
        setErrorMessage("");

        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);
        const phrs = paceHours === "" ? 0 : Number(paceHours);
        const pmins = paceMinutes === "" ? 0 : Number(paceMinutes);
        const psecs = paceSeconds === "" ? 0 : Number(paceSeconds);
        const pperhr = pacePerHour === "" ? 0 : Number(pacePerHour);

        if(hrs < 0 || mins < 0 || secs < 0){
            setErrorMessage("Please provide positive time values");
            return;
        }

        var time = secs + (mins*60) + (hrs * 60 * 60)

        const pUnit = paceMap[paceUnit];

        var p = 0;

        if(pUnit === 0 || pUnit === 1){
            if(phrs < 0 || pmins < 0 || psecs < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = psecs + (pmins*60) + (phrs * 60 * 60);

        }else{
            if(pperhr < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = pperhr;

        }

        if(p <= 0){
            setErrorMessage("Please provide positive pace values");
            return;
        }

        var url = import.meta.env.VITE_API_URL + `/pacecalc/distance?time=${time}&pace=${p}&unit=${pUnit}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setDistanceCalcResults({"km": data.km, "mi": data.mi, "m": data.m, "yds": data.yds});
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    return(

        <div className="flex flex-col gap-2 relative">
            <h1 className="font-sans font-bold text-4xl m-2 text-center">RunCalcs Pace Calculation Tools</h1>

            {/*Page body*/}
            <div className="flex flex-col">

                {/*Mode select buttons*/}
                <div className="text-center">
                    <button onClick={handlePaceClick} className={`${paceOpen ? "bg-white border-b-white text-black":"bg-cyan-600 text-white hover:bg-white hover:text-black hover:border-b-white"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-20 mr-1`}>Pace</button>
                    <button onClick={handleTimeClick} className={`${timeOpen ? "bg-white border-b-white text-black":"bg-cyan-600 text-white hover:bg-white hover:text-black hover:border-b-white"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-20 mr-1`}>Time</button>
                    <button onClick={handleDistanceClick} className={`${distanceOpen ? "bg-white border-b-white text-black":"bg-cyan-600 text-white hover:bg-white hover:text-black hover:border-b-white"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-20 mr-1`}>Distance</button>
                </div>

                {/*Calculator body*/}
                <div className="relative">

                    {/*Pace Calculator*/}
                    {paceOpen && (
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">Pace Calculator</h2>

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

                    {/*Time calculator*/}
                    {timeOpen && (
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">Time Calculator</h2>

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

                    {/*Distance calculator*/}
                    {distanceOpen && (
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">Distance Calculator</h2>

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
                        </div>

                        <button onClick={handleSubmitDistanceCalculation}
                            className="w-full bg-cyan-600 text-white py-2 rounded-xl shadow hover:bg-cyan-700 hover:cursor-pointer transition">Calculate Distance</button>

                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{errorMessage}</div>
                        )}

                        {distanceCalcResults && (
                            <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                                <p>
                                    <span className="font-semibold">Km:</span>{" "}
                                    <span className="text-cyan-700">{distanceCalcResults.km}</span>
                                </p>
                                <p>
                                    <span className="font-semibold">Mi:</span>{" "}
                                    <span className="text-cyan-700">{distanceCalcResults.mi}</span>
                                </p>
                                <p>
                                    <span className="font-semibold">m:</span>{" "}
                                    <span className="text-cyan-700">{distanceCalcResults.m}</span>
                                </p>
                                <p>
                                    <span className="font-semibold">yds:</span>{" "}
                                    <span className="text-cyan-700">{distanceCalcResults.yds}</span>
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