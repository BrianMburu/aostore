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
    appId: string,
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