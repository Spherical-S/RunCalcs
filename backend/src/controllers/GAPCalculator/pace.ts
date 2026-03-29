import { PaceUnit } from "../../types/units-enums.js";
import unitConvert from "../../utils/convert-units.js";
import type { PaceUnits } from "../../types/unit.types.js";

export default function calculateGradeAdjustedPace(pace: number, paceUnit: number, grade: number): PaceUnits{

    const i = grade/100;
    var paceSecPerKm = unitConvert.convertPace(pace, paceUnit, false).secPerKm;

    const cost = 155.4*(i**5) - 30.4*(i**4) - 43.3*(i**3) + 46.3*(i**2) + 19.5*(i) + 3.6;

    return unitConvert.convertPace(paceSecPerKm/(cost/3.6), PaceUnit.SecondsPerKm, true);

}