import calculateSplitsByTime from "../splitsCalculation/byTime.js";
import calculatePace from "../paceCalculation/pace.js";
import calculateTime from "../paceCalculation/time.js";

import type { splitsReturn, split } from "../../types/splits.types.js";

export default function steepleSplitsByTime(time: number, distance: number, distUnit: number, pitType: string): {timeperlap: number}{

    var splitDist = 0;

    if(pitType === "inside"){
        splitDist = 395;
    }else{
        splitDist = 418;
    }

    const pace = calculatePace(time, distance, distUnit);

    const lapTime = calculateTime(pace.secPerKm, splitDist, 0, 2).time;

    return {timeperlap: lapTime};

}