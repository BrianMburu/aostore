'use client'

import { ReviewItem } from './ReviewItem';
import InfinityScrollControls from '../../InfinityScrollControls';
import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { ReviewService, ReviewFilterParams } from "@/services/ao/reviewService";
// import { notFound } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useTransition } from 'react';
import { Review } from '@/types/review';
import ReviewsListSkeleton from './skeletons/ReviewsListSkeleton';
import { EmptyState } from '../../EmptyState';

export default function DappReviews({ appId, searchParams }:
    { searchParams: ReviewFilterParams, appId: string }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [total, setTotal] = useState(0);
    const [fetching, startTransition] = useTransition();
    const { isConnected } = useAuth();

    useEffect(() => {
        startTransition(async () => {
            try {
                const { data, total } = await ReviewService.getReviews(appId, searchParams, true);
                if (data !== null) {
                    setReviews(data);
                    setTotal(total);
                }
            } catch (error) {
                console.error(error)
            }
        });
    }, [isConnected, appId, searchParams]);

    if (fetching) return <ReviewsListSkeleton n={6} />;

    if (!fetching && reviews.length === 0) {
        return (
            <EmptyState
                title="No Reviews Found"
                description="We couldn't find any Reviews from the results."
                interactive
                className="my-12"
            />
        )
    }

    const currentUserReview = reviews.find(review => review.user === user?.walletAddress);
    const otherReviews = reviews.filter(review => review.user !== user?.walletAddress);

    return (
        <div className="space-y-8">
            {/* Display the current user's review first */}
            {currentUserReview && (
                <ReviewItem key={currentUserReview.reviewId} appId={appId} review={currentUserReview} />
            )}

            {/* Display the rest of the reviews */}
            {otherReviews.map(review => (
                <ReviewItem key={review.reviewId} appId={appId} review={review} />
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