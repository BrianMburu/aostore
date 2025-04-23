import { TaskPageSkeleton } from '@/app/ui/Dapps/Tasks/skeletons/TaskPageSkeleton';
import { TaskDetailsMain } from '@/app/ui/Dapps/Tasks/TaskDetailsMain';
import { Suspense } from 'react';
// import { fetchAllPages } from '@/helpers/idsPaginator';
// import { DAppService } from '@/services/ao/dappService';
// import { TaskService } from '@/services/ao/taskService';

// export async function generateStaticParams() {
//     try {
//         const [appIds, taskIds] = await Promise.all([
//             fetchAllPages((page) => DAppService.getAllDappIds(page)),
//             fetchAllPages((page) => TaskService.getAllTasksIds(page)),
//         ]);

//         return appIds.flatMap((appId) =>
//             taskIds.map((taskId) => ({ ...appId, ...taskId }))
//         );
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [{ appId: "TX1", taskId: "PX1" }];
//     }
// }

export default function TaskDetailsPage() {
    return (
        <div>
            <Suspense fallback={<TaskPageSkeleton />}>
                <TaskDetailsMain />
            </Suspense>
        </div>
    )
}