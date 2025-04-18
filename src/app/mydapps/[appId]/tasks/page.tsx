import { Suspense } from 'react';
import { TaskFilters } from '@/app/ui/Dapps/Tasks/TaskFilters';
import { MyTasksList } from '@/app/ui/MyDapps/Tasks/MyTaskList';
import { MyTaskListSkeleton } from '@/app/ui/MyDapps/Tasks/skeletons/MyTaskListSkeleton';
import { fetchAllPages } from '@/helpers/idsPaginator';
import { DAppService } from '@/services/ao/dappService';

export async function generateStaticParams() {
    try {
        const appIds = await fetchAllPages((page) => DAppService.getAllDappIds(page));
        return appIds;
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

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