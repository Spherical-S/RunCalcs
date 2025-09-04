import { useState, useEffect } from "react";
import { EVENTMAP } from "../utils/WAPointsEvents.ts";
import type { eventMapType, typeGenders } from "../utils/WAPointsEvents.ts";

function isTimeBasedEvent(eventType: keyof eventMapType, event: string){

    if(eventType === "Field"){
        return false;
    }

    if(eventType === "Road"){
        return true;
    }

    if(eventType === "Short"){
        return !(event === "Pent.sh" || event === "Hept.sh");
    }

    if(eventType === "Track"){
        return !(event === "Dec." || event === "Hept.");
    }

}

export default function WAPointsCalculator() {

    const [eventType, setEventType] = useState<keyof eventMapType>("Track");
    const [genderType, setGenderType] = useState<keyof typeGenders>("Men");
    const [selectedEvent, setSelectedEvent] = useState("1500m");

    const [points, setPoints] = useState("");
    const [mark, setMark] = useState("");
    const [markHours, setMarkHours] = useState("");
    const [markMinutes, setMarkMinutes] = useState("");
    const [markSeconds, setMarkSeconds] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        document.title = "RunCalcs: WA Points Calculator";
    }, []);

    useEffect(() => {
            const url = import.meta.env.VITE_API_URL + "/ping"
            fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("API is sleeping... Calculators may be slow to start");
            });
    }, []);

    useEffect(() => {
        if (selectedEvent || genderType) {
            if(points !== ""){
                handleCalculateMark();
            }
        }
    }, [selectedEvent, genderType]);

    function handleReset(){
        setErrorMessage("");
        setMark("");
        setMarkHours("");
        setMarkMinutes("");
        setMarkSeconds("");
        setPoints("");
    }

    function handleEventTypeChange(e: any){

        setErrorMessage("");

        setEventType(e.target.value);

        if (e.target.value === "Track"){
            setSelectedEvent("1500m");
        }
        if (e.target.value === "Field"){
            setSelectedEvent("LJ");
        }
        if (e.target.value === "Short"){
            setSelectedEvent("1500msh");
        }
        if (e.target.value === "Road"){
            setSelectedEvent("RoadHM");
        }

        handleCalculateMark();

    }

    function handleGenderTypeChange(e: any){

        setErrorMessage("");

        setGenderType(e.target.value);
        if(!(selectedEvent in EVENTMAP[eventType][e.target.value as keyof typeGenders])){
            if (eventType === "Track"){
                setSelectedEvent("1500m");
            }
            if (eventType === "Field"){
                setSelectedEvent("LJ");
            }
            if (eventType === "Short"){
                setSelectedEvent("1500msh");
            }
            if (eventType === "Road"){
                setSelectedEvent("RoadHM");
            }
        }

        handleCalculateMark();

    }

    function handleSelectedEventChange(e: any){

        setErrorMessage("");

        setSelectedEvent(e.target.value);

    }

    function handleCalculatePoints(){

        setErrorMessage("");

        const mhrs = markHours === "" ? 0 : Number(markHours);
        const mmins = markMinutes === "" ? 0 : Number(markMinutes);
        const msecs = markSeconds === "" ? 0 : Number(markSeconds);
        const m = mark === "" ? 0 : Number(mark);

        var perf = 0;

        if(isTimeBasedEvent(eventType, selectedEvent)){

            if(mhrs < 0){
                setMarkHours("");
                return;
            }
            if(mmins < 0){
                setMarkMinutes("");
                return;
            }
            if(msecs < 0){
                setMarkSeconds("");
                return;
            }

            perf = msecs + (mmins*60) + (mhrs*60*60);

        }

        if(!isTimeBasedEvent(eventType, selectedEvent)){
            
            if(m < 0){
                setMark("");
                return;
            }

            perf = m;
            
        }

        var url = import.meta.env.VITE_API_URL + `/wapointscalc/perftopts?category=${eventType.toLowerCase()}&gender=${genderType.toLowerCase()}&event=${selectedEvent}&target=${perf}&interpolate=0`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setPoints(String(data.points));
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    function handleCalculateMark(){

        setErrorMessage("");

        const pts = points === "" ? 0 : Number(points);

        if(pts < 0){
            setPoints("");
            return;
        }

        if(pts === 0){
            setErrorMessage("Minimum value for points is 1");
            setPoints("");
        }

        if(pts > 1400){
            setErrorMessage("Maximum value for points is 1400");
            setPoints("");
        }

        var url = import.meta.env.VITE_API_URL + `/wapointscalc/ptstoperf?category=${eventType.toLowerCase()}&gender=${genderType.toLowerCase()}&event=${selectedEvent}&target=${pts}&interpolate=0`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if(isTimeBasedEvent(eventType, selectedEvent)){

                    const secs = Number(data.mark);

                    const hours = Math.floor(secs / 3600);
                    const minutes = Math.floor((secs % 3600) / 60);
                    const secondsRaw = secs % 60;

                    const seconds = `${Math.floor(secondsRaw).toString().padStart(2, '0')}.${(secondsRaw % 1).toFixed(2).slice(2)}`;

                    const pad = (n: number) => n.toString().padStart(2, '0');

                    if (hours > 0) {
                        setMarkHours(String(hours));
                        setMarkMinutes(String(pad(minutes)));
                        setMarkSeconds(String(seconds));
                    } else {
                        setMarkHours("");
                        setMarkMinutes(String(minutes));
                        setMarkSeconds(String(seconds));
                    }

                }else{
                    
                    setMark(String(data.mark));
                    
                }
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });
        
    }

    return (
        <div className="flex flex-col gap-2 relative">
            <h1 className="font-sans font-bold text-4xl m-2 text-center">RunCalcs Wold Athletics Points Calculator</h1>

            {/*Page body*/}
            <div className="flex flex-col">

                {/*Calculator body*/}
                <div className="relative">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">WA Points Calculator</h2>

                        <div className="space-y-4">

                            {/*Event Type input*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                                <div className="flex gap-2">

                                    <select value={eventType} onChange={(e) => handleEventTypeChange(e)} className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                        {Object.keys(EVENTMAP).map((eType, i) => (
                                        <option key={i} value={eType}>{eType}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/*Event Gender input*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender Category</label>
                                <div className="flex gap-2">

                                    <select value={genderType} onChange={(e) => handleGenderTypeChange(e)} className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                        {Object.keys(EVENTMAP[eventType]).map((gType, i) => (
                                        <option key={i} value={gType}>{gType}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/*Event Selection input*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                                <div className="flex gap-2">

                                    <select value={selectedEvent} onChange={(e) => handleSelectedEventChange(e)} className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                        {Object.entries(EVENTMAP[eventType][genderType]).map(([key, display]) => (
                                        <option key={key} value={key}>{display}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/*Event Mark input*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Performance {isTimeBasedEvent(eventType, selectedEvent) ? "(hh:mm:ss.ss)": eventType==="Field" ? "(meters)":"(pts)"}</label>
                                <div className="flex gap-2">

                                    {isTimeBasedEvent(eventType, selectedEvent) && (
                                        <>
                                        <input type="number" placeholder="hh" value={markHours} onChange={(e) => setMarkHours(e.target.value)} onBlur={handleCalculatePoints}
                                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                        <span className="self-center">:</span>

                                        <input type="number" placeholder="mm" value={markMinutes} onChange={(e) => setMarkMinutes(e.target.value)} onBlur={handleCalculatePoints}
                                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />

                                        <span className="self-center">:</span>

                                        <input type="number" placeholder="ss" value={markSeconds} onChange={(e) => setMarkSeconds(e.target.value)} onBlur={handleCalculatePoints}
                                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:ring-2 focus:ring-cyan-500" />
                                        </>
                                    )}

                                    {!isTimeBasedEvent(eventType, selectedEvent) && (
                                        <>
                                        <input type="number" placeholder="0" value={mark} onChange={(e) => setMark(e.target.value)} onBlur={handleCalculatePoints}
                                        className="w-24 rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500" />
                                        </>
                                    )}

                                </div>
                            </div>

                            {/*Event Points input*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                                <div className="flex gap-2">

                                    <input type="number" placeholder="0" value={points} onChange={(e) => setPoints(e.target.value)} onBlur={handleCalculateMark}
                                    className="w-24 rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500" />

                                </div>
                            </div>

                            <button onClick={handleReset}
                            className="w-full bg-cyan-600 text-white py-2 rounded-xl shadow hover:bg-cyan-700 hover:cursor-pointer transition">Reset</button>

                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{errorMessage}</div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}