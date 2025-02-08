'use client';

import { useState } from 'react';
import { Review } from "@/types/dapp";
import ReviewItem from './ReviewItem';
import Loader from '../Loader';

const dummyReviews: Review[] = Array.from({ length: 10 }, (_, i) => ({
    profileUrl: `https://picsum.photos/40?random=${i}`,
    reviewId: `rev-${i}`,
    username: `user${i}`,
    comment: "This is an amazing decentralized social platform!".repeat(2),
    rating: Math.floor(Math.random() * 5) + 1,
    timestamp: Date.now() - 86400000 * i,
    upvotes: Math.floor(Math.random() * 100),
    downvotes: Math.floor(Math.random() * 20),
    helpfulVotes: Math.floor(Math.random() * 50),
    replies: [],
    unhelpfulVotes: 0
    // ... other fields
}));

const fetchReviews = async (appId: string, page: number): Promise<{ data: Review[], hasMore: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const start = (page - 1) * 5;
    return {
        data: dummyReviews.slice(start, start + 5),
        hasMore: start + 5 < dummyReviews.length
    };
};

export default function DappReviews(
    { appId, reviews, setReviews, hasMore, setHasMore }:
        {
            appId: string, reviews: Review[], setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
            hasMore: boolean, setHasMore: React.Dispatch<React.SetStateAction<boolean>>
        }) {
    const [reviewPage, setReviewPage] = useState(1);
    const [sortReviewsBy, setSortReviewsBy] = useState<'relevance' | 'upvotes' | 'newest' | 'rating'>('relevance');
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreReviews = async () => {
        setIsLoading(true);

        try {
            const newPage = reviewPage + 1;
            const response = await fetchReviews(appId, newPage);
            setReviews(prev => [...prev, ...response.data]);
            setReviewPage(newPage);
            setHasMore(response.hasMore);
        } catch (error) {
            console.error('Failed to load more reviews', error);
        }

        setIsLoading(false);
    };

    const sortedReviews = [...reviews].sort((a, b) => {
        switch (sortReviewsBy) {
            case 'upvotes': return b.upvotes - a.upvotes;
            case 'newest': return b.timestamp - a.timestamp;
            case 'rating': return b.rating - a.rating;
            default: return (b.helpfulVotes - a.helpfulVotes) || (b.upvotes - a.upvotes);
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Reviews</h2>
                <select
                    value={sortReviewsBy}
                    onChange={(e) => setSortReviewsBy(e.target.value as any)}
                    className="px-4 py-2 border rounded-full bg-white dark:bg-gray-800 dark:text-gray-300"
                >
                    <option value="relevance">Relevance</option>
                    <option value="upvotes">Most Upvoted</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                </select>
            </div>

            {sortedReviews.map(review => (
                <ReviewItem key={review.reviewId} review={review} />
            ))}

            {/* Load More Reviews */}
            {hasMore && (
                <div className="flex justify-center">
                    <button
                        onClick={loadMoreReviews}
                        disabled={isLoading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <Loader />
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}