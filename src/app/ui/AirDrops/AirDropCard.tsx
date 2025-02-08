
'use client'

// app/airdrops/page.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { AppAirdropData } from '@/types/airDrop';

export function AirdropCard({ airdrop, timeFormatter }: {
    airdrop: AppAirdropData,
    timeFormatter: Intl.DateTimeFormat
}) {
    const statusColors = {
        active: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
        claimed: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
        expired: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <RocketLaunchIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{airdrop.appname}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {airdrop.status.charAt(0).toUpperCase() + airdrop.status.slice(1)}
                    </p>
                </div>
            </div>

            <div className="space-y-4 p-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Amount</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {airdrop.amount.toLocaleString()} Tokens
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Published</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {timeFormatter.format(airdrop.publishTime)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Expires</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {timeFormatter.format(airdrop.expiryTime)}
                    </span>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[airdrop.status]}`}>
                    {airdrop.status.toUpperCase()}
                </span>
                <Link
                    href={`/airdrops/${airdrop.airdropId}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
                >
                    Details <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
            </div>
        </motion.div>
    );
}