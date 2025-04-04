import * as z from 'zod';
import { Review } from '@/types/review';
import { ReviewService } from '@/services/ao/reviewService';
import { Rank } from '@/types/rank';
import { User } from '@/types/user';
import { Reply } from '@/types/reply';

export type ReviewState = {
    errors?: {
        description?: string[],
        rating?: string[]
    },
    review?: Review | null
    message?: string | null
}


// Define your review schema with Zod.
export const reviewSchema = z.object({
    description: z.string().min(10, 'Comment description must be at least 10 characters').max(1000, "Comment description must have a max of 1000 characters"),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// Action function that uses the reviewSchema for validation,
// simulates a delay, and returns the new review on success.
export async function sendReview(appId: string, user: User | null, rank: Rank, prevState: ReviewState, formData: FormData) {
    const validatedFields = reviewSchema.safeParse({
        description: formData.get('description'),
        rating: Number(formData.get('rating')),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to submit review.',
        };
    }

    try {
        if (!user) {
            return { message: 'Invalid Session: User not Found!' }
        }

        const newReview = await ReviewService.createReview(appId, user, rank, validatedFields.data);

        return { message: 'success', review: newReview };

    } catch {
        return { message: 'AO Error: failed to submit review.' };
    }
}

export async function updateReview(appId: string, reviewId: string, rank: Rank, prevState: ReviewState, formData: FormData) {
    const validatedFields = reviewSchema.safeParse({
        description: formData.get('description'),
        rating: Number(formData.get('rating')),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to update review.',
        };
    }

    try {
        const updatedReview = await ReviewService.updateReview(appId, reviewId, rank, validatedFields.data);

        return { message: 'success', review: updatedReview };

    } catch {
        return { message: 'AO Error: failed to update review.' };
    }
}

export type ReplyState = {
    errors?: {
        description?: string[],
    },
    reply?: Reply | null
    message?: string | null
}

export const replySchema = z.object({
    description: z.string().min(10, 'Comment must be at least 10 characters').max(500, "Comment must have a max of 500 characters"),
});

export async function sendReply(appId: string, reviewId: string, user: User | null, rank: Rank, prevState: ReplyState, formData: FormData) {
    const validatedFields = replySchema.safeParse({
        description: formData.get('description'),
    });

    if (!user) {
        return { message: 'Invalid Session: User not Found!' }
    }

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to send reply.',
        };
    }

    try {
        const reply = await ReviewService.submitReply(appId, reviewId, user, rank, validatedFields.data);

        return { message: 'success', reply: reply };

    } catch {
        return { message: 'AO Error: failed to send reply.' };
    }
}

export async function updateReply(appId: string, reviewId: string, replyId: string, rank: Rank, prevState: ReplyState, formData: FormData) {
    const validatedFields = replySchema.safeParse({
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to send reply.',
        };
    }

    try {
        const reply = await ReviewService.updateReply(appId, reviewId, replyId, rank, validatedFields.data);

        return { message: 'success', reply: reply };

    } catch (error) {
        console.error(error);

        return { message: 'AO Error: failed to send reply.' };
    }
}