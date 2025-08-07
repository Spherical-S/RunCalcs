import { PaceUnit, DistanceUnit } from "../../types/units-enums.js";
import unitConvert from "../../utils/convert-units.js";

export default function calculateTime(pace: number, distance: number, paceUnit: number, distUnit: number): {time: number}{

    var time;

    var distances = unitConvert.convertDistance(distance, distUnit);
    var paces = unitConvert.convertPace(pace, paceUnit);

    time = paces.secPerKm*distances.km;

    return {"time": time};

}