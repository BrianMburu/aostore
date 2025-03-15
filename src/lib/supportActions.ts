import { SupportService } from '@/services/ao/supportServices';
import { BugReport, FeatureRequest } from '@/types/support';
import { UserDetails } from '@othent/kms';
import * as z from 'zod';

const SupportFormSchema = z.object({
    type: z.enum(['bug', 'feature'], {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: 'Please select a valid request type.' };
            }
            return { message: ctx.defaultError };
        },
    }),
    title: z.string().min(10, 'Title must be at least 10 characters.').max(100, 'Title must not exceed 100 characters.'),

    description: z.string().min(10, 'Description must be at least 10 characters.'),
});


export type FeatureRequestState = {
    errors?: {
        type?: string[],
        title?: string[],
        description?: string[]
    },
    message?: string | null,
    request?: FeatureRequest | BugReport | null
}

export async function sendSupportRequest(appId: string, user: UserDetails | null, prevState: FeatureRequestState, formData: FormData) {
    const validatedFields = SupportFormSchema.safeParse({
        type: formData.get('type'),
        title: formData.get('title'),
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Request.',
        };
    }

    try {
        // To Do add functionality to send request to backend
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!user) {
            return { message: 'Invalid Session: User not Found!' }
        }

        const newRequest = await SupportService.createFeatureRequest(appId, user.walletAddress, validatedFields.data)

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to send Support Request." }
    }
}

export async function updateSupportRequest(requestid: string, prevState: FeatureRequestState, formData: FormData) {
    const validatedFields = SupportFormSchema.safeParse({
        type: formData.get('type'),
        title: formData.get('title'),
        description: formData.get('description')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Request.',
        };
    }

    try {
        const updatedRequest = await SupportService.updateFeatureRequests(requestid, validatedFields.data)
        return { message: "success", request: updatedRequest }

    } catch {
        return { message: "AO Error: failed to send Support Request." }
    }
}