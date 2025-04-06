'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DappList } from '@/types/dapp';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function DAppCard({ dapp }: { dapp: DappList }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 sm:p-4 relative"
        >
            {/* External Link Button */}
            {dapp.websiteUrl && (
                <a
                    href={dapp.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label={`Visit ${dapp.appName} website`}
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        {/* <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Visit Website
                        </span> */}
                    </motion.div>
                </a>
            )}

            <Link href={`/dapps/${dapp.appId}`}>
                <div className="flex flex-row gap-4 sm:flex-col items-center justify-center w-full">
                    <Image
                        src={dapp.appIconUrl}
                        alt={dapp.appName}
                        width={100}
                        height={100}
                        className="w-24 h-24 rounded-2xl"
                    />
                    <div className="flex flex-col items-center w-full sm:text-center text-left space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {dapp.appName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {dapp.protocol}
                        </p>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm dark:text-gray-300 rounded-full">
                            {dapp.projectType}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}