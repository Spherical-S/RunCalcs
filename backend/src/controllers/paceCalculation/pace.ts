import { PaceUnit } from "../../types/units-enums.js";
import unitConvert from "../../utils/convert-units.js";
import type { PaceUnits } from "../../types/unit.types.js";

export default function calculatePace(time: number, distance: number, unit: number): PaceUnits{

    var distances = unitConvert.convertDistance(distance, unit);

    var pace = time/distances.km;

    return unitConvert.convertPace(pace, PaceUnit.SecondsPerKm);

}