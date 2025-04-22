import { ForumFilters } from "@/app/ui/MyDapps/Forum/ForumFilters";
import { QuestionsList } from "@/app/ui/MyDapps/Forum/QuestionsList"
import ForumCardsSkeleton from "@/app/ui/MyDapps/Forum/skeletons/ForumCardsSkeleton";
import { Suspense } from "react";
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

export default async function ForumPage() {

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white mb-4 md:mb-0">Forum Questions</h2>
                <Suspense>
                    <ForumFilters />
                </Suspense>
            </div>

            <Suspense fallback={<ForumCardsSkeleton n={5} />}>
                <QuestionsList />
            </Suspense>
        </div>
    )
}