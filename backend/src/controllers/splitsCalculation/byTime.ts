import unitConvert from "../../utils/convert-units.js";

import type { splitsReturn, split } from "../../types/splits.types.js";



export default function getSplits(distance: number, distUnit: number, time: number, splitLen: number, splitUnit: number): splitsReturn{

    const dist = unitConvert.convertDistance(distance, distUnit, false);
    const splitDist = unitConvert.convertDistance(splitLen, splitUnit, false);

    const splitTime = time * (splitDist.m/dist.m);

    const numFullSplits = Math.floor(dist.m/splitDist.m);

    const splitsArray: split[] = []
    var cumulativeDist = 0; //in km
    var cumulativeTime = 0;

    for (let i: number = 0; i<numFullSplits; i++){

        cumulativeDist += splitDist.km;
        cumulativeTime += splitTime;

        splitsArray.push({
            distance: unitConvert.roundDistanceUnits(splitDist),
            cumulativeDistance: unitConvert.convertDistance(cumulativeDist, 0, true),
            time: Math.round(splitTime*100)/100,
            cumulativeTime: Math.round(cumulativeTime*100)/100
        });

    }

    const shortSplit = Math.round((dist.m%splitDist.m)*100)/100;

    if (shortSplit > 0){

        const shortSplitTime = time - (numFullSplits * splitTime);
        cumulativeDist += unitConvert.convertDistance(shortSplit, 2, false).km;
        cumulativeTime += shortSplitTime;
        
        splitsArray.push({
            distance: unitConvert.convertDistance(shortSplit, 2, true),
            cumulativeDistance: unitConvert.convertDistance(cumulativeDist, 0, true),
            time: Math.round(shortSplitTime*100)/100,
            cumulativeTime: Math.round(cumulativeTime*100)/100
        });

    }

    return {result: splitsArray};

}