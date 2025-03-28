export interface Reply {
    replyId: string;
    description: string;
    createdTime: number;
    upvotes: number;
    downvotes: number;
    user: string;
    username: string;
    profileUrl: string;
    rank: string;
    edited: boolean;
}