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
    userId: string;
    comment: string;
    rating: number;
    timestamp: number;
    upvotes: number;
    downvotes: number;
    helpfulVotes: number;
    unhelpfulVotes: number;
    profileUrl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    voters: Record<string, any>;
    replies: Reply[];
}