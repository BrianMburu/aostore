
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import { generateTestData } from "@/utils/dataGenerators";
import { Tip } from "@/types/tip";
import { NextResponse } from "next/server";
import { BugReport, FeatureRequest } from '@/types/support';

// Test FeatureRequests:
// // Generate 20 items with 80% features, 20% bugs
const testFeaturesRequestData = generateTestData(20, 0.8);

export interface FeatureBugParams {
    type?: string,
    page?: string,
    search?: string
}

export const SupportService = {
    async getFeatureRequests(appId: string, params: FeatureBugParams, useInfiniteScroll: boolean = false): Promise<{ data: (FeatureRequest | BugReport)[], total: number }> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const requests = testFeaturesRequestData as (FeatureRequest | BugReport)[];
        // Filter the reviews based on rating
        const filteredRequests = requests.filter(request => {
            const matchesType = !params.type || request.type === params.type;
            const matchesSearch = !params.search || request.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesType && matchesSearch
        });

        // Pagination
        const page = Number(params.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined


        // Sort the filtered reviews
        const sortedRequests = filteredRequests
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedRequests.slice(0, page * itemsPerPage)
            : sortedRequests.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        return {
            data,
            total: filteredRequests.length
        };

    },

    async createFeatureRequest(appId: string, userId: string, requestData: Partial<(FeatureRequest | BugReport)>): Promise<(FeatureRequest | BugReport)> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const newRequest = {
            ...requestData,
            appId: appId,
            userId: userId,
            id: `${requestData.type}-${Date.now()}`,
            timestamp: Date.now(),
            helpfulVotes: 0,
            unhelpfulVotes: 0,
        } as (FeatureRequest | BugReport);

        testFeaturesRequestData.unshift(newRequest)
        // Return the updated review array
        return newRequest;
    },

    async updateFeatureRequests(requestId: string, requestData: Partial<(FeatureRequest | BugReport)>): Promise<(FeatureRequest | BugReport)> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate update in dummy data
        const postIndex = testFeaturesRequestData.findIndex(rq => rq.id === requestId);

        testFeaturesRequestData[postIndex] = {
            ...testFeaturesRequestData[postIndex],
            ...requestData
        } as (FeatureRequest | BugReport);

        // Return the updated review array
        return testFeaturesRequestData[postIndex];
    },

    async markFeatureRequestHelpful(requestId: string) {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Simulate update in dummy data
        const postIndex = testFeaturesRequestData.findIndex(rq => rq.id === requestId);
        console.log(testFeaturesRequestData[postIndex]);

        if (postIndex === -1) {
            NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        testFeaturesRequestData[postIndex].helpfulVotes++;

        return NextResponse.json({ success: true });
    },

    async markFeatureRequestUnhelpful(requestId: string) {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Simulate update in dummy data
        const postIndex = testFeaturesRequestData.findIndex(rq => rq.id === requestId);
        if (postIndex === -1) {
            NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        testFeaturesRequestData[postIndex].unhelpfulVotes++;

        return NextResponse.json({ success: true });
    },

    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },
};