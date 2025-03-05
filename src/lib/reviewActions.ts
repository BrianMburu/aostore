import * as z from 'zod';
import { Reply, Review } from '@/types/review';
import { User } from '@/types/user';
import { ReviewService } from '@/services/ao/reviewService';

export type ReviewState = {
    errors?: {
        comment?: string[],
        rating?: string[]
    },
    review?: Review | null
    message?: string | null
}


// Define your review schema with Zod.
export const reviewSchema = z.object({
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, "Comment must have a max of 1000 characters"),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// Action function that uses the reviewSchema for validation,
// simulates a delay, and returns the new review on success.
export async function sendReview(appId: string, user: User | null, prevState: ReviewState, formData: FormData) {
    const validatedFields = reviewSchema.safeParse({
        comment: formData.get('comment'),
        rating: Number(formData.get('rating')),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to submit review.',
        };
    }

    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!user) {
            return { message: 'Invalid Session: User not Found!' }
        }

        const reviewData: Partial<Review> = {
            ...validatedFields.data,
            userId: user.walletAddress,
            profileUrl: 'https://picsum.photos/40',
            username: user.username
        };

        const newReview = await ReviewService.createReview(appId, reviewData);

        return { message: 'success', review: newReview };

    } catch {
        return { message: 'AO Error: failed to submit review.' };
    }
}

export async function updateReview(reviewId: string, prevState: ReviewState, formData: FormData) {
    const validatedFields = reviewSchema.safeParse({
        comment: formData.get('comment'),
        rating: Number(formData.get('rating')),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to update review.',
        };
    }

    const UpdatedReviewData = validatedFields.data;

    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const updatedReviewData = {
            ...UpdatedReviewData
        };

        const updatedReview = await ReviewService.updateReview(reviewId, updatedReviewData);

        return { message: 'success', review: updatedReview };

    } catch {
        return { message: 'AO Error: failed to update review.' };
    }
}

export type ReplyState = {
    errors?: {
        comment?: string[],
    },
    reply?: Reply | null
    message?: string | null
}

export const replySchema = z.object({
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, "Comment must have a max of 500 characters"),
});

export async function sendReply(reviewId: string, user: User, prevState: ReplyState, formData: FormData) {
    const validatedFields = replySchema.safeParse({
        comment: formData.get('comment'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to send reply.',
        };
    }

    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const replyData: Partial<Reply> = {
            ...validatedFields.data,
            profileUrl: user.avatar,
            user: user.walletAddress,
            username: user.username
        }

        const reply = await ReviewService.submitReply(reviewId, replyData);

        return { message: 'success', reply: reply };

    } catch {
        return { message: 'AO Error: failed to send reply.' };
    }
}

export async function updateReply(replyId: string, prevState: ReplyState, formData: FormData) {
    const validatedFields = replySchema.safeParse({
        comment: formData.get('comment'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to send reply.',
        };
    }

    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const reply = await ReviewService.updateReply(replyId, validatedFields.data);

        return { message: 'success', reply: reply };

    } catch (error) {
        console.log(error);

        return { message: 'AO Error: failed to send reply.' };
    }
}