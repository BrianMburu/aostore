'use client';

import { Review } from "@/types/review";
import ReviewItem from './ReviewItem';
import ReviewsFilters from '../../MyDapps/Reviews/ReviewFilters';
import InfinityScrollControls from '../../InfinityScrollControls';
import { DEFAULT_PAGE_SIZE } from '@/config';

export default function DappReviews({ reviews, totalItems }:
    { reviews: Review[], totalItems: number }) {

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Reviews</h2>
                <ReviewsFilters />
            </div>

            {reviews.map(review => (
                <ReviewItem key={review.reviewId} review={review} />
            ))}

            {/* Load More Reviews */}
            {reviews &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />
            }
        </div>
    )
}