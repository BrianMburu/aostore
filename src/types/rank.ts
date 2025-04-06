export const rankTypes = [
    "Oracle", "Operator", "RedPill", "BluePill"
] as const;

export type RankType = typeof rankTypes[number];

export type Rank = { rank: RankType, points: number };
