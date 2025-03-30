import { TaskItemMiniSkeleton } from "./TaskItemsMiniSkeleton";

export const MyTaskListSkeleton = ({ n = 5 }: { n?: number }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
        {[...Array(n)].map((_, i) => (
            <TaskItemMiniSkeleton key={i} />
        ))}
    </div>

);