'use client'

import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorBoundaryProps {
    error: Error
    reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl w-full"
            >
                <div className="flex flex-col items-center text-center">
                    <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Unexpected Error Occurred
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {error.message || 'Something went wrong. Please try again.'}
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={reset}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// Optional: Error Skeleton Component
export function ErrorSkeleton() {
    return (
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl w-full">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="flex gap-4 mt-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
            </div>
        </div>
    )
}