import { Skeleton } from "../../skeleton";

// Skeleton Loader
export function AddModeratorFormSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <Skeleton className="h-8 rounded w-64" />

            <div className="p-4 border rounded-lg space-y-3">
                <Skeleton className="h-10 rounded" />
                <Skeleton className="h-4 rounded w-1/2" />
            </div>

            <Skeleton className="h-10 rounded w-32 ml-auto" />
        </div>
    );
}