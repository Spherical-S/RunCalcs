import { EVENTCONVERSIONS } from "../../utils/load-event-conversions.js"
import perfToPts from "../WAPointsCalculation/perf-to-pts.js";
import ptsToPerf from "../WAPointsCalculation/pts-to-perf.js";

import type { eventConversions, convertedResults, eventConversionData, convertableEvents } from "../../types/event-conversions.types";

function WAPerfToPerf(event: string, goal:string, time: number, gender: string): number{

    var eventCategory = "track";
    var goalCategory = "track";

    if (event.includes("sh")){
        eventCategory = "short";
    }

    if (event.includes("Road")){
        eventCategory = "road"
    }

    if (goal.includes("sh")){
        goalCategory = "short";
    }

    if (goal.includes("Road")){
        goalCategory = "road"
    }

    const pts = perfToPts(eventCategory, gender, event, time, 0).points;

    return ptsToPerf(goalCategory, gender, goal, pts, 0).mark;
}

function getConvertion(toConvert: eventConversionData, current: string, endGoal: string, time: number, gender: string): number{

    if (toConvert.WACompatible){
        return WAPerfToPerf(current, endGoal, time, gender);
    }
    
    if (toConvert.multiplier){
        return Math.round(time * toConvert.multiplier * 100)/100;
    }

    if(!toConvert.route){
        return NaN;
    }

    const conversionData = EVENTCONVERSIONS[current as keyof eventConversions]!
    const currentConversion = conversionData[toConvert.route]!

    if (currentConversion.WACompatible){
        time = WAPerfToPerf(current, toConvert.route, time, gender);
    }

    if (currentConversion.multiplier){
        time = Math.round(time * currentConversion.multiplier * 100)/100;
    }

    current = toConvert.route;

    const newConversions = EVENTCONVERSIONS[current as keyof eventConversions]!;

    const nextConversion = newConversions[endGoal as keyof convertableEvents];

    return getConvertion(nextConversion!, current, endGoal, time, gender);

}

export default function convertEvent(event: string, time: number, gender: string): convertedResults{

    var results: convertedResults = {};

    const availableConversions = EVENTCONVERSIONS[event as keyof eventConversions];

    for(const key in availableConversions){

        let toConvert: eventConversionData = availableConversions![key]!;
        let current = event;
        let endGoal = key;

        if(event === "50mH" || event === "55mH" || event === "60mH"){
            if (gender === "men" && endGoal === "100mH"){
                continue;
            }
            if(gender === "women" && endGoal === "110mH"){
                continue;
            }
        }

        results[key] = getConvertion(toConvert, current, endGoal, time, gender);

    }

    return results

}