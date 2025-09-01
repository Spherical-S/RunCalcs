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

    useEffect(() => {
        document.title = "RunCalcs: Pace Calculator";
    }, []);

    const [paceOpen, setPaceOpen] = useState(true);
    const [timeOpen, setTimeOpen] = useState(false);
    const [distanceOpen, setDistanceOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [paceUnit, setPaceUnit] = useState("PacePerKm");
    const [distanceUnit, setDistanceUnit] = useState("km");

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [pacePerHour, setPacePerHour] = useState(0);
    const [paceHours, setPaceHours] = useState(0);
    const [paceMinutes, setPaceMinutes] = useState(0);
    const [paceSeconds, setPaceSeconds] = useState(0);

    const [distance, setDistance] = useState(0);

    const [paceCalcResults, setPaceCalcResults] = useState({"HaveResults": false, "PacePerKm": "", "PacePerMi": "", "PaceKm/h": "", "PaceMi/h": ""});
    const [timeCalcResults, setTimeCalcResults] = useState({"HaveResults": false, "Time": ""});
    const [distanceCalcResults, setDistanceCalcResults] = useState({"HaveResults": false, "km": "", "mi": "", "m": "", "yds": ""});

    function handlePaceClick(){
        setPaceOpen(true);
        setTimeOpen(false);
        setDistanceOpen(false);
        setDistanceUnit("km");
        setDistance(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setPaceCalcResults({"HaveResults": false,"PacePerKm": "","PacePerMi": "","PaceKm/h": "","PaceMi/h": ""});
    }

    function handleTimeClick(){
        setPaceOpen(false);
        setTimeOpen(true);
        setDistanceOpen(false);
        setPaceUnit("PacePerKm");
        setDistanceUnit("km");
        setDistance(0);
        setPaceHours(0);
        setPaceMinutes(0);
        setPaceSeconds(0);
        setTimeCalcResults({"HaveResults": false, "Time": ""});
    }

    function handleDistanceClick(){
        setPaceOpen(false);
        setTimeOpen(false);
        setDistanceOpen(true);
        setPaceUnit("PacePerKm");
        setPaceHours(0);
        setPaceMinutes(0);
        setPaceSeconds(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setDistanceCalcResults({"HaveResults": false, "km": "", "mi": "", "m": "", "yds": ""});
    }

    function handlePaceUnitChange(e: any){
        setPaceUnit(e.target.value);
    }

    function handleDistanceUnitChange(e: any){
        setDistanceUnit(e.target.value);
    }

    function handleSubmitPaceCalculation(){

        setErrorMessage("");

        if(distance <= 0){
            setErrorMessage("Please provide a distance value greater than 0");
            return;
        }

        if(hours < 0 || minutes < 0 || seconds < 0){
            setErrorMessage("Please provide positive time values");
            return;
        }

        var time = seconds + (minutes*60) + (hours * 60 * 60)

        const distUnit = distanceMap[distanceUnit];

        var url = import.meta.env.VITE_API_URL + `/pacecalc/pace?time=${time}&distance=${distance}&unit=${distUnit}`;

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
                setPaceCalcResults({"HaveResults": true, "PacePerKm": pacePerKmFormatted, "PacePerMi": pacePerMiFormatted,"PaceKm/h": data.KmsPerHour, "PaceMi/h": data.MisPerHour});
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    function handleSubmitTimeCalculation(){

        setErrorMessage("");

        if(distance < 0){
            setErrorMessage("Please provide a positive distance value");
            return;
        }

        const pUnit = paceMap[paceUnit];

        const distUnit = distanceMap[distanceUnit];

        var p = 0;

        if(pUnit === 0 || pUnit === 1){
            if(paceHours < 0 || paceMinutes < 0 || paceSeconds < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = paceSeconds + (paceMinutes*60) + (paceHours * 60 * 60);

        }else{
            if(pacePerHour < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = pacePerHour

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
                setTimeCalcResults({"HaveResults": true, "Time": timeFormatted});
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });
    }

    function handleSubmitDistanceCalculation(){
        
        setErrorMessage("");

        if(hours < 0 || minutes < 0 || seconds < 0){
            setErrorMessage("Please provide positive time values");
            return;
        }

        var time = seconds + (minutes*60) + (hours * 60 * 60)

        const pUnit = paceMap[paceUnit];

        var p = 0;

        if(pUnit === 0 || pUnit === 1){
            if(paceHours < 0 || paceMinutes < 0 || paceSeconds < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = paceSeconds + (paceMinutes*60) + (paceHours * 60 * 60);

        }else{
            if(pacePerHour < 0){
                setErrorMessage("Please provide positive pace values");
                return;
            }

            p = pacePerHour

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
                setDistanceCalcResults({"HaveResults": true, "km": data.km, "mi": data.mi, "m": data.m, "yds": data.yds});
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    return(

        <div className="flex flex-col gap-2 text-center relative">
            <h1 className="font-sans font-bold text-4xl m-2">Pace Calculator</h1>

            <p className="font-sans font-semibold text-red-900">{errorMessage}</p>

            {/*Page body*/}
            <div className="flex flex-col text-center mx-auto">

                {/*Mode select buttons*/}
                <div>
                    <button onClick={handlePaceClick} className={`${paceOpen ? "bg-gray-200 hover:bg-gray-600":"bg-cyan-600 hover:bg-gray-200"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-20 mr-1`}>Pace</button>
                    <button onClick={handleTimeClick} className={`${timeOpen ? "bg-gray-200 hover:bg-gray-600":"bg-cyan-600 hover:bg-gray-200"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-20 mr-1`}>Time</button>
                    <button onClick={handleDistanceClick} className={`${distanceOpen ? "bg-gray-200 hover:bg-gray-600":"bg-cyan-600 hover:bg-2ray-400"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-20 mr-1`}>Distance</button>
                </div>

                {/*Calculator body*/}
                <div className="relative h-130 w-170 shadow-2xl bg-gray-200 rounded-2xl">

                    {/*Pace Calculator*/}
                    <div className={`absolute top-0 left-0 m-4 w-full h-full flex-col justify-center gap-4 space-y-6 transition-opacity duration-200${paceOpen ? "visible opacity-100":"invisible opacity-0 pointer-events-none"}`}>

                        {/*Time input row*/}
                        <div className="flex justify-center gap-8">
                            <div>
                                <p>Hours (total time):</p>
                                <input className="bg-white rounded border-1 border-gray-600 w-45" type="number" placeholder="0" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
                            </div>
                            <div>
                                <p>Minutes (total time):</p>
                                <input className="bg-white rounded border-1 border-gray-600 w-45" type="number" placeholder="0" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
                            </div>
                            <div>
                                <p>Seconds (total time):</p>
                                <input className="bg-white rounded border-1 border-gray-600 w-45" type="number" placeholder="0" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} />
                            </div>
                        </div>

                        {/*Distance and units input row*/}
                        <div className="grid grid-cols-[36.5%_27%_36.5%] items-center">
                            <p className="text-right pr-6">Distance:</p>
                            <input className="bg-white rounded border-1 border-gray-600 w-45" type="number" placeholder="0" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
                            <select onChange={handleDistanceUnitChange} className={"bg-white rounded border-1 border-gray-600 ml-2 w-min"}>
                                <option value="km">Km</option>
                                <option value="mi">Mi</option>
                                <option value="m">m</option>
                                <option value="yds">yds</option>
                            </select>
                        </div>

                        {/*Results display row*/}
                        <div className="min-h-81.5 items-center justify-center flex">
                            <div className={`flex-col ${paceCalcResults.HaveResults ? "visible opacity-100":"invisible opacity-0"}`}>
                                <p>Pace per Km: {paceCalcResults.PacePerKm}</p>
                                <p>Pace per Mi: {paceCalcResults.PacePerMi}</p>
                                <p>Pace Km/h: {paceCalcResults["PaceKm/h"]}</p>
                                <p>Pace Mi/h: {paceCalcResults["PaceMi/h"]}</p>
                            </div>
                        </div>

                        <button onClick={handleSubmitPaceCalculation} className="bg-cyan-600 rounded-2xl font-bold text-gray-800 py-3 px-6 mb-4 hover:cursor-pointer hover:bg-cyan-800">Calculate</button>
                    
                    </div>

                    {/*Time calculator*/}
                    <div className={`absolute top-0 left-0 w-full h-full flex-col justify-center gap-3 transition-opacity duration-200${timeOpen ? "visible opacity-100":"invisible opacity-0 pointer-events-none"}`}>

                        {/*Distance and units input row*/}
                        <div className="grid grid-cols-[35.5%_29%_35.5%] items-center m-4 mb-8">
                            <p className="text-right pr-6">Distance:</p>
                            <input className="bg-white rounded border-1 border-gray-600 w-45" type="number" placeholder="0" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
                            <select onChange={handleDistanceUnitChange} className={"bg-white rounded border-1 border-gray-600 ml-2 w-min"}>
                                <option value="km">Km</option>
                                <option value="mi">Mi</option>
                                <option value="m">m</option>
                                <option value="yds">yds</option>
                            </select>
                        </div>

                        {/*Pace unit selection row*/}
                        <div className="flex justify-center gap-4 mb-4">
                            <label>
                                <input type="radio" value="PacePerKm" checked={paceUnit === "PacePerKm"} onClick={handlePaceUnitChange}/>
                                Pace per Km
                            </label>
                            <label>
                                <input type="radio" value="PacePerMi" checked={paceUnit === "PacePerMi"} onClick={handlePaceUnitChange}/>
                                Pace per Mi
                            </label>
                            <label>
                                <input type="radio" value="PaceKm/h" checked={paceUnit === "PaceKm/h"} onClick={handlePaceUnitChange}/>
                                Pace Km/h
                            </label>
                            <label>
                                <input type="radio" value="PaceMi/h" checked={paceUnit === "PaceMi/h"} onClick={handlePaceUnitChange}/>
                                Pace Mi/h
                            </label>
                        </div>

                        {/*Pace entry row */}
                        <div>
                            {/*Time input row*/}
                            <div className="flex justify-center m-4 gap-8">
                                <div>
                                    <p>Hours (pace):</p>
                                    <input className={`rounded border-1 border-gray-600 w-45 transition-colors duration-300 ${paceUnit === "PacePerKm" || paceUnit === "PacePerMi" ? "bg-white":"bg-gray-500 cursor-not-allowed"}`} disabled={!(paceUnit === "PacePerKm" || paceUnit === "PacePerMi")} type="number" value={paceHours} placeholder="0" onChange={(e) => setPaceHours(Number(e.target.value))} />
                                </div>
                                <div>
                                    <p>Minutes (pace):</p>
                                    <input className={`rounded border-1 border-gray-600 w-45 transition-colors duration-300 ${paceUnit === "PacePerKm" || paceUnit === "PacePerMi" ? "bg-white":"bg-gray-500 cursor-not-allowed"}`} disabled={!(paceUnit === "PacePerKm" || paceUnit === "PacePerMi")} type="number" value={paceMinutes} placeholder="0" onChange={(e) => setPaceMinutes(Number(e.target.value))} />
                                </div>
                                <div>
                                    <p>Seconds (pace):</p>
                                    <input className={`rounded border-1 border-gray-600 w-45 transition-colors duration-300 ${paceUnit === "PacePerKm" || paceUnit === "PacePerMi" ? "bg-white":"bg-gray-500 cursor-not-allowed"}`} disabled={!(paceUnit === "PacePerKm" || paceUnit === "PacePerMi")} type="number" value={paceSeconds} placeholder="0" onChange={(e) => setPaceSeconds(Number(e.target.value))} />
                                </div>
                            </div>
                            <div>
                                <p>Pace per hour:</p>
                                <input className={`rounded border-1 border-gray-600 w-45 transition-colors duration-300 ${paceUnit === "PaceKm/h" || paceUnit === "PaceMi/h" ? "bg-white":"bg-gray-500 cursor-not-allowed"}`} disabled={!(paceUnit === "PaceKm/h" || paceUnit === "PaceMi/h")} type="number" value={pacePerHour} placeholder="0" onChange={(e) => setPacePerHour(Number(e.target.value))} />
                            </div>
                        </div>

                        {/*Results display row*/}
                        <div className="min-h-55 items-center justify-center flex">
                            <p className={`${timeCalcResults.HaveResults ? "visible opacity-100":"invisible opacity-0"}`}>Time: {timeCalcResults.Time}</p>
                        </div>

                        <button onClick={handleSubmitTimeCalculation} className="bg-cyan-600 rounded-2xl font-bold text-gray-800 py-3 px-6 mb-4 hover:cursor-pointer hover:bg-cyan-800">Calculate</button>

                    </div>

                    {/*Distance calculator*/}
                    <div className={`absolute top-0 left-0 w-full h-full flex-col justify-center gap-3 transition-opacity duration-200${distanceOpen ? "visible opacity-100":"invisible opacity-0 pointer-events-none"}`}>

                        {/*Time input row*/}
                        <div className="flex justify-center m-4 mb-8 gap-8">
                            <div>
                                <p>Hours (total time):</p>
                                <input className="bg-white rounded border-1 border-gray-600 w-45" type="number" value={hours} placeholder="0" onChange={(e) => setHours(Number(e.target.value))} />
                            </div>
                            <div>
                                <p>Minutes (total time):</p>
                                <input className="bg-white rounded border-1 border-gray-600 w-45" type="number" value={minutes} placeholder="0" onChange={(e) => setMinutes(Number(e.target.value))} />
                            </div>
                            <div>
                                <p>Seconds (total time):</p>
                                <input className="bg-white rounded border-1 border-gray-600 w-45" type="number" value={seconds} placeholder="0" onChange={(e) => setSeconds(Number(e.target.value))} />
                            </div>
                        </div>

                        {/*Pace unit selection row*/}
                        <div className="flex justify-center gap-4 mb-4">
                            <label>
                                <input type="radio" value="PacePerKm" checked={paceUnit === "PacePerKm"} onClick={handlePaceUnitChange}/>
                                Pace per Km
                            </label>
                            <label>
                                <input type="radio" value="PacePerMi" checked={paceUnit === "PacePerMi"} onClick={handlePaceUnitChange}/>
                                Pace per Mi
                            </label>
                            <label>
                                <input type="radio" value="PaceKm/h" checked={paceUnit === "PaceKm/h"} onClick={handlePaceUnitChange}/>
                                Pace Km/h
                            </label>
                            <label>
                                <input type="radio" value="PaceMi/h" checked={paceUnit === "PaceMi/h"} onClick={handlePaceUnitChange}/>
                                Pace Mi/h
                            </label>
                        </div>

                        {/*Pace entry row */}
                        <div>
                            {/*Time input row*/}
                            <div className="flex justify-center m-4 gap-8">
                                <div>
                                    <p>Hours (pace):</p>
                                    <input className={`rounded border-1 border-gray-600 w-45 transition-colors duration-300 ${paceUnit === "PacePerKm" || paceUnit === "PacePerMi" ? "bg-white":"bg-gray-500 cursor-not-allowed"}`} disabled={!(paceUnit === "PacePerKm" || paceUnit === "PacePerMi")} type="number" value={paceHours} placeholder="0" onChange={(e) => setPaceHours(Number(e.target.value))} />
                                </div>
                                <div>
                                    <p>Minutes (pace):</p>
                                    <input className={`rounded border-1 border-gray-600 w-45 transition-colors duration-300 ${paceUnit === "PacePerKm" || paceUnit === "PacePerMi" ? "bg-white":"bg-gray-500 cursor-not-allowed"}`} disabled={!(paceUnit === "PacePerKm" || paceUnit === "PacePerMi")} type="number" value={paceMinutes} placeholder="0" onChange={(e) => setPaceMinutes(Number(e.target.value))} />
                                </div>
                                <div>
                                    <p>Seconds (pace):</p>
                                    <input className={`rounded border-1 border-gray-600 w-45 transition-colors duration-300 ${paceUnit === "PacePerKm" || paceUnit === "PacePerMi" ? "bg-white":"bg-gray-500 cursor-not-allowed"}`} disabled={!(paceUnit === "PacePerKm" || paceUnit === "PacePerMi")} type="number" value={paceSeconds} placeholder="0" onChange={(e) => setPaceSeconds(Number(e.target.value))} />
                                </div>
                            </div>
                            <div>
                                <p>Pace per hour:</p>
                                <input className={`rounded border-1 border-gray-600 w-45 transition-colors duration-300 ${paceUnit === "PaceKm/h" || paceUnit === "PaceMi/h" ? "bg-white":"bg-gray-500 cursor-not-allowed"}`} disabled={!(paceUnit === "PaceKm/h" || paceUnit === "PaceMi/h")} type="number" value={pacePerHour} placeholder="0" onChange={(e) => setPacePerHour(Number(e.target.value))} />
                            </div>
                        </div>

                        {/*Results display row*/}
                        <div className="min-h-47 items-center justify-center flex">
                            <div className={`flex-col ${distanceCalcResults.HaveResults ? "visible opacity-100":"invisible opacity-0"}`}>
                                <p>Kilometers: {distanceCalcResults.km}</p>
                                <p>Miles: {distanceCalcResults.mi}</p>
                                <p>Meters: {distanceCalcResults.m}</p>
                                <p>Yards: {distanceCalcResults.yds}</p>
                            </div>
                        </div>

                        <button onClick={handleSubmitDistanceCalculation} className="bg-cyan-600 rounded-2xl font-bold text-gray-800 py-3 px-6 mb-4 hover:cursor-pointer hover:bg-cyan-800">Calculate</button>

                    </div>

                </div>

            </div>

        </div>
    
    );

}