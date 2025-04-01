// app/components/ui/MessageCardSkeleton.tsx
'use client'

import { motion } from 'framer-motion'

export function MessageCardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative border-l-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-gray-200 dark:border-l-gray-700"
        >
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            {/* App Icon Skeleton */}
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />

                            {/* Type Badge Skeleton */}
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            </div>
                        </div>

                        {/* Title Skeleton */}
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />

                        {/* Message Content Skeleton */}
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Timestamp & Company Skeleton */}
                    <div className="text-right space-y-2">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}