import { ReviewsList } from '@/app/ui/MyDapps/Reviews/ReviewsList'
import ReviewsFilters from '@/app/ui/MyDapps/Reviews/ReviewFilters';
import { ReviewService } from '@/services/ao/reviewService';

interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<{ sort?: string; filter?: string, page?: string }>;
}
export default async function ReviewsPage(props: Props) {

    const currParams = await props.params;
    const appId = currParams.appId as string;
    const searchParams = await props.searchParams;
    const { data, total } = await ReviewService.getReviews(appId, searchParams, true);

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