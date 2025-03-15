export interface FeatureRequest {
    id: string
    type: 'feature'
    title: string
    description: string
    timestamp: number
    userId: string
    helpfulVotes: number;
    unhelpfulVotes: number;
    appId: string
}

export interface BugReport {
    id: string
    type: 'bug'
    title: string
    description: string
    status: 'open' | 'in-progress' | 'resolved'
    timestamp: number
    userId: string
    helpfulVotes: number;
    unhelpfulVotes: number;
    appId: string
}