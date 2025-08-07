import unitConvert from "../../utils/convert-units.js";

export default function convertDistance(distance: number, unit: number): {km: number, mi: number, m: number, yds: number}{

    return unitConvert.convertDistance(distance, unit);

}