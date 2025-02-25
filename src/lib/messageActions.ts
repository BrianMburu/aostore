import * as z from 'zod';
import { Message, MessageType, messageTypes } from '@/types/message';
import { aoMessageService } from '@/services/ao/messageService';

const categories = messageTypes.map(opt => opt.value) as [MessageType, ...MessageType[]];

const ForumQuestionFormSchema = z.object({
    title: z.string().min(10, 'Question title must be at least 10 characters.').max(100, 'Question title must not exceed 100 characters.'),
    type: z.enum(categories, {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: 'Please select a valid Topic Option.' };
            }
            return { message: ctx.defaultError };
        },
    }),
    content: z.string().min(10, 'Question description must be at least 10 characters.'),
})

export type MessageState = {
    errors?: {
        title?: string[],
        type?: string[],
        content?: string[]
    },
    messageData?: Message | null,
    message?: string | null
}

export async function sendMessage(appId: string, prevState: MessageState, formData: FormData) {
    const validatedFields = ForumQuestionFormSchema.safeParse({
        title: formData.get('title'),
        type: formData.get('type'),
        content: formData.get('content'),

    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Message.',
        };
    }

    const messageData = validatedFields.data;

    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const newMessage = await aoMessageService.sendMessage(appId, messageData);

        return { message: "success", messageData: newMessage }

    } catch (error) {
        return { message: `AO Error: failed to send Message. ${error}` }
    }
}

export async function editMessage(messageId: string, prevState: MessageState, formData: FormData) {
    const validatedFields = ForumQuestionFormSchema.safeParse({
        title: formData.get('title'),
        type: formData.get('type'),
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Edit Message.',
        };
    }

    const messageData = validatedFields.data;

    try {
        // To Do add functionality to send request to backend
        await new Promise(resolve => setTimeout(resolve, 100));

        const newMessage = await aoMessageService.editMessage(messageId, messageData);

        return { message: "success", messageData: newMessage }

    } catch (error) {
        return { message: `AO Error: failed to edit Message. ${error}` }
    }
}