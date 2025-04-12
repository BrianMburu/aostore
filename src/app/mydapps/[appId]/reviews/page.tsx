import { ReviewsList } from '@/app/ui/MyDapps/Reviews/ReviewsList'
import ReviewsFilters from '@/app/ui/MyDapps/Reviews/ReviewFilters';

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