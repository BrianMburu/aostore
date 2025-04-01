import * as z from 'zod';
import { Message, messageTypes } from '@/types/message';
import { aoMessageService } from '@/services/ao/messageService';

const categories = messageTypes.map(opt => opt.value) as [string, ...string[]];

const ForumQuestionFormSchema = z.object({
    title: z.string().min(10, 'Question title must be at least 10 characters.').max(100, 'Question title must not exceed 100 characters.'),
    messageType: z.enum(categories, {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: 'Please select a valid Topic Option.' };
            }
            return { message: ctx.defaultError };
        },
    }),
    message: z.string().min(10, 'Question description must be at least 10 characters.'),
    link: z.preprocess(
        (val) => {
            // Convert empty strings to undefined – so that the validation
            // for URL will only run if there is an actual value.
            if (typeof val === "string" && val.trim() === "") {
                return undefined;
            }
            return val;
        },
        z.string().url({ message: "Enter a valid URL" }).optional()
    ),
})

export type MessageState = {
    errors?: {
        title?: string[],
        messageType?: string[],
        message?: string[],
        link?: string[]
    },
    messageData?: Message | null,
    message?: string | null
}

export async function sendMessage(appId: string, prevState: MessageState, formData: FormData) {
    const validatedFields = ForumQuestionFormSchema.safeParse({
        title: formData.get('title'),
        messageType: formData.get('messageType'),
        message: formData.get('message'),
        link: formData.get('link'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Message.',
        };
    }

    try {
        await aoMessageService.sendMessage(appId, validatedFields.data);

        return { message: "success" }

    } catch (error) {
        return { message: `AO Error: failed to send Message. ${error}` }
    }
}