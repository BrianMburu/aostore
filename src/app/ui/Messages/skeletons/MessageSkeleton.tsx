import { Skeleton } from "../../skeleton";
import MessageListSkeleton from "./MessageListSkeleton";

export function MessageSkeleton() {

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
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