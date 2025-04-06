import { Message } from './message';

export interface User {
    username: string;
    walletAddress: string;
    avatar?: string;
    messages?: Message[] | [];
}

export interface UpdatedUser {
    username?: string | undefined;
    walletAddress?: string | undefined;
    avatar?: string | undefined;
    messages?: Message[];
}