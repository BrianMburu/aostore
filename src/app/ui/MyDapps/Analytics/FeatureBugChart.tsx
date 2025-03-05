import { AnalyticsService } from '@/services/ao/analyticsService';
import { DonutChart } from '@tremor/react'


export async function FeatureBugChart({ appId, title }: { appId: string, title: string }) {
    const { dataSpec: data, } = await AnalyticsService.fetchFeatureBugTotals(appId);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <DonutChart
                data={data}
                variant="donut"
                colors={["green", "red"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};