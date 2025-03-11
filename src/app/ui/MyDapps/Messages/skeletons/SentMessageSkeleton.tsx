'use client'

import MessageListSkeleton from "@/app/ui/Messages/skeletons/MessageListSkeleton";
import { Skeleton } from "@/app/ui/skeleton";
import { motion } from "framer-motion";

export function SentMessageSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <MessageFormSkeleton />

            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-48 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            <MessageListSkeleton n={6} />
        </div>
    )
}

export function MessageFormSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8"
        >
            {/* Title */}
            <Skeleton className="w-1/3 h-6 mb-6" />

            <div className="space-y-4">
                {/* Message Type Dropdown */}
                <Skeleton className="w-full h-10 rounded-lg" />

                {/* Message Title Input */}
                <Skeleton className="w-full h-10 rounded-lg" />

                {/* Message Content Textarea (mimicking 4 rows) */}
                <Skeleton className="w-full h-24 rounded-lg" />

                {/* Submit Button */}
                <Skeleton className="w-32 h-10 rounded-lg" />
            </div>
        </motion.div>
    );
};