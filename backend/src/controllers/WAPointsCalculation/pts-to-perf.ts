import type { WAData, CategoryToGenderMap } from "../../types/wadata.types.js";
import { WATABLES } from "../../utils/load-wa-tables.js";

function recursiveBinarySearch(ptsArray: number[][], low: number, high: number, target: number): number[][]{

    const mid = Math.floor((low+high)/2);

    if (mid == low){
        return [ptsArray[low]!, ptsArray[high]!];
    }

    if (ptsArray[mid]![1] == target){
        return [ptsArray[mid]!];
    }

    if (target < ptsArray[mid]![1]!){
        return recursiveBinarySearch(ptsArray, mid, high, target);
    } else {
        return recursiveBinarySearch(ptsArray, low, mid, target);
    }

}

export default function ptsToPerf(category: string, gender: string, event: string, target: number): {mark: number}{

    const ptsArray = WATABLES[category as keyof WAData][gender as keyof CategoryToGenderMap][event]!;

    var low = 0;
    var high = ptsArray.length - 1;

    const result = recursiveBinarySearch(ptsArray, low, high, target);

    if (result.length == 1){
        return {"mark": result[0]![0]!};
    }

    if (result.length == 2){
        let last_pair = result[0]!;
        let pair = result[1]!;
        let ratio = (target-pair[1]!)/(last_pair[1]!-pair[1]!);
        let diff = last_pair[0]! - pair[0]!;
        let offset = diff * ratio;
        return {"mark": (pair[0]! + offset)};
    }

    return {"mark": NaN};

}