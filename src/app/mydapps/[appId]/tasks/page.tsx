import { Suspense } from 'react';
import { TaskFilters } from '@/app/ui/Dapps/Tasks/TaskFilters';
import { MyTasksList } from '@/app/ui/MyDapps/Tasks/MyTaskList';
import { MyTaskListSkeleton } from '@/app/ui/MyDapps/Tasks/skeletons/MyTaskListSkeleton';

export default function ForumPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">Tasks</h2>
                <TaskFilters />
            </div>

            {/* Tasks List */}
            <Suspense fallback={<MyTaskListSkeleton />}>
                <MyTasksList />
            </Suspense>
        </div>

    );
}