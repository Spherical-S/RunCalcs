import unitConvert from "../../utils/convert-units.js";
import type { DistanceUnits } from "../../types/unit.types.js";

export default function convertDistance(distance: number, unit: number): DistanceUnits{

    return unitConvert.convertDistance(distance, unit, true);

}