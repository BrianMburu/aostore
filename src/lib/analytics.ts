// import { AnalyticsData } from "@/types/analytics"

// lib/analytics.ts
export async function generateDailyData(days: number, metric: string) {
    return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i) * 86400000).toISOString().split('T')[0],
        [metric]: Math.floor(Math.random() * 1000)
    }))
}

export async function generateDailyDataSpec(days: number, metric: string) {
    const baseValues: Record<string, number> = {
        dapps: 500,
        developers: 200,
        transactions: 1000000,
        community: 20000,
        activity: 5000
    }

    return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i) * 86400000).toISOString().split('T')[0],
        [metric]: Math.floor(
            baseValues[metric] * (1 + i * 0.01) + Math.random() * baseValues[metric] * 0.1
        )
    }))
}


export async function generateHourlyData(hours: number, metric: string) {
    return Array.from({ length: hours }, (_, i) => ({
        hour: i,
        [metric]: Math.floor(Math.random() * 100)
    }))
}

export async function fetchAnalytics() {
    // console.log("fetchAnalytics", appId)
    const data = {
        userAcquisition: await generateDailyData(1000, 'favorites'),
        popularity: await generateHourlyData(24, 'likes'),
        stability: [
            { type: 'feature', count: 65 },
            { type: 'bug', count: 35 }
        ]
    }
    return data
}