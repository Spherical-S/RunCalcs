import { DistanceUnit } from "../../types/units-enums.js";
import unitConvert from "../../utils/convert-units.js";
import type { DistanceUnits } from "../../types/unit.types.js";

export default function calculateDistance(time: number, pace: number, unit: number): DistanceUnits{

    var paces = unitConvert.convertPace(pace, unit)

    var kms = time/paces.secPerKm;

    return unitConvert.convertDistance(kms, DistanceUnit.Km);

}