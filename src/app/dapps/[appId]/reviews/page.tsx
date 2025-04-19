import { Suspense } from "react";

import DappReviewForm from "@/app/ui/Dapps/Review/DappReviewForm"
import DappReviews from "@/app/ui/Dapps/Review/DappReviews"
import ReviewsFilters from "@/app/ui/MyDapps/Reviews/ReviewFilters";
import { fetchAllPages } from "@/helpers/idsPaginator";
import { DAppService } from "@/services/ao/dappService";
import { Loader } from "lucide-react";

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
        <Suspense fallback={<div className="min-h-screen flex justify-center"><Loader /></div>}>
            <div className="space-y-8">
                <DappReviewForm />
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Reviews</h2>
                        <ReviewsFilters />
                    </div>
                </Suspense>

                <DappReviews />
            </div>
        </Suspense>)
}