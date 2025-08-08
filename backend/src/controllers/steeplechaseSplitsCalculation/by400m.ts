import steepleSplitsByTime from "./bytime.js"

export default function steepleSplitsBy400m(time: number, pitType: string): {timeperlap: number}{

    return steepleSplitsByTime(time, 400, 2, pitType);

}