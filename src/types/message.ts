export interface Message {
    id: string;
    appName: string;
    appIconUrl: string;
    company: string;
    title: string;
    message: string;
    linkInfo: string;
    currentTime: string;
    read: boolean;
    type: MessageType;
}

export type MessageType = 'update' | 'feature' | 'bug';
