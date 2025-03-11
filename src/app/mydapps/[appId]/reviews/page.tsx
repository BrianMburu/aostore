import { ReviewsList } from '@/app/ui/MyDapps/Reviews/ReviewsList'
import ReviewsFilters from '@/app/ui/MyDapps/Reviews/ReviewFilters';
import { ReviewService } from '@/services/ao/reviewService';

export default async function ReviewsPage({
    params,
    searchParams,
}: {
    params: { appId: string }
    searchParams: { sort?: string; filter?: string, page?: string }
}) {

    const currParams = await params;
    const appId = currParams.appId as string;
    const { data, total } = await ReviewService.getReviews(appId, await searchParams, true);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">User Reviews</h2>
                <ReviewsFilters />
            </div>

            <ReviewsList reviews={data} totalItems={total} />
        </div>
    )
}