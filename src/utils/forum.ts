// utils/forum.ts
export const formatActivityTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
};

export const simulateAPI = async <T>(data: T, delay = 800): Promise<T> => {
    await new Promise(resolve => setTimeout(resolve, delay));
    return data;
};