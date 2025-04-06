'use client'

import { Airdrop, statusType } from "@/types/airDrop";
import { useEffect, useState, useTransition } from "react";
import { AidropsFilterParams, AirdropService } from "@/services/ao/airdropService";
import { AirdropsSkeletonVertical } from "./skeletons/AirdropsSkeleton";
import { motion } from "framer-motion";
import { GiftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import { EmptyState } from "../EmptyState";
import { useAuth } from "@/context/AuthContext";

export function AirdropsListLimit({ params, appId }: { appId: string, params: AidropsFilterParams }) {
    const [airdrops, setAirdrops] = useState<Airdrop[]>([]);

    const [fetching, StartTransition] = useTransition();
    const { isConnected, isLoading } = useAuth();

    useEffect(() => {
        StartTransition(
            async () => {
                try {
                    if (!isLoading && isConnected) {
                        const { data, } = await AirdropService.fetchAirdropsLimit(appId, params, 4)

                        if (data) {
                            setAirdrops(data);
                        }
                    } else {
                        setAirdrops([]);
                    }
                } catch (error) {
                    setAirdrops([]);
                    console.error(error)
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, params.appId]);

    if (fetching) {
        return <AirdropsSkeletonVertical n={8} />
    }

    if (!fetching && airdrops.length == 0) {
        return (
            <EmptyState
                title="No Airdrops Found"
                description="No new Airdrops have been launched by this Project."
                icon={GiftIcon}
                interactive
                className="my-8"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 mb-8">
            {airdrops.map(airdrop => (
                <AirdropCardCustom
                    key={airdrop.airdropId}
                    airdrop={airdrop}
                />
            ))}
        </div>
    )
}

export function AirdropCardCustom({ airdrop }: { airdrop: Airdrop }) {
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
                <GiftIcon className="h-6 w-6 text-purple-500" />
                <h3 className="text-lg font-semibold dark:text-white">{airdrop.title}</h3>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Amount</span>
                    <span className="font-medium dark:text-gray-200">{airdrop.amount.toLocaleString()} Tokens</span>
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
    )
}