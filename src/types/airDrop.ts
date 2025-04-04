export interface Airdrop {
    airdropId: string;
    owner: string;
    minAosPoints: number;
    appId: string;
    appIconUrl: string;
    tokenId: string;
    tokenDenomination: number;
    tokenTicker: string;
    claimedUsers: Record<string, { time: string }>;
    verifiedParticipants: Record<string, { time: string }>;
    unverifiedParticipants: Record<string, { time: string }>;
    amount: number;
    createdTime: number,
    endTime: number;
    startTime: number;
    title: string;
    description: string;
    airdropsReceivers: string;
    appName: string;
    status: statusType;
}
export const receiverOptions = ["ReviewsTable", "FavoritesTable"] as const;

export type receiverOptionsType = typeof receiverOptions[number];

export interface AppAirdropData {
    userId: string;
    appId: string;
    tokenId: string;
    amount: number;
    publishTime: number;
    expiryTime: number;
    title: string;
    description: string;
    airdropsReceivers: string[];
    appName: string;
    airdropId: string;
    status: statusType;
}

export interface AppAirdropDataMini {
    title: string;
    airdropId: string;
    amount: number;
    publishTime: number;
    expiryTime: number;
    appName: string;
    status: 'active' | 'claimed' | 'pending' | 'expired';
}

export const statusOptions = [
    'ongoing', 'pending', 'completed'
] as const;

export type statusType = typeof statusOptions[number];
