import { useState, useEffect } from "react";
import { INDOORDOUBLEMAP } from "../utils/FlatBankedDoubleConversions.ts";
import formatSecToTime from "../utils/FormatSecondsToTime.ts"
import type { indoorDoubleMapType } from "../utils/FlatBankedDoubleConversions.ts";

export default function FlatBankedTrackConverter() {

    const [flatOpen, setFlatOpen] = useState(true);
    const [undersizedOpen, setUndersizedOpen] = useState(false);
    const [bankedOpen, setBankedOpen] = useState(false);

    const [gender, setGender] = useState<"Men" | "Women">("Men");
    const [event, setEvent] = useState("1500msh");

    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");

    const [isDouble, setIsDouble] = useState(false);
    const [doubleEvent, setDoubleEvent] = useState("");

    const [errorMessage, setErrorMessage] = useState("Waiting for API...");

    const [results, setResults] = useState({"undersized": "", "flat": "", "banked": "", "double": ""});

    useEffect(() => {
        document.title = "RunCalcs: Indoor Flat/Banked Converter";
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

    function handleFlatClick(){

        setErrorMessage("");
        setFlatOpen(true);
        setUndersizedOpen(false);
        setBankedOpen(false);

    }

    function handleUndersizedClick(){

        setErrorMessage("");
        setFlatOpen(false);
        setUndersizedOpen(true);
        setBankedOpen(false);

    }

    function handleBankedClick(){

        setErrorMessage("");
        setFlatOpen(false);
        setUndersizedOpen(false);
        setBankedOpen(true);

    }

    function handleEventChange(e: any){

        setErrorMessage("");
        setEvent(e.target.value);
        setDoubleEvent(Object.entries(INDOORDOUBLEMAP[e.target.value as keyof indoorDoubleMapType].doubles)[0][0]);

    }

    function handleGenderChange(e: any){

        setErrorMessage("");
        setGender(e.target.value);

    }

    function handleDoubleToggle(){

        setErrorMessage("");

        if(!isDouble){
            setDoubleEvent(Object.entries(INDOORDOUBLEMAP[event].doubles)[0][0]);
        }

        setIsDouble(!isDouble);

    }

    function handleDoubleEventChange(e: any){

        setErrorMessage("");

        setDoubleEvent(e.target.value);

    }

    function handleSubmitConversion(){

        setErrorMessage("");

        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);

        if(hrs < 0 || mins < 0 || secs < 0){
            setErrorMessage("Please provide positive time values");
            return;
        }

        if(hrs === 0 && mins === 0 && secs === 0){
            setErrorMessage("Please provide time values");
            return;
        }

        var time = secs + (mins*60) + (hrs * 60 * 60);

        var url = "";

        if(event === "4x200msh" || event === "4x400msh" || event === "4x800msh"){
            url = import.meta.env.VITE_API_URL + `/flatbankedconverter/convert?event=${event.slice(2)}&time=${time}&gender=${gender.toLowerCase()}&isDouble=${isDouble}&doubleEvent=${doubleEvent}&isFlat=${undersizedOpen || flatOpen}&isUndersize=${undersizedOpen}`;
        }else{
            url = import.meta.env.VITE_API_URL + `/flatbankedconverter/convert?event=${event}&time=${time}&gender=${gender.toLowerCase()}&isDouble=${isDouble}&doubleEvent=${doubleEvent}&isFlat=${undersizedOpen || flatOpen}&isUndersize=${undersizedOpen}`;
        }

        fetch(url)
        .then(res => {
            if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            var undersizedTime = formatSecToTime(Number(data.undersized));
            var flatTime = formatSecToTime(Number(data.flat));
            var bankedTime = formatSecToTime(Number(data.banked));
            var doubleTime;
            console.log(data.double)
            if(data.double === null){
                doubleTime = "NaN";
                setErrorMessage("Error converting double...");
            }else if(Number(data.double) === 0){
                doubleTime = "";
            }else{
                doubleTime = formatSecToTime(Number(data.double));
            }
            setResults({"undersized": undersizedTime, "flat": flatTime, "banked": bankedTime, "double": doubleTime});
        })
        .catch(err => {
            console.error("API request failed:", err.message);
            setErrorMessage("Invalid data or network error");
        });

    }


    return (
        <div className="flex flex-col gap-2 relative">
            <h1 className="font-sans font-bold text-4xl m-2 text-center">RunCalcs Indoor Flat/Banked Track Converter</h1>

            {/*Page body*/}
            <div className="relative flex justify-center flex-wrap gap-6">

                {/*Calculator body*/}
                <div className="relative flex justify-center flex-wrap">

                    {/*Mode select buttons*/}
                    <div className="text-center">
                        <button onClick={handleFlatClick} className={`${flatOpen ? "bg-white border-b-white text-black":"bg-cyan-600 text-white hover:bg-white hover:text-black hover:border-b-white"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-25 mr-1`}>Flat</button>
                        <button onClick={handleUndersizedClick} className={`${undersizedOpen ? "bg-white border-b-white text-black":"bg-cyan-600 text-white hover:bg-white hover:text-black hover:border-b-white"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-25 mr-1`}>Undersized</button>
                        <button onClick={handleBankedClick} className={`${bankedOpen ? "bg-white border-b-white text-black":"bg-cyan-600 text-white hover:bg-white hover:text-black hover:border-b-white"} border border-gray-500 rounded-t-2xl hover:cursor-pointer p-2 w-25 mr-1`}>Banked</button>
                    </div>

                    <div className="w-full">
                        {/*Flat Track Converter*/}
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">{
                                flatOpen ? "Flat Track Converter" : undersizedOpen ? "Undersized Track Converter" : "Banked Track Converter"
                            }</h2>

                            <div className="space-y-4">

                                {/*Event Type input*/}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                                    <div className="flex gap-2">

                                        <select value={event} onChange={(e) => handleEventChange(e)} className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                            {Object.keys(INDOORDOUBLEMAP).map((eType, i) => (
                                            <option key={i} value={eType}>{INDOORDOUBLEMAP[eType].display}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/*Event Gender input*/}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender Category</label>
                                    <div className="flex gap-2">

                                        <select value={gender} onChange={(e) => handleGenderChange(e)} className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                            <option key="0" value="Men">Men</option>
                                            <option key="1" value="Women">Women</option>
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

                                {/*Double toggle input*/}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Double?</label>
                                    <div className="flex gap-2">

                                        <button type="button" onClick={handleDoubleToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:cursor-pointer ${isDouble ? "bg-cyan-600" : "bg-gray-300"}`}>
                                            <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDouble ? "translate-x-6" : "translate-x-1"}`}/>
                                        </button>
                                    </div>
                                </div>

                                {/*Double Event input*/}
                                {isDouble && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Double Event</label>
                                        <div className="flex gap-2">

                                            <select value={doubleEvent} onChange={(e) => handleDoubleEventChange(e)} className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                                {Object.entries(INDOORDOUBLEMAP[event].doubles).map(([key, display]) => (
                                                <option key={key} value={key}>{display}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                            </div>

                            <button onClick={handleSubmitConversion}
                                className="w-full bg-cyan-600 text-white py-2 rounded-xl shadow hover:bg-cyan-700 hover:cursor-pointer transition">Calculate Conversions</button>

                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{errorMessage}</div>
                            )}

                            {results && (
                                <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                                    <p>
                                        <span className="font-semibold">Undersized time:</span>{" "}
                                        <span className="text-cyan-700">{results.undersized}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold">Flat time:</span>{" "}
                                        <span className="text-cyan-700">{results.flat}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold">Banked time:</span>{" "}
                                        <span className="text-cyan-700">{results.banked}</span>
                                    </p>

                                    {results.double !== "" && (
                                        <p>
                                            <span className="font-semibold">Double conversion:</span>{" "}
                                            <span className="text-cyan-700">{results.double}</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/*About section*/}
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">About the Calculator</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">How Does The Undersized/Flat/Banked Conversion Work?</label>
                        <p className="block text-xs font-medium text-gray-600 mb-1">This calculator is based off offical USPORT/NCAA Indoor Track and Field undersized/flat/banked track conversion metrics. Performance marks are converted into seconds then converted based off a ratio. Ratios differ between events and genders, and times are always rounded up to the slower time up to 2 decimal places. If you're interested, see more on my <a href="https://github.com/Spherical-S" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">GitHub</a>.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">What Is A Double Conversion?</label>
                        <p className="block text-xs font-medium text-gray-600 mb-1">It is common for athletes to run non-standardized distances. These performances are still valid in qualifying for certain meets (like nationals), and therefore need to be converted to the standardized distance for qualification. Conversions stack when events are run at non-standard distances on a flat or undersized track, and so this calculator exists to simplify calculations. It is important to note this calculators double conversions are based off USPORT conversion standards, which converts to different events using World Athletics points.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}