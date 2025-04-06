
'use client'

// app/airdrops/page.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Airdrop, statusType } from '@/types/airDrop';
import ProfileImage from '../ProfilePic';
import { capitalizeFirstLetter } from '@/utils/message';
import { applyPrecision } from '@/utils/ao';

export function AirdropCard({ airdrop }: {
    airdrop: Airdrop
}) {
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const statusColors: Record<statusType, string> = {
        ongoing: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
        completed: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
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
                    <ProfileImage imgUrl={airdrop.appIconUrl} alt={airdrop.title} className="h-6 w-6" />
                    {/* <RocketLaunchIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> */}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{airdrop.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {capitalizeFirstLetter(airdrop.status)}
                    </p>
                </div>
            </div>

            <div className="space-y-4 p-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Amount</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {applyPrecision(airdrop.amount, airdrop.tokenDenomination || 1)} Tokens
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Published</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {timeFormatter.format(airdrop.startTime)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Expires</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {timeFormatter.format(airdrop.endTime)}
                    </span>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[airdrop.status.toLowerCase() as statusType]}`}>
                    {airdrop.status.toUpperCase()}
                </span>
                <Link
                    href={`airdrops/${airdrop.airdropId}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
                >
                    Details <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
            </div>
        </motion.div>
    );
}