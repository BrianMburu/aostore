'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DappList } from '@/types/dapp';

export default function DAppCard({ dapp }: { dapp: DappList }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6"
        >
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
                            {dapp.companyName}
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