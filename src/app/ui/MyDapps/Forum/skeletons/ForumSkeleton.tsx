import { Skeleton } from "@/app/ui/skeleton";

// app/mydapps/[appId]/forum/loading.tsx
export default function ForumSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-48 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 dark:border-gray-700">
                        <Skeleton className="h-6 w-64 bg-gray-200 dark:bg-gray-700 mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                            <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                        </div>

                        <div className="flex gap-4 mt-6">
                            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>
                ))}

                <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
        </div>
    )
}