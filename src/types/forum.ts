// types/forum.ts
export interface ForumPost {
    appId: string;
    postId: string;
    title: string;
    content: string;
    topic: string;
    author: string;
    likes: number;
    replies: ForumReply[];
    createdAt: number;
    updatedAt: number;
}

export interface ForumReply {
    postId: string;
    replyId: string;
    content: string;
    author: string;
    likes: number;
    createdAt: number;
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