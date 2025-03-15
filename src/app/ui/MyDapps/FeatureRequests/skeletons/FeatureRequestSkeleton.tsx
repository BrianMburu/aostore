import { Skeleton } from "@/app/ui/skeleton";

export default function FeatureRequestsPageSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-64 bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-10 w-40 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-10 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>

            </div>

            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                            <Skeleton className="w-2 h-full bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-48 bg-gray-200 dark:bg-gray-700" />
                                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                                <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function FeatureRequestsListSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                            <Skeleton className="w-2 h-full bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-48 bg-gray-200 dark:bg-gray-700" />
                                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                                <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}