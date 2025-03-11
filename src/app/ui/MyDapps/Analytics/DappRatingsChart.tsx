import { AnalyticsService } from '@/services/ao/analyticsService';
import { BarChart } from '@tremor/react'


export async function DappRatingsChart({ appId, title }: { appId: string, title: string }) {
    const { dataSpec: data, categories } = await AnalyticsService.fetchDappRatingsTotals(appId);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <BarChart
                data={data}
                categories={categories}
                index="name"
                colors={["blue", "green", "yellow", "orange", "red"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};