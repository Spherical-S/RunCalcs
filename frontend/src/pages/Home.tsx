import HomeNavigationButton from "../components/HomeNavigationButton";

export default function Home() {

    document.title = "RunCalcs: Home"

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

        </div>

    );

}