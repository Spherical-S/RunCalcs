import type { WAData, CategoryToGenderMap } from "../../types/wadata.types.js";
import { WATABLES } from "../../utils/load-wa-tables.js";

function recursiveBinarySearch(ptsArray: number[][], low: number, high: number, target: number): number[][] {

    const mid = Math.floor((low+high)/2);

    if (mid == low) {
        return [ptsArray[low]!, ptsArray[high]!];
    }

    if (ptsArray[mid]![1] == target) {
        return [ptsArray[mid]!];
    }

    if (target < ptsArray[mid]![1]!) {
        return recursiveBinarySearch(ptsArray, mid, high, target);
    } else {
        return recursiveBinarySearch(ptsArray, low, mid, target);
    }

}

export default function ptsToPerf(category: string, gender: string, event: string, target: number, interpolate: number): {mark: number} {

    const output = { "mark": NaN };

    const ptsArray = WATABLES[category as keyof WAData][gender as keyof CategoryToGenderMap][event]!;

    const low = 0;
    const high = ptsArray.length - 1;

    const result = recursiveBinarySearch(ptsArray, low, high, target);

    if (result.length == 1) {
        output.mark = result[0]![0]!;
    }

    if (result.length == 2 && interpolate == 1) {
        const last_pair = result[0]!;
        const pair = result[1]!;
        const ratio = (target-pair[1]!)/(last_pair[1]!-pair[1]!);
        const diff = last_pair[0]! - pair[0]!;
        const offset = diff * ratio;
        output.mark = pair[0]! + offset;
    } else if (result.length == 2 && interpolate == 0) {
        output.mark = result[0]![1]! <= result[1]![1]! ? result[0]![0]! : result[1]![0]!;
    }

    if (!isNaN(output.mark)) {
        output.mark = Math.round(output.mark*100)/100;
    }

    return output;

}