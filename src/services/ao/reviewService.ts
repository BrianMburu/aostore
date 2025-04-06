import { PROCESS_ID_REVIEW_TABLE } from "@/config/ao";
import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { Rank } from "@/types/rank";
import { Reply } from "@/types/reply";
import { Review } from "@/types/review";
import { Tip } from "@/types/tip";
import { User } from "@/types/user";
import { HelpfulData } from "@/types/voter";
import { cleanAoJson, fetchAOmessages } from "@/utils/ao";
export interface ReviewFilterParams {
    sort?: string,
    rating?: string,
    search?: string,
    page?: string,
}

export const ReviewService = {
    async getReviews(appId: string, params: ReviewFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: Review[], total: number }> {
        let reviews: Review[] = [];

        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchAppReviews" },
                { name: "appId", value: appId }

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Review Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                reviews = Object.values(messageData.data);
                // console.log("Reviews: => ", reviews)
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get App Reviews, ${error}`)
        }

        // Filter the reviews based on rating
        const filteredReviews = reviews.filter(review => {
            const matchesRating = !params.rating || review.rating === parseInt(params.rating);
            return matchesRating
        });

        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined


        // Sort the filtered reviews
        const sortedReviews = filteredReviews.sort((a, b) => {
            if (!params.sort || params.sort === 'latest') {
                return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
            }
            if (params.sort === 'mostHelpful') {
                return b.voters.foundHelpful.count - a.voters.foundHelpful.count;
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

    async createReview(appId: string, user: User, rank: Rank, reviewData: { rating: number, description: string }): Promise<Review> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddReviewAppX" },
                { name: "appId", value: appId },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "rank", value: rank.rank },
                { name: "description", value: reviewData.description },
                { name: "rating", value: reviewData.rating.toString() },

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Review Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const featureRequest: Review = messageData.data;
                return featureRequest;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to send Review Data, ${error}`)
        }
    },

    async updateReview(appId: string, reviewId: string, rank: Rank, reviewData: { rating: number, description: string }): Promise<Review> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "EditReview" },
                { name: "appId", value: appId },
                { name: "reviewId", value: reviewId },
                { name: "description", value: reviewData.description },
                { name: "rank", value: rank.rank },
                { name: "rating", value: reviewData.rating.toString() },

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Review Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const featureRequest: Review = messageData.data;
                return featureRequest;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to edit Review Data, ${error}`)
        }
    },

    async submitReply(appId: string, reviewId: string, user: User, rank: Rank, replyData: { description: string }): Promise<Reply> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddReviewReply" },
                { name: "appId", value: appId },
                { name: "reviewId", value: reviewId },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "description", value: replyData.description },
                { name: "rank", value: rank.rank },

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Review reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: Reply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to add review reply, ${error}`)
        }
    },

    async updateReply(appId: string, reviewId: string, replyId: string, rank: Rank, replyData: { description: string }): Promise<Reply> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "EditReviewReply" },
                { name: "appId", value: appId },
                { name: "reviewId", value: reviewId },
                { name: "replyId", value: replyId },
                { name: "description", value: replyData.description },
                { name: "rank", value: rank.rank },

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Review reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: Reply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to add review reply, ${error}`)
        }
    },

    async helpfulVote(appId: string, reviewId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkHelpfulReview" },
                { name: "appId", value: appId },
                { name: "reviewId", value: reviewId },

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Review helpful Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const helpfulData: HelpfulData = messageData.data;
                return helpfulData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to vote review as helpful, ${error}`)
        }
    },

    async unhelpfulVote(appId: string, reviewId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkUnHelpfulReview" },
                { name: "appId", value: appId },
                { name: "reviewId", value: reviewId },

            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Review helpful Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const helpfulData: HelpfulData = messageData.data;
                return helpfulData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to vote review as helpful, ${error}`)
        }
    },

    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },
}