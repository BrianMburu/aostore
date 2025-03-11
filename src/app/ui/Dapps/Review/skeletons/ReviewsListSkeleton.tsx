import { ReviewItemSkeleton } from "./ReviewItemSkeleton";

export default function ReviewsListSkeleton({ n }: { n: number }) {
    return (
        <div className="min-h-screen mx-auto space-y-4 animate-pulse">
            <main className="max-w-7xl mx-auto space-y-6">
                {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <Skeleton className="w-1/4 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Skeleton className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <Skeleton className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                </div> */}
                {Array.from({ length: n || 6 }).map((_, i) => (
                    <ReviewItemSkeleton key={i} />
                ))}
            </main>
        </div>
    )
}