import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";

export default function Header(){

    const [open, setOpen] = useState(false);
    const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

    const setClose = () => setOpen(false);

    useEffect(() => {

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape"){
                setOpen(false);
            }
        };

        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("keydown", onKey);
        };

    }, []);

    useEffect(() => {
        if (open){
            setTimeout(() => firstLinkRef.current?.focus(), 50);
        }
    }, [open]);

    return(
        <>
            <div className="bg-gray-700 mb-5 flex relative">
                <Link to="/">
                    <h2 className="font-sans font-semibold text-3xl m-2 ml-5 text-white">RunCalcs</h2>
                </Link>
                <button className="absolute top-0 right-0 m-3 hover:cursor-pointer" onClick={()=>setOpen(true)}>
                    <img className="w-8 h-8" src="/menu.png" alt="menu" />
                </button>
            </div>

            <div className={`${open ? "visible opacity-100":"invisible opacity-0"} fixed inset-0 z-50`} onClick={setClose}>
                <div className="absolute inset-0 bg-black/30">

                    <nav className={`fixed top-0 left-0 h-full w-64 rounded-r-2xl flex flex-col bg-white shadow transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`} onClick={(e) => e.stopPropagation()}>

                        <div className="flex justify-between items-center p-3">
                            <h2 className="font-sans font-semibold text-2xl">Menu</h2>
                            <button onClick={setClose} className="text-2xl font-bold">×</button>
                        </div>

                        <hr className="border-black border-t-2 mb-2" />

                        <div className="flex-1 overflow-y-auto">
                            <ul>
                                <li onClick={setClose}>
                                    <MenuItem label="Home" icon="/home.png" redirect="/" />
                                    <MenuItem label="Pace Calculator" icon="/pace.png" redirect="/pace" />
                                    <MenuItem label="Unit Converter" icon="/unitconvert.png" redirect="/units" />
                                    <MenuItem label="WA Points Calculator" icon="/points.png" redirect="/wa-points" />
                                    <MenuItem label="Splits Calculator" icon="/splits.png" redirect="/splits" />
                                    <MenuItem label="Steeplechase Laps Calculator" icon="/steeplelaps.png" redirect="/steeple-laps" />
                                    <MenuItem label="Event Conversion Tool" icon="/eventconverter.png" redirect="/events" />
                                    <MenuItem label="Flat/Banked Track Converter" icon="/flatbanked.png" redirect="/flat-banked-track" />
                                    <MenuItem label="About" icon="/about.png" redirect="/about" />
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );

}