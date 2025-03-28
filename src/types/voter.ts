export interface Voters {
    foundHelpful: HelpfulData;
    foundUnhelpful: HelpfulData;
}

export interface HelpfulData {
    count: number;
    countHistory: Record<number, { count: number, time: string }>
    users: Record<string, { time: string }>
}