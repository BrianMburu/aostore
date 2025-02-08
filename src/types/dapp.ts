export interface Project {
    projectName: string;
    companyName: string;
    projectType: ProjectType;
    ratings: number;
    appId: string;
    appIconUrl: string;
    websiteUrl: string;
    protocol: Protocol;
}

export const projectTypes = [
    "Infrastructure", "Community", "Analytics", "DEFI", "Developer Tooling",
    "Email", "Exchanges", "Gaming", "Incubators", "Memecoins", "News and Knowledge",
    "NFTs and Metaverse", "Publishing", "Social", "Storage", "Wallet"
] as const;

export type Protocol = 'aocomputer' | 'arweave';
export type ProjectType = typeof projectTypes[number];



export interface AppData {
    appName: string;
    companyName: string;
    websiteUrl: string;
    projectType: string;
    appIconUrl: string;
    coverUrl: string;
    company: string;
    description: string;
    ratings: number;
    appId: string;
    bannerUrls: Record<string, any>;
    createdTime: number;
    discordUrl: string;
    downvotes: Record<string, any>;
    protocol: string;
    reviews: Record<string, any>;
    twitterUrl: string;
    upvotes: Record<string, any>;
    totalRatings: number;
}

export interface Reply {
    replyId: string;
    comment: string;
    timestamp: number;
    upvotes: number;
    downvotes: number;
    user: string;
    username: string;
    profileUrl: string;
}

export interface Review {
    reviewId: string;
    username: string;
    comment: string;
    rating: number;
    timestamp: number;
    upvotes: number;
    downvotes: number;
    helpfulVotes: number;
    unhelpfulVotes: number;
    profileUrl: string;
    voters: Record<string, any>;
    replies: Reply[];
}