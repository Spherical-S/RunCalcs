import HomeNavigationButton from "../components/HomeNavigationButton";
import { useEffect, useState } from "react";

export default function Home() {

    document.title = "RunCalcs: Home"

    const [errorMessage, setErrorMessage] = useState("");

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
                setErrorMessage("API is sleeping... Calculators may not work or take longer than usual");
            });
    }, []);

    return(

        <div className="flex flex-col gap-2 text-center">
            <h1 className="font-sans font-bold text-4xl">Welcome to RunCalcs</h1>

            <p className="font-sans font-semibold text-2xl mb-5">Select a calculator below:</p>

            <HomeNavigationButton label="Pace Calculator" color="bg-blue-600" hoverColor="hover:bg-blue-800" redirect="/pace"/>
            <HomeNavigationButton label="Unit Converter" color="bg-green-600" hoverColor="hover:bg-green-800" redirect="/units"/>
            <HomeNavigationButton label="WA Points Calculator" color="bg-orange-600" hoverColor="hover:bg-orange-800" redirect="/wa-points"/>
            <HomeNavigationButton label="Splits Calculator" color="bg-pink-600" hoverColor="hover:bg-pink-800" redirect="/splits"/>
            <HomeNavigationButton label="Steeplechase Laps Calculator" color="bg-cyan-600" hoverColor="hover:bg-cyan-800" redirect="/steeple-laps"/>
            <HomeNavigationButton label="Event Conversion Tool" color="bg-red-600" hoverColor="hover:bg-red-800" redirect="/events"/>
            <HomeNavigationButton label="Flat/Banked Track Converter" color="bg-indigo-600" hoverColor="hover:bg-indigo-800" redirect="/flat-banked-track"/>
            {errorMessage && (
                <div className="w-1/2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mx-auto">{errorMessage}</div>
            )}

        </div>

    );

}