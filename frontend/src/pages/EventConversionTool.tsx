import { useState, useEffect } from "react";
import formatSecToPace from "../utils/FormatSecondsToTime.ts"
import { EVENTMAP } from "../utils/EventConversionEvents.ts";
import type { eventMapType } from "../utils/EventConversionEvents.ts";

type resultsType = {
    [event: string]: string
}

export default function EventConversionTool() {

    const [errorMessage, setErrorMessage] = useState("Waiting for API...");

    const [eventType, setEventType] = useState<keyof eventMapType>("Track");
    const [genderType, setGenderType] = useState("men");
    const [selectedEvent, setSelectedEvent] = useState("1500m");

    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");

    const [results, setResults] = useState<resultsType>({});

    useEffect(() => {
        document.title = "RunCalcs: Event Converter";
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

    function handleEventTypeChange(e: any){

        setErrorMessage("");

        setEventType(e.target.value);

        if (e.target.value === "Track"){
            setSelectedEvent("1500m");
        }
        if (e.target.value === "Short"){
            setSelectedEvent("1500msh");
        }
        if (e.target.value === "Road"){
            setSelectedEvent("RoadHM");
        }

        setHours("");
        setMinutes("");
        setSeconds("");
        setResults({});

    }

    function handleSelectedGenderChange(e: any){

        setErrorMessage("");
        setGenderType(e.target.value);
        setHours("");
        setMinutes("");
        setSeconds("");
        setResults({});

    }

    function handleSelectedEventChange(e: any){

        setErrorMessage("");
        setSelectedEvent(e.target.value);
        setHours("");
        setMinutes("");
        setSeconds("");
        setResults({});

    }

    function handleCalculateConversions(){

        setErrorMessage("");

        const hrs = hours === "" ? 0 : Number(hours);
        const mins = minutes === "" ? 0 : Number(minutes);
        const secs = seconds === "" ? 0 : Number(seconds);

        if((genderType === "men" && selectedEvent === "100mH") || (genderType === "women" && selectedEvent === "110mH")){
            setErrorMessage("Invalid event for this gender (Men --> 110mH / Women --> 100mH)");
            return;
        }

        if(hrs < 0 || mins < 0 || secs < 0){
            setErrorMessage("Please provide positive time values");
            return;
        }

        var time = secs + (mins*60) + (hrs * 60 * 60);

        if(time <= 0){
            setErrorMessage("Please provide positive time values");
            return;
        }

        var url = import.meta.env.VITE_API_URL + `/timeconverter/convert?event=${selectedEvent}&time=${time}&gender=${genderType}`;
        
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                var r : resultsType = {};
                Object.entries(data).map(([e, time]) => {
                    e = e.replace("sh", " indoor")
                    e = e.replace("Road", "Road ");
                    e = e.replace("Miles", " Miles");
                    if(time === null){
                        setErrorMessage("Error converting event...");
                        r[e as string] = "NaN";
                    }else{
                        r[e as string] = formatSecToPace(Number(time));
                    }
                })
                setResults(r);
            })
            .catch(err => {
                console.error("API request failed:", err.message);
                setErrorMessage("Invalid data or network error");
            });

    }

    return (
        <div className="flex flex-col gap-2 relative">
            <h1 className="font-sans font-bold text-4xl m-2 text-center">RunCalcs Event Conversion Tool</h1>

            {/*Page body*/}
            <div className="flex flex-col">

                {/*Calculator body*/}
                <div className="relative flex justify-center gap-10 flex-wrap">
                    
                    {/*Calculator card*/}
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">Event Conversion</h2>

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

                                    <select value={genderType} onChange={(e) => handleSelectedGenderChange(e)} className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                        <option key="0" value="men">Men</option>
                                        <option key="1" value="women">Women</option>
                                    </select>
                                </div>
                            </div>

                            {/*Event Selection input*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                                <div className="flex gap-2">

                                    <select value={selectedEvent} onChange={(e) => handleSelectedEventChange(e)} className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-cyan-500">
                                        {Object.entries(EVENTMAP[eventType]).map(([key, display]) => (
                                        <option key={key} value={key}>{display}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/*Event Mark input*/}
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

                            <button onClick={handleCalculateConversions}
                            className="w-full bg-cyan-600 text-white py-2 rounded-xl shadow hover:bg-cyan-700 hover:cursor-pointer transition">Calculate Conversions</button>

                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{errorMessage}</div>
                            )}

                            {results && Object.keys(results).length > 0 && (
                                <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                                    {/* <p>
                                        <span className="font-semibold">Km:</span>{" "}
                                        <span className="text-cyan-700">{distanceCalcResults.km}</span>
                                    </p> */}

                                    {Object.entries(results).map(([e, time]) => (
                                        <p>
                                            <span className="font-semibold">{e}:</span>{" "}
                                            <span className="text-cyan-700">{time}</span>
                                        </p>
                                    ))}

                                </div>
                            )}
                        </div>

                    </div>

                    {/*About section*/}
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">About the Calculator</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">How do event conversions work?</label>
                            <p className="block text-xs font-medium text-gray-600 mb-1">Event conversions are done primarily using World Athletics points. In the case an event doesn't exist in the World Athletics scoring tables, conversions are simply done by calculating the pace for the selected event and then calculating how long it would take to run the destination event at that pace. If you're interested, see my GitHub for more!</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">How do you use the event conversions tool?</label>
                            <p className="block text-xs font-medium text-gray-600 mb-1">Select an event type (Track, Short (aka Indoor), or Road), then select a gender category. Next, select the event you wish to convert from the "Event" dropdown and enter the time to convert. Hit calculate, and you will receive a list of events with converted times.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}