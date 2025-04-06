
import { DEFAULT_PAGE_SIZE } from '@/config/page'
// import { generateTestData } from "@/utils/dataGenerators";
import { Tip } from "@/types/tip";
// import { NextResponse } from "next/server";
import { BugReport, FeatureRequest } from '@/types/support';
import { cleanAoJson, fetchAOmessages } from '@/utils/ao';
import { PROCESS_ID_BUG_REPORT_TABLE, PROCESS_ID_FEATURE_REQUEST_TABLE } from '@/config/ao';
import { User } from '@/types/user';
import { Rank } from '@/types/rank';
import { HelpfulData } from '@/types/voter';
import { Reply } from '@/types/reply';

// Test FeatureRequests:
// // Generate 20 items with 80% features, 20% bugs
// const testFeaturesRequestData = generateTestData(20, 0.8);

export interface FeatureBugParams {
    type?: string,
    page?: string,
    search?: string
}

export const SupportService = {
    async getFeatureRequests(appId: string, params: FeatureBugParams, useInfiniteScroll: boolean = false): Promise<{ data: FeatureRequest[], total: number }> {
        let featureRequests: FeatureRequest[] = [];

        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchFeatureRequests" },
                { name: "appId", value: appId }

            ], PROCESS_ID_FEATURE_REQUEST_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                featureRequests = Object.values(messageData.data);
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Bug Reports, ${error}`)
        }

        // const requests = testFeaturesRequestData as (FeatureRequest | BugReport)[];

        // Filter the reviews based on rating
        const filteredRequests = featureRequests.filter(request => {
            // const matchesType = !params.type || request.type === params.type;
            const matchesSearch = !params.search || request.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesSearch
        });

        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort the filtered reviews
        const sortedRequests = filteredRequests
            .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());


        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedRequests.slice(0, page * itemsPerPage)
            : sortedRequests.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // console.log("Feature Request Data: => ", data)

        return {
            data,
            total: filteredRequests.length
        };

    },

    async getBugReports(appId: string, params: FeatureBugParams, useInfiniteScroll: boolean = false): Promise<{ data: BugReport[], total: number }> {
        let bugReports: BugReport[] = []
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchBugReports" },
                { name: "appId", value: appId }

            ], PROCESS_ID_BUG_REPORT_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Bug Reports Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                bugReports = Object.values(messageData.data);
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Bug Reports, ${error}`)
        }

        const filteredRequests = bugReports.filter(request => {
            // const matchesType = !params.type || request.type === params.type;
            const matchesSearch = !params.search || request.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesSearch
        });

        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort the filtered reviews
        const sortedRequests = filteredRequests
            .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedRequests.slice(0, page * itemsPerPage)
            : sortedRequests.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // console.log("Bug Reports Data: => ", data)

        return {
            data,
            total: filteredRequests.length
        };
    },

    async createFeatureRequest(appId: string, user: User, rank: Rank, requestData: { title: string, description: string }): Promise<FeatureRequest> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddFeatureRequest" },
                { name: "appId", value: appId },
                { name: "description", value: requestData.description },
                { name: "title", value: requestData.title },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_FEATURE_REQUEST_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const featureRequest: FeatureRequest = messageData.data;
                return featureRequest;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to send Feature Request, ${error}`)
        }
    },

    async createBugReport(appId: string, user: User, rank: Rank, requestData: { title: string, description: string }): Promise<BugReport> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddBugReport" },
                { name: "appId", value: appId },
                { name: "description", value: requestData.description },
                { name: "title", value: requestData.title },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_BUG_REPORT_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Bug Report Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const bugReport: BugReport = messageData.data;
                return bugReport;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get create bug report, ${error}`)
        }

    },

    async updateFeatureRequest(appId: string, requestId: string, rank: Rank, requestData: { title: string, description: string }): Promise<FeatureRequest> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "EditFeatureRequest" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },
                { name: "description", value: requestData.description },
                { name: "title", value: requestData.title },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_FEATURE_REQUEST_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const featurRequest: FeatureRequest = messageData.data;
                return featurRequest;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get update Feature Request, ${error}`)
        }
    },

    async updateBugReport(appId: string, requestId: string, rank: Rank, requestData: { title: string, description: string }): Promise<BugReport> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "EditBugReport" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },
                { name: "description", value: requestData.description },
                { name: "title", value: requestData.title },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_BUG_REPORT_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Bug Report Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const bugReport: BugReport = messageData.data;
                return bugReport;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get update bug report, ${error}`)
        }
    },

    async markFeatureRequestHelpful(appId: string, requestId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkHelpfulFeatureRequest" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },

            ], PROCESS_ID_FEATURE_REQUEST_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Unhelpful Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const helpfulData: HelpfulData = messageData.data;
                return helpfulData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to vote feature as helpful, ${error}`)
        }
    },

    async markFeatureRequestUnhelpful(appId: string, requestId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkUnhelpfulFeatureRequest" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },

            ], PROCESS_ID_FEATURE_REQUEST_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Unhelpful Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const unhelpfulData: HelpfulData = messageData.data;
                return unhelpfulData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to vote feature as unhelpful, ${error}`)
        }
    },

    async markBugReportHelpful(appId: string, requestId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkHelpfulBugReport" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },

            ], PROCESS_ID_BUG_REPORT_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Bug helpful Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const helpfulData: HelpfulData = messageData.data;
                return helpfulData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to vote bug as helpful, ${error}`)
        }
    },

    async markBugReportUnhelpful(appId: string, requestId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkUnhelpfulBugReport" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },

            ], PROCESS_ID_BUG_REPORT_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Bug Unhelpful Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const unhelpfulData: HelpfulData = messageData.data;
                return unhelpfulData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to vote bug as unhelpful, ${error}`)
        }
    },

    async replyToFeatureRequest(appId: string, requestId: string, user: User, rank: Rank, requestData: { description: string }) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddFeatureRequestReply" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "description", value: requestData.description },
                { name: "rank", value: rank.rank },

            ], PROCESS_ID_FEATURE_REQUEST_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Request reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: Reply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to add update Feature Request reply, ${error}`)
        }
    },

    async replyToBugReport(appId: string, requestId: string, user: User, rank: Rank, requestData: { description: string }) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddBugReportReply" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "description", value: requestData.description },
                { name: "rank", value: rank.rank },

            ], PROCESS_ID_BUG_REPORT_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Bug Report reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: Reply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to add update bug report reply, ${error}`)
        }
    },

    async editFeatureRequestReply(appId: string, requestId: string, replyId: string, requestData: { description: string }) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "EditFeatureRequestReply" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },
                { name: "replyId", value: replyId },
                { name: "description", value: requestData.description },

            ], PROCESS_ID_FEATURE_REQUEST_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Request reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: Reply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to edit update Feature Request reply, ${error}`)
        }
    },

    async editBugReportReply(appId: string, requestId: string, replyId: string, requestData: { description: string }) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "EditBugReportReply" },
                { name: "appId", value: appId },
                { name: "requestId", value: requestId },
                { name: "replyId", value: replyId },
                { name: "description", value: requestData.description },

            ], PROCESS_ID_BUG_REPORT_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Bug Report reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: Reply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to edit update bug report reply, ${error}`)
        }
    },

    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },
};