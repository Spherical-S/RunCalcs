import { useEffect, useState } from "react";

export default function About() {

    document.title = "RunCalcs: About";

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
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-left">
            <h1 className="text-4xl font-bold text-center">About RunCalcs</h1>

            <section>
                <h2 className="text-2xl font-semibold mb-2">Purpose</h2>
                <p className="leading-relaxed text-gray-700">
                RunCalcs combines my interests in running/athletics and software
                development by creating an all-in-one destination for running-related
                calculators. I consider myself a data nerd and love the many tools
                that provide insights into running, but I found it inconvenient that
                they were scattered across different websites. RunCalcs solves that by
                bringing them all together in one place.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">Features</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Pace Calculator: Calculate a runs pace, distance, or time</li>
                <li>Unit Converter: Convert between units for both distances and paces</li>
                <li>WA Points Calculation: Easily calculate how many WA points a performance gives and vice versa</li>
                <li>Splits Calculator: Calculate the splits required to run a certain time/pace</li>
                <li>Steeplechase Lap Time Calculator: Calculate the time needed per lap to achieve a certain time/pace in the Steeplechase depending on where the water pit is located</li>
                <li>Event Conversion Tool: Find equivalent times between similar events</li>
                <li>Indoor Flat/Banked Track Converter: Convert times between flat, undersized, and banked indoor tracks.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">Tech Stack</h2>
                <p className="leading-relaxed text-gray-700">
                I built RunCalcs to push myself with new technologies. The backend is
                an API built with <strong>TypeScript</strong> and{" "}
                <strong>Express</strong>, while the frontend is powered by{" "}
                <strong>React</strong>, <strong>TypeScript</strong>,{" "}
                <strong>TailwindCSS</strong>, and <strong>Vite</strong>. While I had prior
                experience in JavaScript, TypeScript quickly became a favorite of
                mine: it’s simple enough to be intuitive, yet strict enough to prevent
                errors while coding.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">About Me</h2>
                <p className="leading-relaxed text-gray-700">
                My name is <strong>Sadiq Shahid</strong>, and I’m pursuing a
                Bachelor’s Degree in Computer Science at the University of New
                Brunswick. I’m also a cross country and distance track & field
                athlete. I’ve been drawn to programming since middle school, and I
                enjoy it both as a profession and hobby. I’m always experimenting with
                new ideas, projects, and improvements to existing work. If you have any
                questions, suggestions, or comments, feel free to reach out!
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">Links & Contact</h2>
                <ul className="space-y-2 text-blue-600">
                    <li className="flex items-center gap-2">
                        <a href="mailto:sadiq.shahid101@gmail.com">sadiq.shahid101@gmail.com</a>
                    </li>
                    <li className="flex items-center gap-2">
                        <a href="https://github.com/Spherical-S/RunCalcs" target="_blank" rel="noreferrer">github.com/Spherical-S/RunCalcs</a>
                    </li>
                    <li className="flex items-center gap-2">
                        <a href="https://www.linkedin.com/in/sadiqshahid" target="_blank" rel="noreferrer">linkedin.com/in/sadiqshahid</a>
                    </li>
                </ul>
            </section>

            {errorMessage && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                {errorMessage}
                </div>
            )}
        </div>
    );
}