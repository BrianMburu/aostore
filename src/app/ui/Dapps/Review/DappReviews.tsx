'use client'

import { ReviewItem } from './ReviewItem';
import InfinityScrollControls from '../../InfinityScrollControls';
import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { Review } from '@/types/review';
import ReviewsListSkeleton from './skeletons/ReviewsListSkeleton';
import { EmptyState } from '../../EmptyState';
import { ReviewFilterParams, ReviewService } from '@/services/ao/reviewService';

export default function DappReviews() {
    // const appId = useParams().appId as string;
    const searchParams = useSearchParams();
    const appId = searchParams.get('appId') as string || "";


    const { user, isConnected } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const loadReviews = useCallback(async () => {
        const filterParams = Object.fromEntries(searchParams.entries()) as ReviewFilterParams;

        try {
            const { data, total } = await ReviewService.getReviews(appId, filterParams, true);
            if (data !== null) {
                setReviews(data);
                setTotal(total);
            }
        } catch (error) {
            console.error(error);
            setReviews([]);
        } finally {
            setIsLoading(false)
        }
    }, [appId, searchParams]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    const refreshReviews = () => {
        loadReviews();
    };
    if (isLoading) return <ReviewsListSkeleton n={6} />;

    if (!isLoading && reviews.length === 0) {
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
                <ReviewItem key={currentUserReview.reviewId} appId={appId} review={currentUserReview} refreshReviews={refreshReviews}
                    isConnected={isConnected} />
            )}

            {/* Display the rest of the reviews */}
            {otherReviews.map(review => (
                <ReviewItem key={review.reviewId} appId={appId} review={review} refreshReviews={refreshReviews}
                    isConnected={isConnected} />
            ))}

            {/* Load More Reviews */}
            {reviews &&
                <Suspense>
                    <InfinityScrollControls
                        totalPages={Math.ceil(total / DEFAULT_PAGE_SIZE)}
                    />
                </Suspense>
            }
        </div>
    )
}