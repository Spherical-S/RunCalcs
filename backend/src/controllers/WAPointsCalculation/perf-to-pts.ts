import type { WAData, CategoryToGenderMap } from "../../types/wadata.types.js";
import { WATABLES } from "../../utils/load-wa-tables.js";

function recursiveBinarySearch(ptsArray: number[][], low: number, high: number, target: number, ascending: boolean): number[][]{

    const mid = Math.floor((low+high)/2);

    if (mid == low){
        return [ptsArray[low]!, ptsArray[high]!];
    }

    if (ptsArray[mid]![0] == target){
        return [ptsArray[mid]!];
    }

    if(ascending){
        if (target > ptsArray[mid]![0]!){
            return recursiveBinarySearch(ptsArray, mid, high, target, ascending);
        } else {
            return recursiveBinarySearch(ptsArray, low, mid, target, ascending);
        }
    }else{
        if (target < ptsArray[mid]![0]!){
            return recursiveBinarySearch(ptsArray, mid, high, target, ascending);
        } else {
            return recursiveBinarySearch(ptsArray, low, mid, target, ascending);
        }
    }

}

export default function perfToPts(category: string, gender: string, event: string, target: number): {"points": number}{

    const ptsArray = WATABLES[category as keyof WAData][gender as keyof CategoryToGenderMap][event]!;

    const ascending = ptsArray[0]![0]! < ptsArray[1]![0]!

    if(ascending){
        if (target < ptsArray[0]![0]!){
            return {"points": 1400};
        }
        if(target > ptsArray[ptsArray.length-1]![0]!){
            return {"points": 0};
        }
    }else{
        if (target > ptsArray[0]![0]!){
            return {"points": 1400};
        }
        if(target < ptsArray[ptsArray.length-1]![0]!){
            return {"points": 0};
        }
    }
    
    var low = 0;
    var high = ptsArray.length - 1;

    const result = recursiveBinarySearch(ptsArray, low, high, target, ascending);

    if (result.length == 1){
        return {"points": result[0]![1]!};
    }

    if (result.length == 1){
        return {"points": result[0]![1]!};
    }

    if (result.length == 2){
        if(ascending){
            let last_pair = result[0]!;
            let pair = result[1]!;
            let ratio = (pair[0]!-target)/(pair[0]!-last_pair[0]!);
            let diff = pair[1]!-last_pair[1]!;
            let offset = diff * ratio;
            return {"points": last_pair[1]! + offset};
        }else{
            let last_pair = result[0]!
            let pair = result[1]!
            let ratio = (last_pair[0]!-target)/(last_pair[0]!-pair[0]!)
            let diff = last_pair[1]!-pair[1]!
            let offset = diff * ratio
            return {"points": last_pair[1]! - offset};
        }
    }

    return {"points": NaN};

}