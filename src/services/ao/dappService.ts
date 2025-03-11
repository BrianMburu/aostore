
import { AppData } from "@/types/dapp";
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import { DAPPIDS, generateDAppTestData } from "@/utils/dataGenerators";
import { Tip } from "@/types/tip";

// services/dapps.ts
export interface DAppsFilterParams {
    companyName?: string;
    protocol?: string;
    category?: string;
    search?: string;
    verified?: string;
    page?: string;
    fv_page?: string
}

const dummyDApps: AppData[] = generateDAppTestData(20)

// const dummyDApps: AppData[] = Array.from({ length: 12 }, (_, i) => ({
//     appName: `DApp ${i + 1}`,
//     appIconUrl: `https://picsum.photos/20${i}`,
//     appId: `dapp-${i}`,
//     verified: i % 2 === 0 ? 'verified' : 'unverified',
//     protocol: i % 2 === 0 ? 'aocomputer' : 'arweave',
//     projectType: projectTypes[i % projectTypes.length],
//     createdTime: Date.now() - 86400000 * i,
//     reviews: generator.generateReviews(20),
//     // ... other required fields with dummy data
// }));

// Test FeatureRequests:
// // Generate 20 items with 80% features, 20% bugs

export const DAppService = {
    async getDApp(appId: string): Promise<AppData | undefined> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dapp = dummyDApps.find(dapp => dapp.appId === appId);
        return dapp;
    },

    async getDApps(params: DAppsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: AppData[], total: number }> {
        // Simulate delay for fetching data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Filter the dummyDApps based on the parameters
        const filtered = dummyDApps.filter(dapp => {
            const matchesProtocol = !params.protocol || params.protocol === 'all' || dapp.protocol === params.protocol;
            const matchesCategory = !params.category || params.category === 'all' || dapp.projectType === params.category;
            const matchesSearch = !params.search || dapp.appName.toLowerCase().includes(params.search.toLowerCase());
            const matchesVerification = !params.verified || params.verified === 'all' || dapp.verified === params.verified;

            return matchesProtocol && matchesCategory && matchesSearch && matchesVerification;
        });

        // Pagination
        const page = Number(params.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort the filtered data
        const sortedData = filtered.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // Return the filtered data and the total count
        return {
            data,
            total: filtered.length
        };
    },

    async getDAppsLimited(params: DAppsFilterParams, limit: number = 4): Promise<{ data: AppData[], total: number }> {
        // Simulate delay for fetching data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Filter the dummyDApps based on the parameters
        const filtered = dummyDApps.filter(dapp => {
            const matchesProtocol = !params.protocol || params.protocol === 'all' || dapp.protocol === params.protocol;
            const matchesCategory = !params.category || params.category === 'all' || dapp.projectType === params.category;
            const matchesSearch = !params.search || dapp.appName.toLowerCase().includes(params.search.toLowerCase());
            const matchesVerification = !params.verified || params.verified === 'all' || dapp.verified === params.verified;
            const matchesCompanyName = !params.companyName || params.companyName === 'all' || dapp.companyName === params.companyName;

            return matchesProtocol && matchesCategory && matchesSearch && matchesVerification && matchesCompanyName;
        });

        // Pagination
        // Sort the filtered data
        const sortedData = filtered.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        // Slice the data for the current page
        const data = sortedData.slice(0, limit)

        // Return the filtered data and the total count
        return {
            data,
            total: filtered.length
        };
    },

    async getFavoriteDApps(userId: string, params: DAppsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: AppData[], total: number }> {
        // Simulate delay for fetching data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Filter the dummyDApps based on the parameters
        const filtered = dummyDApps
            .filter(dapp => {
                const matchesProtocol = !params.protocol || params.protocol === 'all' || dapp.protocol === params.protocol;
                const matchesCategory = !params.category || params.category === 'all' || dapp.projectType === params.category;
                const matchesSearch = !params.search || dapp.appName.toLowerCase().includes(params.search.toLowerCase());
                const matchesVerification = !params.verified || params.verified === 'all' || dapp.verified === params.verified;

                return matchesProtocol && matchesCategory && matchesSearch && matchesVerification;
            });

        // Pagination
        const page = 1;
        const itemsPerPage = 8; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort the filtered data
        const sortedData = filtered.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // Return the filtered data and the total count
        return {
            data,
            total: filtered.length
        };
    },

    async createDApp(dappData: Partial<AppData>): Promise<AppData> {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newDApp: AppData = {
            ...dappData,
            appId: `dapp-${Date.now()}`,
            verified: 'unverified',
            createdTime: Date.now(),
            ratings: 0,
            totalRatings: 0,
            upvotes: {},
            downvotes: {},
            reviews: {},
            bannerUrls: {}
            // Default values for required fields
        };

        dummyDApps.unshift(newDApp);
        return newDApp;
    },

    async updateDApp(appId: string, updates: Partial<AppData>): Promise<AppData> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const index = dummyDApps.findIndex(d => d.appId === appId);
        if (index === -1) throw new Error('DApp not found');

        dummyDApps[index] = { ...dummyDApps[index], ...updates };
        return dummyDApps[index];
    },

    async deleteDApp(appId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = dummyDApps.findIndex(d => d.appId === appId);
        if (index === -1) throw new Error('DApp not found');
        dummyDApps.splice(index, 1);
    },

    async submitVerification(appId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Simulate verification process
    },

    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },
};