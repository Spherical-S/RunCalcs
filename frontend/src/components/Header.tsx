import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";

/*
export default function Header() {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => firstLinkRef.current?.focus(), 50);
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm border-b z-40 flex items-center justify-between px-4">
        <Link
          to="/"
          className="text-lg font-semibold"
          onClick={() => setOpen(false)}
        >
          RunCalcs
        </Link>

        <button
          className="p-2 rounded-md focus:outline-none focus:ring hover:bg-gray-100"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </button>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-black/30" />
        <nav
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow transform transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 flex items-center px-4 border-b">
            <span className="text-lg font-semibold">Menu</span>
            <button
              className="ml-auto p-2 rounded-md hover:bg-gray-100"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <ul className="p-4 space-y-2">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
                ref={firstLinkRef}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/pace"
                className="block py-2 px-3 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Pace Calculator
              </Link>
            </li>
            <li>
              <Link
                to="/wa-points"
                className="block py-2 px-3 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                WA Points
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="h-14" />
    </>
  );
}
*/

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
            <div className="bg-gray-700 mb-5 flex">
                <Link to="/">
                    <h2 className="font-sans font-semibold text-3xl m-2 ml-5 text-white">RunCalcs</h2>
                </Link>
                <button className="fixed top-0 right-0 m-3 hover:cursor-pointer" onClick={()=>setOpen(true)}>
                    <img className="w-8 h-8" src="/menu.png" alt="menu" />
                </button>
            </div>

            <div className={`${open ? "visible opacity-100":"invisible opacity-0"} fixed inset-0 z-50`} onClick={setClose}>
                <div className="absolute inset-0 bg-black/30">

                    <nav className={`fixed top-0 left-0 h-full w-64 rounded-r-2xl flex-col bg-white shadow transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
                        
                        <div className="flex">
                            <h2 className="font-sans font-semibold text-2xl m-3">Menu</h2>
                            <h2 className="font-sans font-semibold text-2xl m-3 fixed top-0 right-0 hover:cursor-pointer" onClick={setClose}>X</h2>
                        </div>
                        
                        <hr className="border-black border-t-2 mb-4" />

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
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );

}