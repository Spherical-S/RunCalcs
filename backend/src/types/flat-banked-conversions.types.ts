export type conversionData = {
    m_flatToBanked: number,
    w_flatToBanked: number,
    m_underToFlat: number,
    w_underToFlat: number
};

export type flatToBankedConversions = {
    [EventName: string]: conversionData
}

export type flatBankedConversionResults = {
    undersized: number,
    flat: number,
    banked: number,
    double: number,
};