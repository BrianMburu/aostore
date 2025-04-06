import { Reply } from "./reply";
import { Voters } from "./voter";

export interface FeatureRequest {
    requestId: string;
    type: 'feature';
    title: string;
    description: string;
    status: 'open' | 'closed'
    createdTime: number;
    user: string;
    username: string;
    profileUrl: string;
    replies: Record<string, Reply>;
    voters: Voters;
}

export interface BugReport {
    requestId: string;
    type: 'bug';
    title: string;
    description: string;
    status: 'open' | 'closed'
    createdTime: number;
    user: string;
    username: string;
    profileUrl: string;
    replies: Record<string, Reply>;
    voters: Voters;
}