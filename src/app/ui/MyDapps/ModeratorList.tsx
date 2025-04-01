'use client'

import { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { DAppService } from '@/services/ao/dappService';


export function ModeratorsList({ appId, accessPage, refreshTrigger }: { appId: string; refreshTrigger?: string | null, accessPage: string }) {
    const [moderators, setModerators] = useState<string[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);

    const [isLoading, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            try {
                const { data, total } = await DAppService.getMods(appId, accessPage);

                setModerators(data);
                setTotalItems(total)
            } catch (error) {
                toast.error('Failed to fetch moderators');
                console.error(error)
            }
        }
        );
    }, [appId, refreshTrigger, accessPage]);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Current Moderators ({isLoading ? '...' : totalItems})
            </h3>

            {isLoading ? (
                <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-8 w-24 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                    ))}
                </div>
            ) : (
                <AnimatePresence>
                    <div className="flex flex-wrap gap-2">
                        {moderators.map((mod) => (
                            <motion.div
                                key={mod}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                            >
                                <UserCircleIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                <span className="text-sm text-gray-800 dark:text-gray-200">{mod}</span>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
}