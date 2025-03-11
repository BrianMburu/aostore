export interface Message {
    id: string;
    appName: string;
    appIconUrl: string;
    company: string;
    title: string;
    content: string;
    linkInfo: string;
    currentTime: number;
    updateTime?: number;
    read: boolean;
    type: MessageType;
}

export type MessageType = 'update' | 'feature' | 'bug';

export const messageTypes = [
    { key: "1", value: "update" },
    { key: "2", value: "feature" },
    { key: "3", value: "bug" }
];