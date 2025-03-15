import * as z from 'zod';
import { ForumPost, ForumReply, updateOptions } from '@/types/forum';
import { ForumService } from '@/services/ao/forumService';

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
    content: z.string().min(10, 'Question description must be at least 10 characters.'),
})

export type ForumPostState = {
    errors?: {
        title?: string[],
        topic?: string[],
        content?: string[]
    },
    post?: ForumPost | null,
    message?: string | null
}

export async function postForumQuestion(appId: string, userId: string | null, prevState: ForumPostState, formData: FormData) {
    const validatedFields = ForumQuestionFormSchema.safeParse({
        title: formData.get('title'),
        topic: formData.get('topic'),
        content: formData.get('content'),

    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Request.',
        };
    }

    if (!userId) {
        return { message: 'Invalid Session: User not Found!' }
    }

    try {
        const newPost = await ForumService.createForumPost(appId, userId, validatedFields.data)

        return { message: "success", post: newPost }

    } catch {
        return { message: "AO Error: failed to send Support Request." }
    }
}

export async function editForumQuestion(postId: string, prevState: ForumPostState, formData: FormData) {
    const validatedFields = ForumQuestionFormSchema.safeParse({
        title: formData.get('title'),
        topic: formData.get('topic'),
        content: formData.get('content'),

    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Request.',
        };
    }

    const { title, topic, content } = validatedFields.data;


    try {
        // To Do add functionality to send request to backend
        console.log('Data:', { title, topic, content })

        const NewForumPost = await ForumService.editForumPost(postId, validatedFields.data)
        return { message: "success", post: NewForumPost }

    } catch {
        return { message: "AO Error: failed to send Support Request." }
    }
}

export type ForumReplyState = {
    errors?: {
        content?: string[],
    },
    reply?: ForumReply | null
    message?: string | null
}

export const replySchema = z.object({
    content: z.string().min(10, 'Answer must be at least 10 characters').max(1000, "Answer must have a max of 1000 characters"),
});

export async function sendAnswer(postId: string, userId: string | null, prevState: ForumReplyState, formData: FormData) {
    const validatedFields = replySchema.safeParse({
        content: formData.get('content'),
    });

    if (!userId) {
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

        const reply = await ForumService.submitReply(postId, userId, validatedFields.data);

        return { message: 'success', reply: reply };

    } catch {
        return { message: 'AO Error: failed to send reply.' };
    }
}

export async function editAnswer(replyId: string, prevState: ForumReplyState, formData: FormData) {
    const validatedFields = replySchema.safeParse({
        content: formData.get('content'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to send reply.',
        };
    }

    try {
        const reply = await ForumService.editReply(replyId, validatedFields.data);

        return { message: 'success', reply: reply };

    } catch {
        return { message: 'AO Error: failed to send reply.' };
    }
}