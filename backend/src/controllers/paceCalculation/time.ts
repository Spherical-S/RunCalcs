import { PaceUnit, DistanceUnit } from "../../types/units-enums.js";
import unitConvert from "../../utils/convert-units.js";

export default function calculateTime(pace: number, distance: number, paceUnit: number, distUnit: number): {time: number}{

    var time;

    var distances = unitConvert.convertDistance(distance, distUnit, false);
    var paces = unitConvert.convertPace(pace, paceUnit, false);

    time = paces.secPerKm*distances.km;

    return {"time": Math.round(time*100)/100};

}