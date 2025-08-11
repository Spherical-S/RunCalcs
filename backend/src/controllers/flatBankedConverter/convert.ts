import { FLATTOBANKEDCONVERSIONS } from "../../utils/load-flat-to-banked-conversions.js"
import doubleConvert from "../timeConverter/convert.js";

import type { conversionData, flatToBankedConversions, flatBankedConversionResults } from "../../types/flat-banked-conversions.types.js";

export default function convertEvent(event: string, time: number, gender: string, isDouble: boolean, doubleEvent: string, isUndersize: boolean, isFlat: boolean): flatBankedConversionResults{

    var results: flatBankedConversionResults = {undersized: 0, flat: 0, banked: 0, double: 0};

    var genderCategory = "";

    if(gender === "men"){
        genderCategory = "m_";
    }else{
        genderCategory = "w_";
    }

    const conversionRations = FLATTOBANKEDCONVERSIONS[event]!;

    if (isUndersize){
        results.undersized = time;
        results.flat = time * conversionRations[genderCategory + "underToFlat" as keyof conversionData];
        results.banked = results.flat * conversionRations[genderCategory + "flatToBanked" as keyof conversionData];
    } else if (isFlat){
        results.flat = time;
        results.undersized = time / conversionRations[genderCategory + "underToFlat" as keyof conversionData];
        results.banked = time * conversionRations[genderCategory + "flatToBanked" as keyof conversionData];
    } else{
        results.banked = time;
        results.flat = time / conversionRations[genderCategory + "flatToBanked" as keyof conversionData];
        results.undersized = time / conversionRations[genderCategory + "underToFlat" as keyof conversionData];
    }

    if(isDouble){
        let doubles = doubleConvert(event, results.banked, gender)

        if(!(doubleEvent in doubles)){
            results.double = NaN;
        }

        results.double = doubles[doubleEvent]!;
    }

    results.undersized = Math.round(results.undersized*100)/100;
    results.flat = Math.round(results.flat*100)/100;
    results.banked = Math.round(results.banked*100)/100;

    return results;

}