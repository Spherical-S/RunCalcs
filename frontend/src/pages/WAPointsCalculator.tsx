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

    const [interpolate, setInterpolate] = useState(false);

    const [points, setPoints] = useState("");
    const [mark, setMark] = useState("");
    const [markHours, setMarkHours] = useState("");
    const [markMinutes, setMarkMinutes] = useState("");
    const [markSeconds, setMarkSeconds] = useState("");

    const [errorMessage, setErrorMessage] = useState("Waiting for API...");

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
                setErrorMessage("");
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("API is sleeping... Calculators may not work or take longer than usual");
            });
    }, []);

    useEffect(() => {
            const pts = points === "" ? 0 : Number(points);
            if(!(pts === 0)){
                handleCalculateMark();
            }
    }, [selectedEvent, genderType, eventType, interpolate]);

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

    }

    function handleSelectedEventChange(e: any){

        setErrorMessage("");

        setSelectedEvent(e.target.value);

    }

    function handleInterpolateToggle(){
        setInterpolate(!interpolate);
    }

    function handleCalculatePoints(){

        setErrorMessage("");

        const mhrs = markHours === "" ? 0 : Number(markHours);
        const mmins = markMinutes === "" ? 0 : Number(markMinutes);
        const msecs = markSeconds === "" ? 0 : Number(markSeconds);
        const m = mark === "" ? 0 : Number(mark);
        const i = interpolate ? 1 : 0;

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

        var url = import.meta.env.VITE_API_URL + `/wapointscalc/perftopts?category=${eventType.toLowerCase()}&gender=${genderType.toLowerCase()}&event=${selectedEvent}&target=${perf}&interpolate=${i}`;

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
        const i = interpolate ? 1 : 0;

        if(pts < 0){
            setPoints("");
            return;
        }

        if(pts === 0){
            setErrorMessage("Minimum value for points is 1");
            setPoints("");
            return;
        }

        if(pts > 1400){
            setErrorMessage("Maximum value for points is 1400");
            setPoints("");
            return;
        }

        var url = import.meta.env.VITE_API_URL + `/wapointscalc/ptstoperf?category=${eventType.toLowerCase()}&gender=${genderType.toLowerCase()}&event=${selectedEvent}&target=${pts}&interpolate=${i}`;

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
                <div className="relative flex justify-center gap-10 flex-wrap">
                    
                    {/*Calculator card*/}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-6">
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

                            {/*Interpolate toggle input*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interpolate?</label>
                                <div className="flex gap-2">

                                    <button type="button" onClick={handleInterpolateToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${interpolate ? "bg-cyan-600" : "bg-gray-300"}`}>
                                        <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${interpolate ? "translate-x-6" : "translate-x-1"}`}/>
                                    </button>
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

                    {/*About section*/}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">About the Calculator</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">What are WA points?</label>
                            <p className="block text-xs font-medium text-gray-600 mb-1">World Athletics (WA) points are a metric used by the international governing body of the sport to compare performances across events. WA points provide a way to approximate equivalent standards between events even if the events are completely different. For example, if you score 1000 points in the mens outdoor 1500m (3:48.17), the equivalent performance, according to World Athletics, in the womens triple jump is 12.85m (1000 points).</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">How are WA points calculated?</label>
                            <p className="block text-xs font-medium text-gray-600 mb-1">Points are calculated using the official 2025 scoring tables provided by <a href="https://worldathletics.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">World Athletics</a>. This calculator takes JSON data scraped from the scoring tables, then searches through the data sets to find the performance or points equivalent you're looking for. If you're interested, see more on my <a href="https://github.com/Spherical-S" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">GitHub</a>.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                            <p className="block text-xs font-medium text-gray-600 mb-1">Credit to <a href="https://jeffchen.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Jeff Chen</a> for providing the scraping tool which converts the WA scoring tables PDF to JSON.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}