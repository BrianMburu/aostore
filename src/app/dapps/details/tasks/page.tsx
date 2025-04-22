import { ForumPostsSkeleton } from '@/app/ui/forum/skeletons/ForumPostSkeleton';
import { Suspense } from 'react';
import { TasksList } from '@/app/ui/Dapps/Tasks/TasksList';
import { TaskFilters } from '@/app/ui/Dapps/Tasks/TaskFilters';
// import { fetchAllPages } from '@/helpers/idsPaginator';
// import { DAppService } from '@/services/ao/dappService';

// export async function generateStaticParams() {
//     try {
//         const appIds = await fetchAllPages((page) => DAppService.getAllDappIds(page));

//         return appIds;
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [{ appId: "TX1" }];
//     }
// }

export default function TasksPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">Tasks</h2>
                <Suspense>
                    <TaskFilters />
                </Suspense>
            </div>
            {/* Posts List */}
            <Suspense fallback={<ForumPostsSkeleton />}>
                <TasksList />
            </Suspense>
        </div>
    );
}