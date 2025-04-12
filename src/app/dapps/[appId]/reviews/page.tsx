import DappReviewForm from "@/app/ui/Dapps/Review/DappReviewForm"
import DappReviews from "@/app/ui/Dapps/Review/DappReviews"
import ReviewsFilters from "@/app/ui/MyDapps/Reviews/ReviewFilters";

export default function ReviewsPage() {
    return (
        <div className="space-y-8">
            <DappReviewForm />

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Reviews</h2>
                <ReviewsFilters />
            </div>

            <DappReviews />
        </div>)
}