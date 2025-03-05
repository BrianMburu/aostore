import { AnalyticsService, MetricType } from "@/services/ao/analyticsService";
import { formatNumber } from "@/utils/analytics";

interface TotalCardProps {
    title: string;
    metric: string;
    icon: React.ReactNode;
}

export async function TotalCard({ title, metric, icon }: TotalCardProps) {
    const total = await AnalyticsService.fetchTotals(metric as MetricType);
    const formattedTotal = formatNumber(total)

    return (
        <div
            className="border p-6 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-800"
        >
            <div className="flex items-center gap-4">
                <span className="text-3xl">{icon}</span>
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {title}
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                        {formattedTotal}
                    </p>
                </div>
            </div>
        </div>
    )
}