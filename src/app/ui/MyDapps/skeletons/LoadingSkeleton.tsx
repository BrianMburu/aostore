import { Skeleton } from "../../skeleton";

// components/LoadingSkeleton.tsx
export function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {/* Filters Skeleton */}
            <div className='bg-white dark:bg-gray-800 shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                    <div className='flex flex-col gap-4'>
                        <div className='w-full flex justify-center'>
                            <Skeleton className="h-12 bg-gray-200 dark:bg-gray-700 w-1/2 rounded-2xl" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                            <Skeleton className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                            <Skeleton className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* DApps Grid Skeleton */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}