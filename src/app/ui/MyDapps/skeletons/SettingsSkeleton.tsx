// app/mydapps/[appId]/loading.tsx

import { Skeleton } from "../../skeleton";
import { AddModeratorFormSkeleton } from "./AddModeratorFormSkeleton";

export default function SettingsSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-700" />
                </div>
                <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Dapp Edit Form Skeleton */}
            <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="mb-4">
                    <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                            <Skeleton className="h-10 bg-gray-200 dark:bg-gray-700" />
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex justify-end pt-6">
                    <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            {/* Add Token Form Skeleton */}
            <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="mb-4">
                    <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                            <Skeleton className="h-10 bg-gray-200 dark:bg-gray-700" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-6">
                    <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            {/* Add Moderator Form Skeleton */}
            <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <AddModeratorFormSkeleton />
            </div>

            {/* Change Owner Form Skeleton */}
            <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="mb-4">
                    <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-10 bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
                <div className="flex justify-end pt-6">
                    <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

        </div>
    )
}