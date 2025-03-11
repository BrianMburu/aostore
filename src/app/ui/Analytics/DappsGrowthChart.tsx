import { AnalyticsService } from '@/services/ao/analyticsService';
import { BarChart } from '@tremor/react'

export async function DappsGrowthChart({ title }: { title: string }) {
    const data = await AnalyticsService.fetchdappsDataSpec(90);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <BarChart
                data={data}
                categories={["dapps"]}
                index="date"
                colors={["indigo"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};