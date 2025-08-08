import calculateTime from "../paceCalculation/time.js";

export default function steepleSplitsByPace(pace: number, paceUnit: number, pitType: string): {timeperlap: number}{

    var dist = 0;

    if(pitType === "inside"){
        dist = 395;
    }else{
        dist = 418;
    }

    const time = calculateTime(pace, dist, paceUnit, 2).time;

    return {timeperlap: time};

}