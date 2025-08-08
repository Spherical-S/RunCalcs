import unitConvert from "../../utils/convert-units.js";

export default function convertPace(pace: number, unit: number): {secPerKm: number, secPerMi: number, KmsPerHour: number, MisPerHour: number}{

    return unitConvert.convertPace(pace, unit, true);

}