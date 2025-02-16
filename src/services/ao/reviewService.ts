import { DEFAULT_PAGE_SIZE } from "@/config";
import { Reply, Review } from "@/types/review";
import { ReviewDataGenerator } from "@/utils/dataGenerators";
import { NextResponse } from "next/server";

export interface ReviewSortParams {
    sort?: string,
    rating?: string,
    search?: string,
    page?: string,
}

// Generate test data
const generator = new ReviewDataGenerator();

// For testing a list of reviews
const testReviews = generator.generateReviews(20);
// For testing specific scenarios
// const negativeReview = generator.generateReviewWithRating(1);
// const neutralReview = generator.generateReviewWithRating(3);
// const positiveReview = generator.generateReviewWithRating(5);

export const ReviewService = {
    async getReviews(appId: string, params: ReviewSortParams, useInfiniteScroll: boolean = false): Promise<{ data: Review[], total: number }> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find the DApp by appId
        const reviews = testReviews;//.filter(review => review.appId === appId);

        // Filter the reviews based on rating
        const filteredReviews = reviews.filter(review => {
            const matchesRating = !params.rating || review.rating === parseInt(params.rating);
            return matchesRating
        });

        // Pagination
        const page = Number(params.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined


        // Sort the filtered reviews
        const sortedReviews = filteredReviews.sort((a, b) => {
            if (!params.sort || params.sort === 'latest') {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
            if (params.sort === 'mostHelpful') {
                return b.helpfulVotes - a.helpfulVotes;
            }
            return 0; // Default case if no sorting criteria matches
        });

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedReviews.slice(0, page * itemsPerPage)
            : sortedReviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        return {
            data,
            total: filteredReviews.length
        };

    },

    async submitReply(appId: string, reviewId: string, replyData: Partial<Reply>): Promise<Reply> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find the review by reviewId
        const review = testReviews.find((review: Review) => review.reviewId === reviewId);
        if (!review) {
            throw new Error('Review not found');
        }

        // Ensure replies array exists
        if (!review.replies) {
            review.replies = [];
        }
        const newReply: Reply = {
            ...replyData,
            replyId: crypto.randomUUID(),
            timestamp: Date.now(),
            upvotes: 0,
            downvotes: 0,
        }

        // Add the reply to the beginning of the replies array
        review.replies.unshift(newReply);

        // Return the updated replies array
        return newReply;
    },

    async helpfulVote(reviewId: string) {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Simulate update in dummy data
        const postIndex = testReviews.findIndex(p => p.reviewId === reviewId);

        if (postIndex === -1) {
            NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        testReviews[postIndex].helpfulVotes++;

        return NextResponse.json({ success: true });
    },

    async unhelpfulVote(reviewId: string) {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Simulate update in dummy data
        const postIndex = testReviews.findIndex(p => p.reviewId === reviewId);
        if (postIndex === -1) {
            NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        testReviews[postIndex].unhelpfulVotes++;

        return NextResponse.json({ success: true });
    },
}