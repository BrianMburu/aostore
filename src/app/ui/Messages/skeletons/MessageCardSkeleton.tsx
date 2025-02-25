// components/MessageCardSkeleton.tsx
'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '../../skeleton';

const MessageCardSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b dark:border-gray-700"
        >
            <div className="flex items-start p-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        {/* Skeleton for type badge */}
                        <Skeleton className="w-16 h-4" />
                        {/* Skeleton for unread dot */}
                        <Skeleton className="w-2 h-2 rounded-full" />
                    </div>
                    {/* Skeleton for title */}
                    <Skeleton className="w-3/4 h-6" />
                    {/* Skeleton for message content (two lines) */}
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-1/2 h-4" />
                    {/* Skeleton for "Show more" button */}
                    <Skeleton className="w-24 h-4" />
                </div>
                {/* Skeleton for date */}
                <Skeleton className="w-16 h-4 ml-4" />
            </div>
        </motion.div>
    );
};

export default MessageCardSkeleton;
