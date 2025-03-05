export function HeaderSkeleton() {
    return (
        <>
            {/* App Header Skeleton */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-48" />
                </div>
            </div>
        </>
    )
}