export interface Message {
    messageId: string;
    appName: string;
    appId: string;
    appIconUrl: string;
    company: string;
    title: string;
    message: string;
    link: string;
    currentTime: number;
    read: boolean;
    messageType: string;
}

// export type MessageType = 'update' | 'feature' | 'bug';

export const messageTypes = [
    { key: "1", value: "Announcement" },
    { key: "2", value: "Security Alerts" },
    { key: "3", value: "Activity" },
    { key: "4", value: "Educational" },
    { key: "5", value: "Promotional" },
    { key: "6", value: "Community Engagement" },
    { key: "7", value: "Market Updates" },
    { key: "8", value: "Milestone Achievements" },
    { key: "9", value: "Event Reminders" },
    { key: "10", value: "Feedback and Surveys" },
];