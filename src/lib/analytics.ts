// import { AnalyticsData } from "@/types/analytics"

// lib/analytics.ts
export async function generateDailyData(days: number, metric: string) {
    return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i) * 86400000).toISOString().split('T')[0],
        [metric]: Math.floor(Math.random() * 1000)
    }))
}

export async function generateHourlyData(hours: number, metric: string) {
    return Array.from({ length: hours }, (_, i) => ({
        hour: i,
        [metric]: Math.floor(Math.random() * 100)
    }))
}

export async function fetchAnalytics(appId: string) {
    const data = {
        userAcquisition: await generateDailyData(30, 'favorites'),
        popularity: await generateHourlyData(24, 'likes'),
        stability: [
            { type: 'feature', count: 65 },
            { type: 'bug', count: 35 }
        ]
    }
    return data
}