// app/forum/[postId]/skeletons/TaskSkeleton.tsx
'use client'

export function TaskPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between mb-6">
                <div className="h-6 w-32 bg-gray-200 rounded-full dark:bg-gray-700" />
                <div className="h-6 w-48 bg-gray-200 rounded-full dark:bg-gray-700" />
            </div>

            {/* Title Skeleton */}
            <div className="h-10 w-3/4 bg-gray-200 rounded-xl mb-6 dark:bg-gray-700" />

            {/* Stats Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl dark:bg-gray-700" />
                ))}
            </div>

            {/* Description Skeleton */}
            <div className="space-y-3 mb-8">
                <div className="h-5 w-32 bg-gray-200 rounded-full dark:bg-gray-700" />
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded-full dark:bg-gray-700" />
                ))}
            </div>

            {/* Progress Skeleton */}
            <div className="mb-8">
                <div className="flex justify-between mb-3">
                    <div className="h-4 w-24 bg-gray-200 rounded-full dark:bg-gray-700" />
                    <div className="h-4 w-20 bg-gray-200 rounded-full dark:bg-gray-700" />
                </div>
                <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700" />
            </div>

            {/* Button Skeleton */}
            <div className="h-12 w-48 bg-gray-200 rounded-xl dark:bg-gray-700" />

            {/* Replies Skeleton */}
            <div className="mt-12 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl dark:bg-gray-700" />
                ))}
            </div>
        </div>
    )
}