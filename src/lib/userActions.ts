import * as z from 'zod';
import { User } from '@/types/user';
import { UserService } from '@/services/ao/UserService';

export type UserState = {
    errors?: {
        username?: string[],
        avatar?: string[]
    },
    user?: User | null
    message?: string | null
}


// Define your review schema with Zod.
export const userSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(20, "Username must have a max of 20 characters"),
    avatar: z.string().url('Invalid URL format for avatar URL').optional(),
});

export type ReviewFormData = z.infer<typeof userSchema>;

// Action function that uses the reviewSchema for validation,
// simulates a delay, and returns the new review on success.
export async function createUser(walletAddress: string, prevState: UserState, formData: FormData) {
    const validatedFields = userSchema.safeParse({
        username: formData.get('username'),
        avatar: formData.get('avatar'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to submit review.',
        };
    }

    const userData: User = {
        ...validatedFields.data,
        walletAddress: walletAddress,
    }

    try {
        const newUser = await UserService.addUser(userData);

        return { message: 'success', user: newUser };

    } catch {
        return { message: 'AO Error: failed to submit review.' };
    }
}

export async function updateUser(prevState: UserState, formData: FormData) {
    const validatedFields = userSchema.safeParse({
        username: formData.get('username'),
        avatar: formData.get('avatar'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to update review.',
        };
    }

    try {
        const updatedUser = await UserService.updateUser(validatedFields.data);

        return { message: 'success', user: updatedUser };

    } catch {
        return { message: 'AO Error: failed to update review.' };
    }
}