import { AppAirdropData } from '@/types/airDrop';

const dummyAirdrops: AppAirdropData[] = Array.from({ length: 48 }, (_, i) => ({
    userId: `user_${i}`,
    appId: `app_${i % 6}`,
    tokenId: `token_${i}`,
    amount: Math.floor(Math.random() * 1000),
    publishTime: Date.now() - Math.floor(Math.random() * 1000000000),
    expiryTime: Date.now() + Math.floor(Math.random() * 1000000000),
    appname: `DApp ${i % 6 + 1}${String.fromCharCode(65 + i % 3)}`,
    airdropId: `airdrop_${i}`,
    status: ['claimed', 'pending', 'expired'][i % 3] as 'claimed' | 'pending' | 'expired'
}));

export const aoAirdropService = {
    fetchAirdrops: async (params: {
        search?: string;
        sort?: string;
        page?: string;
    }): Promise<{ data: AppAirdropData[]; total: number }> => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

        const filtered = dummyAirdrops
            .filter(airdrop =>
                airdrop.appname.toLowerCase().includes((params.search || '').toLowerCase())
            )
            .sort((a, b) => (params.sort === 'expiryTime' ?
                a.expiryTime - b.expiryTime :
                b.publishTime - a.publishTime
            ));

        const page = Number(params.page) || 1;
        const itemsPerPage = 12;

        return {
            data: filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage),
            total: filtered.length
        };
    }
};