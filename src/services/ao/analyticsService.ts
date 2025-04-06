import { PROCESS_ID_BUG_REPORT_TABLE, PROCESS_ID_DEV_FORUM_TABLE, PROCESS_ID_FAVORITE_DAPPS, PROCESS_ID_FEATURE_REQUEST_TABLE, PROCESS_ID_REVIEW_TABLE } from "@/config/ao";
import { cleanAoJson, fetchAOmessages } from "@/utils/ao";

export async function generateDailyDataSpec(days: number, metric: string) {
    const baseValues: Record<string, number> = {
        dapps: 500,
        developers: 200,
        transactions: 1000000,
        users: 20000,
        activity: 5000
    }

    const limit = days || 1000;
    return Array.from({ length: limit }, (_, i) => ({
        date: new Date(Date.now() - (limit - i) * 86400000).toISOString().split('T')[0],
        [metric]: Math.floor(
            baseValues[metric] * (1 + i * 0.01) + Math.random() * baseValues[metric] * 0.1
        )
    }))

}

export async function generateRatingsDataSpec(category: string) {
    const baseValues: Record<string, number> = {
        5: 10000,
        4: 5200,
        3: 2000,
        2: 130,
        1: 30
    };

    const limit = Object.values(baseValues).length;
    const keys = Object.keys(baseValues);

    const dataSpec = Array.from({ length: limit }, (_, i) => ({
        name: keys[i],
        [category]: Math.floor(baseValues[keys[i]] * (1 + i * 0.01) + Math.random() * baseValues[keys[i]] * 0.1),
    }));

    return { dataSpec, categories: [category] };
}


export async function generateFeatureBugDataSpec(category: string) {
    const baseValues: Record<string, number> = {
        feature: 10000,
        bug: 5200
    };

    const limit = Object.values(baseValues).length;
    const keys = Object.keys(baseValues);

    const dataSpec = Array.from({ length: limit }, (_, i) => ({
        name: keys[i],
        [category]: Math.floor(baseValues[keys[i]] * (1 + i * 0.01) + Math.random() * baseValues[keys[i]] * 0.1),
    }));

    return { dataSpec, categories: [category] };
}

const getDummyTotals = async (metric: MetricType): Promise<number> => {

    const dataSpec = await generateDailyDataSpec(Math.floor(Math.random() * 10000), metric);

    return dataSpec.length
}

export const metricOptions = [
    'dapps', 'developers', 'transactions', 'users'
] as const;

export type MetricType = typeof metricOptions[number];

export const AnalyticsService = {
    // Dummy Data functions

    fetchTotals: async (metric: MetricType): Promise<number> => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

        const total = await getDummyTotals(metric);

        return total;
    },
    fetchusersDataSpec: async (days: number): Promise<{ date: string; users: number }[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const dataSpec = await generateDailyDataSpec(days, 'users') as { date: string; users: number }[];

        return dataSpec;
    },
    fetchdevelopersDataSpec: async (days: number): Promise<{ date: string; developers: number }[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const dataSpec = await generateDailyDataSpec(days, 'developers') as { date: string; developers: number }[];

        return dataSpec;
    },
    fetchTransactionsDataSpec: async (days: number): Promise<{ date: string; transactions: number }[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const dataSpec = await generateDailyDataSpec(days, 'transactions') as { date: string; transactions: number }[];

        return dataSpec;
    },
    fetchdappsDataSpec: async (days: number): Promise<{ date: string; dapps: number }[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const dataSpec = await generateDailyDataSpec(days, 'dapps') as { date: string; dapps: number }[];

        return dataSpec;
    },
    fetchDappRatingsTotals: async (): Promise<{ dataSpec: Record<string, number | string>[]; categories: string[] }> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        // console.log("fetchDappRatingsTotals", appId)
        const { dataSpec, categories } = await generateRatingsDataSpec("Total Reviews") as { dataSpec: Record<string, number | string>[]; categories: string[] };

        return { dataSpec, categories };
    },
    fetchDappusersDataSpec: async (appId: string, days: number): Promise<{ date: string; users: number }[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const dataSpec = await generateDailyDataSpec(days, 'users') as { date: string; users: number }[];

        return dataSpec;
    },
    fetchFeatureBugTotals: async (): Promise<{ dataSpec: Record<string, number | string>[]; categories: string[] }> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        // console.log("fetchFeatureBugTotals", appId)
        const { dataSpec, categories } = await generateFeatureBugDataSpec("value") as { dataSpec: Record<string, number | string>[]; categories: string[] };

        return { dataSpec, categories };
    },

    // Dapps Latest Functions
    fetchFavoritesCount: async (appId: string): Promise<string> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchFavoritesCount" },
                { name: "appId", value: appId },

            ], PROCESS_ID_FAVORITE_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const bugTotals: string = messageData.data;
                return bugTotals;
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Favorites Totals, ${error}`)
        }
    },

    fetchFavoritesData: async (appId: string): Promise<{ date: string; users: number }[]> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchFavoritesCountHistory" },
                { name: "appId", value: appId },

            ], PROCESS_ID_FAVORITE_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const userHistory: { time: string, count: number }[] = Object.values(messageData.data);

                const userHistoryData = userHistory
                    .map(({ time, count }) => ({ date: new Date(Number(time)).toISOString().split('T')[0], users: count }))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                // console.log("userHistoryData", userHistoryData)
                return userHistoryData;
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Get Ratings Data, ${error}`)
        }
    },

    fetchForumCount: async (appId: string): Promise<string> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetDevForumCount" },
                { name: "appId", value: appId },

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);


            const messageData = JSON.parse(cleanedData);


            if (messageData.code === 200) {
                const bugTotals: string = messageData.data;
                return bugTotals;
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Forum Totals, ${error}`)
        }
    },

    fetchTotalDappRatings: async (appId: string): Promise<string> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchAppReviewsCount" },
                { name: "appId", value: appId },

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const bugTotals: string = messageData.data;
                return bugTotals;
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Bug Totals, ${error}`)
        }
    },

    fetchDappRatingsData: async (appId: string): Promise<{ name: string; value: number }[]> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchAppRatings" },
                { name: "appId", value: appId },

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const ratings: Record<string, number> = messageData.data;
                const ratingsData = Object.entries(ratings).map(([name, value]) => ({ name, value }));
                return ratingsData;
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Get Ratings Data, ${error}`)
        }
    },

    fetchFeatureTotals: async (appId: string): Promise<string> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetFeatureRequestCount" },
                { name: "appId", value: appId },

            ], PROCESS_ID_FEATURE_REQUEST_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const bugTotals: string = messageData.data;
                return bugTotals;
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Feature Totals, ${error}`)
        }
    },

    fetchBugTotals: async (appId: string): Promise<string> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetBugReportCount" },
                { name: "appId", value: appId },

            ], PROCESS_ID_BUG_REPORT_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const bugTotals: string = messageData.data;
                return bugTotals;
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Bug Totals, ${error}`)
        }
    },
}