import { AnalyticsService } from '@/services/ao/analyticsService';
import { AreaChart } from '@tremor/react'


export async function DevAcquisitionChart({ title }: { title: string }) {
    const data = await AnalyticsService.fetchdevelopersDataSpec(70);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <AreaChart
                data={data}
                categories={["developers"]}
                index="date"
                colors={["emerald"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};