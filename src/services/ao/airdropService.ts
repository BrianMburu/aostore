import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { AppAirdropData } from '@/types/airDrop';
import { DAPPIDS } from '@/utils/dataGenerators';
import { DAppService } from './dappService';

const dummyAirdrops: AppAirdropData[] = Array.from({ length: 48 }, (_, i) => ({
    userId: `user_${i}`,
    title: `Airdrop ${i % 6 + 1}${String.fromCharCode(65 + i % 3)}`,
    appId: DAPPIDS[i],
    tokenId: `token_${i}`,
    amount: Math.floor(Math.random() * 1000),
    publishTime: Date.now() - Math.floor(Math.random() * 1000000000),
    expiryTime: Date.now() + Math.floor(Math.random() * 1000000000),
    appName: `DApp ${i % 6 + 1}${String.fromCharCode(65 + i % 3)}`,
    airdropId: `airdrop_${i}`,
    status: ['claimed', 'pending', 'expired'][i % 3] as 'claimed' | 'pending' | 'expired'
}));

export interface AidropsFilterParams {
    appId?: string;
    sort?: string;
    search?: string;
    page?: string;
}

export const AirdropService = {
    fetchAirdrop: async (airdropId: string): Promise<AppAirdropData | undefined> => {
        const airdrop = dummyAirdrops.find(airdrop => airdrop.airdropId === airdropId);
        return airdrop;
    },

    fetchAirdrops: async (params: AidropsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: AppAirdropData[]; total: number }> => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

        const filteredData = dummyAirdrops
            .filter(airdrop =>
                airdrop.title.toLowerCase().includes((params.search || '').toLowerCase())
            )

        // Pagination
        const page = Number(params.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        const sortedData = filteredData
            .sort((a, b) => (params.sort === 'expiryTime' ?
                a.expiryTime - b.expiryTime :
                b.publishTime - a.publishTime
            ));

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // Return the filtered data and the total count
        return {
            data,
            total: filteredData.length
        };
    },

    fetchAirdropsLimit: async (params: AidropsFilterParams, limit: number = 5): Promise<{ data: AppAirdropData[]; total: number }> => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        const filteredData = dummyAirdrops
            .filter(airdrop => airdrop.appId === params.appId)

        const sortedData = filteredData
            .sort((a, b) => (params.sort === 'expiryTime' ?
                a.expiryTime - b.expiryTime :
                b.publishTime - a.publishTime
            ));

        // Slice the data for the current page
        const data = sortedData.slice(0, limit)

        // Return the filtered data and the total count
        return {
            data,
            total: filteredData.length
        };
    },

    async createAirdrop(userId: string, appId: string, airdropData: Partial<AppAirdropData>): Promise<AppAirdropData> {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const dapp = await DAppService.getDApp(appId);

        if (!userId || userId === '') {
            throw new Error('User not found');
        }

        if (!dapp) {
            throw new Error('DApp not found');
        }

        const newAirdrop: AppAirdropData = {
            userId: userId,
            appId: appId,
            appName: dapp.appName,
            airdropId: `airdrop-${Date.now()}`,
            amount: airdropData.amount || 0,
            publishTime: Date.now(),
            expiryTime: airdropData.expiryTime!,
            tokenId: airdropData.tokenId!,
            title: airdropData.title!,
            description: airdropData.description!,
            airdropsReceivers: [],
            status: airdropData.status!,
        };

        dummyAirdrops.unshift(newAirdrop);
        return newAirdrop;
    },

    async editAirdrop() { }
};