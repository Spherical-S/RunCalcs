import type { DistanceUnits } from "./unit.types.js";

export type split = {
    distance: DistanceUnits, 
    cumulativeDistance: DistanceUnits,
    time: number,
    cumulativeTime: number
};

export type splitsReturn = {
    result: split[]
};