import { PaceUnit, DistanceUnit } from "../../types/units-enums.js";
import unitConvert from "../../utils/convert-units.js";

export default function calculateTime(pace: number, distance: number, paceUnit: number, distUnit: number): {time: number} {

    const distances = unitConvert.convertDistance(distance, distUnit, false);
    const paces = unitConvert.convertPace(pace, paceUnit, false);

    const time = paces.secPerKm*distances.km;

    return { "time": Math.round(time*100)/100 };

}