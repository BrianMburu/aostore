import { AnalyticsService } from '@/services/ao/analyticsService';
import { BarChart } from '@tremor/react'


export async function UserTransactionsChart({ title }: { title: string }) {
    const data = await AnalyticsService.fetchTransactionsDataSpec(31);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <BarChart
                data={data}
                categories={["transactions"]}
                index="date"
                colors={["emerald"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};