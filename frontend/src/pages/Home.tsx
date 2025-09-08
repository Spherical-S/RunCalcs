import HomeNavigationButton from "../components/HomeNavigationButton";
import { useEffect, useState } from "react";

export default function Home() {

    document.title = "RunCalcs: Home"

    const [errorMessage, setErrorMessage] = useState("Waiting for API...");

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

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="font-sans font-bold text-4xl text-center mb-2">
                Welcome to RunCalcs
            </h1>
            <p className="font-sans font-medium text-xl text-center mb-10">
                Select a calculator below:
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <HomeNavigationButton label="Pace Calculator" description="Calculate a runs pace, distance, or time" color="bg-blue-600" hoverColor="hover:bg-blue-700" redirect="/pace" />
                <HomeNavigationButton label="Unit Converter" description="Convert units for distances & paces" color="bg-green-600" hoverColor="hover:bg-green-700" redirect="/units" />
                <HomeNavigationButton label="WA Points Calculator" description="Get official WA points for a specific performance and vice versa" color="bg-orange-600" hoverColor="hover:bg-orange-700" redirect="/wa-points" />
                <HomeNavigationButton label="Splits Calculator" description="Break down race/workout splits" color="bg-pink-600" hoverColor="hover:bg-pink-700" redirect="/splits" />
                <HomeNavigationButton label="Steeplechase Laps Calculator" description="Estimate lap times depending on water pit location" color="bg-cyan-600" hoverColor="hover:bg-cyan-700" redirect="/steeple-laps" />
                <HomeNavigationButton label="Event Conversion Tool" description="Convert times between similar events" color="bg-red-600" hoverColor="hover:bg-red-700" redirect="/events" />
                <HomeNavigationButton label="Flat/Banked Track Converter" description="Calculate between flat, banked, and undersized indoor tracks" color="bg-indigo-600" hoverColor="hover:bg-indigo-700" redirect="/flat-banked-track" />
                <HomeNavigationButton label="About RunCalcs" description="Learn more about the project" color="bg-purple-600" hoverColor="hover:bg-purple-700" redirect="/about" />
            </div>

            {errorMessage && (
                <div className="w-1/2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mx-auto">{errorMessage}</div>
            )}

        </div>
    );

}