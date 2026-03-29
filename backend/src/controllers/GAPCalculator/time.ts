import { DistanceUnit, PaceUnit } from "../../types/units-enums.js";
import unitConvert from "../../utils/convert-units.js";

import calculateGAPByPace from "./pace.js";
import calculateTime from "../paceCalculation/time.js";

export default function calculateGradeAdjustedTime(time: number, distance: number, distUnit: number, grade: number): {time: number}{

    const distInKm = unitConvert.convertDistance(distance, distUnit, false).km;
    const pace = time / distInKm;

    const GAP = calculateGAPByPace(pace, PaceUnit.SecondsPerKm, grade);

    return calculateTime(GAP.secPerKm, distInKm, PaceUnit.SecondsPerKm, DistanceUnit.Km);

}