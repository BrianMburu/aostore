import { Skeleton } from "@/app/ui/skeleton";

// app/mydapps/[appId]/forum/loading.tsx
export default function ForumCardsSkeleton({ n = 5 }: { n?: number | undefined }) {
    return (
        <div className="space-y-6 animate-pulse">
            {[...Array(n)].map((_, i) => (
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
    )
}