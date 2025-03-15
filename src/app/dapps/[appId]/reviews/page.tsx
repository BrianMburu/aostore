import DappReviewForm from "@/app/ui/Dapps/Review/DappReviewForm"
import DappReviews from "@/app/ui/Dapps/Review/DappReviews"
import ReviewsFilters from "@/app/ui/MyDapps/Reviews/ReviewFilters";


export default async function ReviewsPage(props: {
    params: Promise<{ appId: string }>
}) {

    const currParams = await props.params;
    const appId = currParams.appId as string;

    return (
        <div className="space-y-8">
            <DappReviewForm />

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Reviews</h2>
                <ReviewsFilters />
            </div>

            <DappReviews appId={appId} />
        </div>)
}