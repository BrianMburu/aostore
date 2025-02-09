import * as z from 'zod';
import { ForumPost, updateOptions } from '@/types/forum';

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

export type State = {
    errors?: {
        title?: string[],
        topic?: string[],
        content?: string[]
    },
    post?: ForumPost | null,
    message?: string | null
}

export async function postForumQuestion(userId: string, prevState: State, formData: FormData) {
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
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newPost: ForumPost = {
            postId: `post-${Date.now()}`,
            title: title,
            content: content,
            topic: topic,
            author: userId,
            likes: 0,
            replies: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        return { message: "success", post: newPost }

    } catch {
        return { message: "AO Error: failed to send Support Request." }
    }
}