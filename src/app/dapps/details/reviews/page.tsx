import { Suspense } from "react";

import DappReviewForm from "@/app/ui/Dapps/Review/DappReviewForm";
import DappReviews from "@/app/ui/Dapps/Review/DappReviews";
import ReviewsListSkeleton from "@/app/ui/Dapps/Review/skeletons/ReviewsListSkeleton";
import ReviewsFilters from "@/app/ui/MyDapps/Reviews/ReviewFilters";


export default function ReviewsPage() {
    return (
        <div className="space-y-8">
            <Suspense>
                <DappReviewForm />
            </Suspense>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Reviews</h2>
                <Suspense>
                    <ReviewsFilters />
                </Suspense>
            </div>

            <Suspense fallback={<ReviewsListSkeleton n={6} />}>
                <DappReviews />
            </Suspense>
        </div>
    )
}