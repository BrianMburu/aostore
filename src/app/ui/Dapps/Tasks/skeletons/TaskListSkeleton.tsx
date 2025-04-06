import { TaskItemSkeleton } from "./TaskItemSkeleton";

export const TaskListSkeleton = ({ n = 5 }: { n?: number }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
        {[...Array(n)].map((_, i) => (
            <TaskItemSkeleton key={i} />
        ))}
    </div>

);