import { DEFAULT_PAGE_SIZE } from "@/config";
import { Reply, Review } from "@/types/review";
import { Tip } from "@/types/tip";
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

    async createReview(appId: string, reviewData: Partial<Review>): Promise<Review> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const newReview = {
            ...reviewData,
            profileUrl: 'https://picsum.photos/40',
            reviewId: `rev-${Date.now()}`,
            timestamp: Date.now(),
            upvotes: 0,
            downvotes: 0,
            helpfulVotes: 0,
            unhelpfulVotes: 0,
            voters: [],
            replies: [],
        } as Review;

        testReviews.unshift(newReview);
        // Return the updated review array
        return newReview;
    },

    async updateReview(reviewId: string, reviewData: Partial<Review>): Promise<Review> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate update in dummy data
        const postIndex = testReviews.findIndex(p => p.reviewId === reviewId);

        testReviews[postIndex] = {
            ...testReviews[postIndex],
            ...reviewData
        };

        // Return the updated review array
        return testReviews[postIndex];
    },

    async submitReply(reviewId: string, replyData: Partial<Reply>): Promise<Reply> {
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
        const newReply = {
            ...replyData,
            replyId: crypto.randomUUID(),
            timestamp: Date.now(),
            upvotes: 0,
            downvotes: 0,
        } as Reply;

        // Add the reply to the beginning of the replies array
        review.replies.unshift(newReply);

        // Return the updated replies array
        return newReply;
    },

    async updateReply(replyId: string, replyData: Partial<Reply>): Promise<Reply> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Test Review
        const testReviewId = "review-5"

        // Find the review by reviewId
        const review = testReviews.find((review: Review) => review.reviewId === testReviewId);
        if (!review) {
            throw new Error('Review not found');
        }

        // Ensure replies array exists
        if (!review.replies) {
            review.replies = [];
        }
        // Simulate update in dummy data
        const replyIndex = testReviews.findIndex(p => p.reviewId === replyData.replyId);


        // Add the reply to the beginning of the replies array
        review.replies[replyIndex] = replyData as Reply;

        // Return the updated replies array
        return review.replies[replyIndex];
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
    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },
}