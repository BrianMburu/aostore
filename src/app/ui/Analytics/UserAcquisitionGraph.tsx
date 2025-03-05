import { AnalyticsService } from '@/services/ao/analyticsService';
import { AreaChart } from '@tremor/react'


export async function UserAcquisitionGraph({ title }: { title: string }) {
    const data = await AnalyticsService.fetchusersDataSpec(150);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <AreaChart
                data={data}
                categories={["users"]}
                index="date"
                colors={["indigo"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};