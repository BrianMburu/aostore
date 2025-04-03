// import { AnalyticsService, MetricType } from "@/services/ao/analyticsService";
import { formatNumber } from "@/utils/analytics";

interface TotalCardProps {
    title: string;
    total: number;
    icon: React.ReactNode;
}

export function TotalCard({ title, total, icon }: TotalCardProps) {
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