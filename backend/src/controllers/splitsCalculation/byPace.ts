import calculateTime from "../paceCalculation/time.js";
import getSplitsByTime from "./byTime.js";

import type { splitsReturn, split } from "../../types/splits.types.js";



export default function getSplits(distance: number, distUnit: number, pace: number, paceUnit: number, splitLen: number, splitUnit: number): splitsReturn{

    const time = calculateTime(pace, distance, paceUnit, distUnit).time;

    return getSplitsByTime(distance, distUnit, time, splitLen, splitUnit);

}