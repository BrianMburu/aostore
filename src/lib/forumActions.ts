import * as z from 'zod';
import { ForumPost, updateOptions } from '@/types/forum';
import { ForumService } from '@/services/ao/forumService';
import { User } from '@/types/user';
import { Rank } from '@/types/rank';
import { Reply } from '@/types/reply';

const categories = updateOptions.map(opt => opt.value) as [string, ...string[]];

const ForumQuestionFormSchema = z.object({
    title: z.string().min(10, 'Question title must be at least 10 characters.').max(100, 'Question title must not exceed 100 characters.'),
    topic: z.enum(categories, {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: 'Please select a valid Topic Option.' };
            }
            return { message: ctx.defaultError };
        },
    }),
    description: z.string().min(10, 'Question description must be at least 10 characters.'),
});

export type ForumPostState = {
    errors?: {
        title?: string[],
        topic?: string[],
        description?: string[]
    },
    post?: ForumPost | null,
    message?: string | null
}

export async function postForumQuestion(appId: string, user: User | null, rank: Rank, prevState: ForumPostState, formData: FormData) {
    const validatedFields = ForumQuestionFormSchema.safeParse({
        title: formData.get('title'),
        topic: formData.get('topic'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Request.',
        };
    }

    if (!user) {
        return { message: 'Invalid Session: User not Found!' }
    }

    try {
        const newPost = await ForumService.createForumPost(appId, user, rank, validatedFields.data)

        return { message: "success", post: newPost }

    } catch {
        return { message: "AO Error: failed to send Support Request." }
    }
}

export async function editForumQuestion(appId: string, postId: string, rank: Rank, prevState: ForumPostState, formData: FormData) {
    const validatedFields = ForumQuestionFormSchema.safeParse({
        title: formData.get('title'),
        topic: formData.get('topic'),
        description: formData.get('description'),

    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Request.',
        };
    }

    try {

        const NewForumPost = await ForumService.editForumPost(appId, postId, rank, validatedFields.data)
        return { message: "success", post: NewForumPost }

    } catch {
        return { message: "AO Error: failed to send Support Request." }
    }
}

export type ForumReplyState = {
    errors?: {
        description?: string[],
    },
    reply?: Reply | null
    message?: string | null
}

export const replySchema = z.object({
    description: z.string().min(10, 'Answer must be at least 10 characters').max(1000, "Answer must have a max of 1000 characters"),
});

export async function sendAnswer(appId: string, postId: string, user: User | null, rank: Rank, prevState: ForumReplyState, formData: FormData) {
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
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const reply = await ForumService.submitReply(appId, postId, user, rank, validatedFields.data);

        return { message: 'success', reply: reply };

    } catch {
        return { message: 'AO Error: failed to send reply.' };
    }
}

export async function editAnswer(appId: string, postId: string, replyId: string, user: User | null, rank: Rank, prevState: ForumReplyState, formData: FormData) {
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
        const reply = await ForumService.editReply(appId, postId, replyId, user, rank, validatedFields.data);

        return { message: 'success', reply: reply };

    } catch {
        return { message: 'AO Error: failed to send reply.' };
    }
}