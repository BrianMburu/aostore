'use client'

import { motion } from 'framer-motion';

export function TaskItemMiniSkeleton() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            className="group bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl shadow-lg transition-shadow relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('/grid-pattern.svg')]" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        </div>

                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Progress and Stats Skeleton */}
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    </div>

                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-3/4 animate-pulse" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}