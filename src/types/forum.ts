// types/forum.ts
export interface ForumPost {
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

const generateDummyPosts = (): ForumPost[] => Array.from({ length: 50 }, (_, i) => ({
    postId: `post-${i}`,
    title: `Discussion #${i + 1} about ${updateOptions[i % updateOptions.length].value}`,
    content: `Detailed discussion content for post ${i + 1}. `.repeat(10),
    topic: updateOptions[i % updateOptions.length].value,
    author: `user${i % 10}`,
    likes: Math.floor(Math.random() * 100),
    replies: Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
        replyId: `reply-${i}-${j}`,
        content: `Reply ${j + 1} to post ${i + 1}. `.repeat(3),
        author: `user${j % 10}`,
        likes: Math.floor(Math.random() * 50),
        createdAt: Date.now() - 86400000 * j
    })),
    createdAt: Date.now() - 86400000 * i,
    updatedAt: Date.now() - 86400000 * i
}));

export const dummyPosts = generateDummyPosts();