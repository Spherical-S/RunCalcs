import { DistanceUnit, PaceUnit } from "../types/units-enums.js";
import type { DistanceUnits, PaceUnits } from "../types/unit.types.js";

function convertDistance(number: number, unit: number, round: boolean): DistanceUnits{

    var result = {"km": 0, "mi": 0, "m": 0, "yds": 0};

    if (number == 0){
        return result;
    }

    switch(unit){

        case(DistanceUnit.Km): {
            result.km = number;
            result.mi = result.km/1.60934;
            result.m = result.km*1000;
            result.yds = result.mi*1760;
            break;
        }

        case(DistanceUnit.Mi): {
            result.mi = number;
            result.km = result.mi*1.60934;
            result.m = result.km*1000;
            result.yds = result.mi*1760;
            break;
        }

        case(DistanceUnit.m): {
            result.km = number/1000;
            result.mi = result.km/1.60934;
            result.m = result.km*1000;
            result.yds = result.mi*1760;
            break;
        }

        case(DistanceUnit.yds): {
            result.mi = number/1760;
            result.km = result.mi*1.60934;
            result.m = result.km*1000;
            result.yds = result.mi*1760;
            break;
        }

    }

    if(round){
        roundDistanceUnits(result);
    }

    return result;

}

function convertPace(number: number, unit: number, round: boolean): PaceUnits{

    var result = {"secPerKm": 0, "secPerMi": 0, "KmsPerHour": 0, "MisPerHour": 0};

    if (number == 0){
        return result;
    }

    switch(unit){

        case(PaceUnit.SecondsPerKm): {
            result.secPerKm = number;
            result.secPerMi = result.secPerKm*1.60934;
            result.KmsPerHour = 1/(result.secPerKm/3600);
            result.MisPerHour = result.KmsPerHour/1.60934;
            break;
        }

        case(PaceUnit.SecondsPerMi): {
            result.secPerMi = number;
            result.secPerKm = result.secPerMi/1.60934;
            result.KmsPerHour = 1/(result.secPerKm/3600);
            result.MisPerHour = result.KmsPerHour/1.60934;
            break;
        }

        case(PaceUnit.KmsPerHour): {
            result.KmsPerHour = number;
            result.MisPerHour = result.KmsPerHour/1.60934;
            result.secPerKm = (1/result.KmsPerHour)*3600;
            result.secPerMi = result.secPerKm*1.60934;
            break;
        }

        case(PaceUnit.MisPerHour): {
            result.MisPerHour = number;
            result.KmsPerHour = result.MisPerHour*1.60934;
            result.secPerKm = (1/result.KmsPerHour)*3600;
            result.secPerMi = result.secPerKm*1.60934;
            break;
        }

    }

    if(round){
        roundPaceUnits(result);
    }

    return result

}

function roundDistanceUnits(unit: DistanceUnits): DistanceUnits{

    unit.km = Math.round(unit.km*100)/100;
    unit.mi = Math.round(unit.mi*100)/100;
    unit.m = Math.round(unit.m*100)/100;
    unit.yds = Math.round(unit.yds*100)/100;

    return unit

}

function roundPaceUnits(unit: PaceUnits): PaceUnits{
    
    unit.secPerKm = Math.round(unit.secPerKm*100)/100;
    unit.secPerMi = Math.round(unit.secPerMi*100)/100;
    unit.KmsPerHour = Math.round(unit.KmsPerHour*100)/100;
    unit.MisPerHour = Math.round(unit.MisPerHour*100)/100;

    return unit;

}

const unitConvert = {convertDistance, convertPace, roundDistanceUnits, roundPaceUnits};

export default unitConvert;