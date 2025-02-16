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
    status: 'active' | 'claimed' | 'pending' | 'expired';
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