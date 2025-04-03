'use client'

import { motion } from 'framer-motion';
import { DocumentDuplicateIcon, LinkIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { AppTokenData } from '@/types/dapp';
import { AddDappTokenForm } from './AddDappTokenForm';
import { useAuth } from '@/context/AuthContext';
import { TokenService } from '@/services/ao/tokenService';

interface TokenCardProps {
    appId: string;
    error?: string;
}

export function TokenCard({ appId }: TokenCardProps) {
    const [tokenData, setTokenData] = useState<AppTokenData | null>(null)
    const [copied, setCopied] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                if (!isAuthLoading && isConnected) {
                    const data = await TokenService.fetchTokenDetails(appId);

                    if (data) {
                        setTokenData(data);
                    }

                } else {
                    setTokenData(null);
                }
            } catch (error) {
                console.error(error)

            } finally {
                setIsLoading(false)
            }

        }
        fetchTokenData()
    }, [isConnected, appId, isAuthLoading]);

    if (isLoading) return <TokenCardSkeleton />;

    if (!tokenData || tokenData.tokenId === "nil") {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <AddDappTokenForm appId={appId} />
            </div>
        )
    }

    const handleCopyId = () => {
        navigator.clipboard.writeText(tokenData.tokenId);
        setCopied(true);
        toast.success('Token ID copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    // if (error) return <TokenError message={error} />;

    return (

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
            <div className="flex items-start gap-4">
                {/* Token Logo */}
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {tokenData.logo && !imageError ? (
                            <Image
                                src={tokenData.logo}
                                alt={`${tokenData.tokenName} logo`}
                                className="rounded-lg object-cover"
                                width={64}
                                height={64}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <CheckBadgeIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        )}
                    </div>
                </div>

                {/* Token Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                            {tokenData.tokenName}
                        </h3>
                        <span className="text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                            {tokenData.tokenTicker}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-mono truncate">{tokenData.tokenId}</span>
                        <button
                            onClick={handleCopyId}
                            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            {copied ? (
                                <CheckBadgeIcon className="w-4 h-4" />
                            ) : (
                                <DocumentDuplicateIcon className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Denomination: {tokenData.tokenDenomination}
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                    {tokenData.logo && (
                        <a
                            href={tokenData.logo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <LinkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Skeleton Loader
export function TokenCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700" />
                <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
                </div>
            </div>
        </div>
    );
}

// Error State
// function TokenError({ message }: { message: string }) {
//     return (
//         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
//             <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
//                 <span className="text-sm font-medium">{message}</span>
//             </div>
//         </div>
//     );
// }