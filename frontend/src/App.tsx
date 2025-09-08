import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import PaceCalculator from "./pages/PaceCalculator";
import UnitConverter from "./pages/UnitConverter";
import WAPointsCalculator from "./pages/WAPointsCalculator";
import SplitsCalculator from "./pages/SplitsCalculator";
import SteepleLapsCalculator from "./pages/SteepleLapsCalculator";
import EventConversionTool from "./pages/EventConversionTool";
import FlatBankedTrackConverter from "./pages/FlatBankedTrackConverter";
import About from "./pages/About";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pace" element={<PaceCalculator />} />
          <Route path="/units" element={<UnitConverter />} />
          <Route path="/wa-points" element={<WAPointsCalculator />} />
          <Route path="/splits" element={<SplitsCalculator />} />
          <Route path="/steeple-laps" element={<SteepleLapsCalculator />} />
          <Route path="/events" element={<EventConversionTool />} />
          <Route path="/flat-banked-track" element={<FlatBankedTrackConverter />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}