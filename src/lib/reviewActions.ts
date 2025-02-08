import * as z from 'zod';
import { Review } from '@/types/dapp';

export type State = {
    errors?: {
        comment?: string[],
        rating?: string[]
    },
    review?: Review | null
    message?: string | null
}


// Define your review schema with Zod.
export const reviewSchema = z.object({
    comment: z.string().min(10, 'Comment must be at least 10 characters'),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// Action function that uses the reviewSchema for validation,
// simulates a delay, and returns the new review on success.
export async function sendReview(prevState: State, formData: FormData) {
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
    const { comment, rating } = validatedFields.data;
    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newReview: Review = {
            profileUrl: 'https://picsum.photos/40',
            reviewId: `rev-${Date.now()}`,
            username: 'Current User',
            comment,
            rating,
            timestamp: Date.now(),
            upvotes: 0,
            downvotes: 0,
            helpfulVotes: 0,
            unhelpfulVotes: 0,
            voters: [],
            replies: [],
        };

        return { message: 'success', review: newReview };

    } catch {
        return { message: 'AO Error: failed to submit review.' };
    }
}