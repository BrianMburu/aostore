import { Skeleton } from "@/app/ui/skeleton";
import { motion } from "framer-motion";

export function ReviewItemSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
            <div className="flex items-start gap-4 mb-4">
                {/* Profile Image Skeleton */}
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {/* Username Skeleton */}
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center">
                            {/* Rating Stars Skeleton */}
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-4 rounded-full" />
                            ))}
                        </div>
                    </div>
                    {/* Timestamp Skeleton */}
                    <Skeleton className="h-3 w-32 mt-2" />
                </div>
            </div>

            {/* Comment Skeleton */}
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-4" />

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                    {/* Replies Skeleton */}
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-6" />
                </div>
                {/* Tip Form Skeleton */}
                <Skeleton className="h-4 w-12" />

                <div className="flex items-center gap-2">
                    {/* Helpful Button Skeleton */}
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </div>

            {/* Replies Skeleton */}
            <div className="space-y-4 mt-4">
                {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded" />
                ))}
            </div>
        </motion.div>
    );
}
