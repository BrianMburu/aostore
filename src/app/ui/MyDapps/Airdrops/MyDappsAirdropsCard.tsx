'use client'

import { motion } from "framer-motion";
import Link from "next/link";

import { Airdrop, statusType } from "@/types/airDrop";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import ProfileImage from "../../ProfilePic";
import { applyPrecision } from "@/utils/ao";


export function MyDappsAirDropCard({ airdrop }: { airdrop: Airdrop }) {
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const statusColors: Record<statusType, string> = {
        ongoing: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
        completed: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };
    return (
        <motion.div
            key={airdrop.airdropId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
            <div className="flex items-center gap-3 mb-3">
                <ProfileImage imgUrl={airdrop.appIconUrl} alt={airdrop.title} className="h-8 w-8" />
                {/* <GiftIcon className="h-6 w-6 text-purple-500" /> */}
                <h3 className="text-lg font-semibold dark:text-white">{airdrop.title}</h3>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Amount</span>
                    <span className="font-medium dark:text-gray-200">{applyPrecision(airdrop.amount, airdrop.tokenDenomination || 1)} Tokens</span>
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
                <span className={`px-3 py-1 rounded-full text-sm  font-medium ${statusColors[airdrop.status.toLowerCase() as statusType]}`}>
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
    )
}