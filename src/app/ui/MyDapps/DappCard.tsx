// components/my-dapps/DAppCard.tsx
'use client';
import { DappList } from '@/types/dapp';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';

export const DAppCard = ({ dapp, isOptimistic }: { dapp: DappList, isOptimistic: boolean }) => {
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className={clsx("bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow",
            isOptimistic && 'opacity-50 animate-pulse')}>
            <div className="flex items-center gap-4 mb-4">
                <Image
                    src={dapp.appIconUrl}
                    alt={dapp.appName}
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded-2xl mb-4"
                />
                <div>
                    <h3 className="text-lg font-semibold dark:text-gray-100">{dapp.appName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dapp.projectType}
                    </p>
                </div>
            </div>
            <div className='flex flex-col space-y-2'>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">App Id</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {dapp.appId}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Created</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {timeFormatter.format(dapp.createdTime)}
                    </span>
                </div>
            </div>


            {/* <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {dapp.description?.slice(0, 50) + " ..."}
            </p> */}

            <div className="flex mt-4 justify-between items-center">
                <span className={`px-2 py-1 rounded-lg ${dapp.verified === 'verified' ? 'bg-green-100 text-green-800 dark:text-green-500' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {dapp.verified === 'verified' ? 'Verified' : 'Pending'}
                </span>
                {/* <Chip variant={dapp.verified ? 'success' : 'warning'}>
                    {dapp.verified ? 'Verified' : 'Pending Verification'}
                </Chip> */}
                <Link
                    href={`/mydapps/${dapp.appId}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                // rel="noopener noreferrer"
                >
                    Visit Dashboard
                </Link>
            </div>
            {/* Existing DApp item content */}
            {isOptimistic && (
                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900/50 z-[-1]" />
            )}
        </div>
    );
};