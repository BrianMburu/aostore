'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaceFrownIcon } from '@heroicons/react/24/outline'

export default function NotFoundComponent() {
    return (
        <div className="mt-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-xl"
            >
                <div className="flex justify-center mb-8">
                    <div className="relative flex space-x-2 items-center">
                        <FaceFrownIcon className="h-28 w-28 text-gray-400 dark:text-gray-600" />
                        <span className="text-6xl font-bold text-gray-200 dark:text-gray-700">
                            404
                        </span>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Page Not Found
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Oops! The page you&apos;re looking for has vanished into the digital void.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                >
                    Return to Safety
                </Link>
            </motion.div>
        </div>
    )
}
