
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
    fetchDappRatingsTotals: async (appId: string): Promise<{ dataSpec: Record<string, number | string>[]; categories: string[] }> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const { dataSpec, categories } = await generateRatingsDataSpec("Total Reviews") as { dataSpec: Record<string, number | string>[]; categories: string[] };

        return { dataSpec, categories };
    },
    fetchDappusersDataSpec: async (appId: string, days: number): Promise<{ date: string; users: number }[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const dataSpec = await generateDailyDataSpec(days, 'users') as { date: string; users: number }[];

        return dataSpec;
    },
    fetchFeatureBugTotals: async (appId: string): Promise<{ dataSpec: Record<string, number | string>[]; categories: string[] }> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const { dataSpec, categories } = await generateFeatureBugDataSpec("value") as { dataSpec: Record<string, number | string>[]; categories: string[] };

        return { dataSpec, categories };
    },
}