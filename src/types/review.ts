import { Reply } from "./reply";
import { Voters } from "./voter";

export interface Review {
    appId: string,
    reviewId: string;
    username: string;
    user: string;
    description: string;
    rating: number;
    createdTime: number;
    profileUrl: string;
    rank: string;
    voters: Voters;
    replies: Reply[];
}