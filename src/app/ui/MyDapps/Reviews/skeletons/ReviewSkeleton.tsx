import { Skeleton } from "@/app/ui/skeleton";

// app/mydapps/[appId]/reviews/loading.tsx
export default function ReviewsSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                                <Skeleton className="h-3 w-48 bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-3/4 mt-2 bg-gray-200 dark:bg-gray-700" />

                        <div className="flex gap-4 mt-6">
                            <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-700" />
                            <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}