export type eventConversionData = {
    WACompatible: boolean,
    multiplier?: number,
    route?: string
};

export type convertableEvents = {
    [EventName: string]: eventConversionData
};

export type eventConversions = {
    [EventName: string]: convertableEvents
};

export type convertedResults = {
    [EventName: string]: number
};