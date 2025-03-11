'use client'

import ReviewItem, { UserReviewItem } from './ReviewItem';
import InfinityScrollControls from '../../InfinityScrollControls';
import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { ReviewService, ReviewSortParams } from "@/services/ao/reviewService";
// import { notFound } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useTransition } from 'react';
import { Review } from '@/types/review';
import ReviewsListSkeleton from './skeletons/ReviewsListSkeleton';
import { useSearchParams } from 'next/navigation';

export default function DappReviews({ appId }: { appId: string }) {
    const { user } = useAuth();
    const searchParams = useSearchParams()
    const [reviews, setReviews] = useState<Review[]>([]);
    const [total, setTotal] = useState(0);
    const [fetching, startTransition] = useTransition();

    useEffect(() => {
        const filterParams: ReviewSortParams = {
            search: searchParams.get("search") || "",
            sort: searchParams.get("sort") || "",
            page: searchParams.get("page") || "",
            rating: searchParams.get("rating") || ""
        }

        startTransition(async () => {
            const { data, total } = await ReviewService.getReviews(appId, filterParams, true);

            if (data !== null) {
                setReviews(data);
                setTotal(total);
            }
        });
    }, [appId, searchParams]);

    if (fetching) return <ReviewsListSkeleton n={6} />;

    const currentUserReview = reviews.find(review => review.userId === user?.walletAddress);
    const otherReviews = reviews.filter(review => review.userId !== user?.walletAddress);

    return (
        <div className="space-y-8">
            {/* Display the current user's review first */}
            {currentUserReview && (
                <UserReviewItem user={user!} review={currentUserReview} />
            )}

            {/* Display the rest of the reviews */}
            {otherReviews.map(review => (
                <ReviewItem key={review.reviewId} review={review} />
            ))}

            {/* Load More Reviews */}
            {reviews &&
                <InfinityScrollControls
                    totalPages={Math.ceil(total / DEFAULT_PAGE_SIZE)}
                />
            }
        </div>
    )
}