'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/app/ui/skeleton';

export const MyDAppCardSkeleton: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
            {/* Image and Title Section */}
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-20 h-20 rounded-2xl" />
                <div>
                    <Skeleton className="w-32 h-6 mb-2" />
                    <Skeleton className="w-24 h-4" />
                </div>
            </div>

            {/* App Details Section */}
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-24 h-4" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-32 h-4" />
                </div>
            </div>

            {/* Status and Link Section */}
            <div className="flex mt-4 justify-between items-center">
                <Skeleton className="w-20 h-8 rounded-lg" />
                <Skeleton className="w-28 h-4" />
            </div>
        </motion.div>
    );
};

export default React.memo(MyDAppCardSkeleton);
