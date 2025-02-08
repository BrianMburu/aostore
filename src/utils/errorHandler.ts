// utils/errorHandler.ts
import { toast } from 'react-hot-toast';

export const handleWalletError = (error: unknown) => {
    console.error('Wallet Error:', error);

    const message = (error as Error).message || 'Unknown wallet error';

    if (message.includes('User rejected request')) {
        toast.error('Connection request canceled');
    } else if (message.includes('Chain not configured')) {
        toast.error('Unsupported network');
    } else {
        toast.error('Wallet operation failed');
    }
};