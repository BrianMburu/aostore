import { ReviewsList } from '@/app/ui/MyDapps/Reviews/ReviewsList'
import ReviewsFilters from '@/app/ui/MyDapps/Reviews/ReviewFilters';
import { fetchAllPages } from '@/helpers/idsPaginator';
import { DAppService } from '@/services/ao/dappService';

export async function generateStaticParams() {
    try {
        const appIds = await fetchAllPages((page) => DAppService.getAllDappIds(page));
        return appIds;
    } catch (error) {
        console.error('Error generating static params:', error);
        return [{ appId: "TX1" }];
    }
}

export default function ReviewsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">User Reviews</h2>
                <ReviewsFilters />
            </div>

            <ReviewsList />
        </div>
    )
}