// export interface Project {
//     projectName: string;
//     companyName: string;
//     projectType: ProjectType;
//     ratings: number;
//     appId: string;
//     appIconUrl: string;
//     websiteUrl: string;
//     protocol: Protocol;
// }

export interface DappList {
    appId: string;
    appName: string;
    companyName: string;
    appIconUrl: string;
    projectType: ProjectType;
    description: string;
    createdTime: number;
    websiteUrl: string;
    protocol: Protocol;
    verified?: string
}

export interface Dapp {
    appId: string;
    appName: string;
    appIconUrl: string;
    projectType: ProjectType;
    description: string;
    createdTime: number;
    companyName: string;
    websiteUrl: string;
    twitterUrl: string;
    discordUrl: string;
    coverUrl: string;
    bannerUrls: string[];
    protocol: Protocol;
    username?: string;
    profileUrl?: string;
    token?: AppTokenData;
    verified?: string
}
export interface CreateDapp {
    appName: string;
    appIconUrl: string;
    projectType: ProjectType;
    description: string;
    companyName: string;
    websiteUrl: string;
    twitterUrl: string;
    discordUrl: string;
    coverUrl: string;
    bannerUrls: string[];
    protocol: Protocol;
    username: string;
    profileUrl: string;
}

export const projectTypes = [
    "Infrastructure", "Community", "Analytics", "DEFI", "Developer Tooling",
    "Email", "Exchanges", "Gaming", "Incubators", "Memecoins", "News and Knowledge",
    "NFTs and Metaverse", "Publishing", "Social", "Storage", "Wallet"
] as const;

export type Protocol = 'aocomputer' | 'arweave';
export type ProjectType = typeof projectTypes[number];

export type Verified = 'verified' | 'unverified';

// export interface AppData {
//     appId: string;
//     appName: string;
//     companyName: string;
//     websiteUrl: string;
//     projectType: ProjectType;
//     appIconUrl: string;
//     coverUrl: string;
//     company: string;
//     description: string;
//     ratings: number;
//     bannerUrls: Record<string, any>;
//     createdTime: number;
//     updatedAt?: number;
//     discordUrl: string;
//     downvotes: Record<string, any>;
//     protocol: Protocol;
//     reviews: Record<string, any>;
//     twitterUrl: string;
//     upvotes: Record<string, any>;
//     totalRatings: number;
//     verified?: Verified;
//     token?: AppTokenData;
// }

export interface AppTokenData {
    tokenId: string;
    tokenName: string;
    tokenTicker: string;
    tokenDenomination: number;
    logo: string;
}

export interface AppTransactionData {
    user: string;
    amount: number;
    points: number;
    transactionType: string;
    transactionId: string;
    timestamp: number;
}
export interface AppTipTransactionData {
    user: string;
    amount: number;
    transactionType: string;
    transactionId: string;
    timestamp: number;
    tipped: boolean;
    appName: string;
    logo: string;
}