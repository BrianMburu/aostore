import { Reply } from "./reply";
import { Voters } from "./voter";

// types/forum.ts
export interface ForumPost {
    devForumId: string;
    title: string;
    description: string;
    topic: string;
    user: string;
    username: string;
    profileUrl: string;
    statusHistory: Record<number, { status: string, time: number }>
    replies: Record<string, Reply>;
    createdTime: number;
    voters: Voters;
}

export const updateOptions = [
    { key: "1", value: "Technical Requirements" },
    { key: "2", value: "Integration and Dependencies" },
    { key: "3", value: "Future Scalability and Maintenance" },
    { key: "4", value: "Problem and Solution Understanding" },
    { key: "5", value: "Design and Branding Preferences" },
    { key: "6", value: "Performance and Metrics" },
    { key: "7", value: "Security and Compliance" },
    { key: "8", value: "Collaboration and Feedback" }
];

export type TopicOptionsType = typeof updateOptions[number];