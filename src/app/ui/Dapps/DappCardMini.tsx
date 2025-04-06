'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
// import { StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { DappList } from '@/types/dapp';

export default function DAppCardMini({ dapp }: { dapp: DappList }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6"
        >
            <Link href={`/dapps/${dapp.appId}`}>
                <div className="flex flex-col items-center">
                    <Image
                        src={dapp.appIconUrl}
                        alt={dapp.appName}
                        width={100}
                        height={100}
                        className="w-30 h-30 rounded-2xl mb-4"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {dapp.appName}
                    </p>
                    {/* <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon
                                key={i}
                                className={`h-4 w-4 ${i < dapp.ratings
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                    }`}
                            />
                        ))}
                    </div> */}
                    <span className="px-3 py-1 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 text-sm rounded-full">
                        {dapp.projectType}
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}