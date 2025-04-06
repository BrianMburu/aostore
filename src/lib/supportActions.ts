import { SupportService } from '@/services/ao/supportServices';
import { Rank } from '@/types/rank';
import { Reply } from '@/types/reply';
import { BugReport, FeatureRequest } from '@/types/support';
import { User } from '@/types/user';
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

// export async function sendSupportRequest(appId: string, user: UserDetails | null, prevState: FeatureRequestState, formData: FormData) {
//     const validatedFields = SupportFormSchema.safeParse({
//         type: formData.get('type'),
//         title: formData.get('title'),
//         description: formData.get('description')
//     })

//     if (!validatedFields.success) {
//         return {
//             errors: validatedFields.error.flatten().fieldErrors,
//             message: 'Form has Errors. Failed to Send Request.',
//         };
//     }

//     try {
//         // To Do add functionality to send request to backend
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         if (!user) {
//             return { message: 'Invalid Session: User not Found!' }
//         }

//         const newRequest = await SupportService.createFeatureRequest(appId, user.walletAddress, validatedFields.data)

//         return { message: "success", request: newRequest }

//     } catch {
//         return { message: "AO Error: failed to send Support Request." }
//     }
// }

export async function sendFeatureRequest(appId: string, user: User | null, rank: Rank, prevState: FeatureRequestState, formData: FormData) {
    const validatedFields = SupportFormSchema.safeParse({
        type: formData.get('type'),
        title: formData.get('title'),
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Feature Request.',
        };
    }

    try {
        if (!user) {
            return { message: 'Invalid Session: User not Found!' }
        }

        const newRequest = await SupportService.createFeatureRequest(appId, user, rank, validatedFields.data);

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to send Feature Request." }
    }
}

export async function sendBugReport(appId: string, user: User | null, rank: Rank, prevState: FeatureRequestState, formData: FormData) {
    const validatedFields = SupportFormSchema.safeParse({
        type: formData.get('type'),
        title: formData.get('title'),
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Bug Report.',
        };
    }

    try {
        if (!user) {
            return { message: 'Invalid Session: User not Found!' }
        }

        const newRequest = await SupportService.createBugReport(appId, user, rank, validatedFields.data);

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to send Bug Report." }
    }
}

// export async function updateSupportRequest(requestid: string, prevState: FeatureRequestState, formData: FormData) {
//     const validatedFields = SupportFormSchema.safeParse({
//         type: formData.get('type'),
//         title: formData.get('title'),
//         description: formData.get('description')
//     })
//     if (!validatedFields.success) {
//         return {
//             errors: validatedFields.error.flatten().fieldErrors,
//             message: 'Form has Errors. Failed to Send Request.',
//         };
//     }

//     try {
//         const updatedRequest = await SupportService.updateFeatureRequests(requestid, validatedFields.data)
//         return { message: "success", request: updatedRequest }

//     } catch {
//         return { message: "AO Error: failed to send Support Request." }
//     }
// }

export async function editFeatureRequest(appId: string, requestId: string, rank: Rank, prevState: FeatureRequestState, formData: FormData) {
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
        const newRequest = await SupportService.updateFeatureRequest(appId, requestId, rank, validatedFields.data);

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to update FeatureRequest." }
    }
}

export async function editBugReport(appId: string, requestId: string, rank: Rank, prevState: FeatureRequestState, formData: FormData) {
    const validatedFields = SupportFormSchema.safeParse({
        type: formData.get('type'),
        title: formData.get('title'),
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Bug Report.',
        };
    }

    try {
        const newRequest = await SupportService.updateBugReport(appId, requestId, rank, validatedFields.data);

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to edit Bug Report." }
    }
}

const SupportReplyFormSchema = z.object({
    description: z.string().min(10, 'Description must be at least 10 characters.'),
});
export type FeatureRequestReplyState = {
    errors?: {
        description?: string[]
    },
    message?: string | null,
    request?: Reply | null
}

export async function sendFeatureRequestReply(appId: string, requestId: string, user: User | null, rank: Rank, prevState: FeatureRequestReplyState, formData: FormData) {
    const validatedFields = SupportReplyFormSchema.safeParse({
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Feature Request.',
        };
    }

    try {
        if (!user) {
            return { message: 'Invalid Session: User not Found!' }
        }

        const newRequest = await SupportService.replyToFeatureRequest(appId, requestId, user, rank, validatedFields.data);

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to send Feature Request." }
    }
}

export async function sendBugReportReply(appId: string, requestId: string, user: User | null, rank: Rank, prevState: FeatureRequestReplyState, formData: FormData) {
    const validatedFields = SupportReplyFormSchema.safeParse({
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to send Bug Report.',
        };
    }

    try {
        if (!user) {
            return { message: 'Invalid Session: User not Found!' }
        }

        const newRequest = await SupportService.replyToBugReport(appId, requestId, user, rank, validatedFields.data);

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to send Bug Report." }
    }
}

export async function editFeatureRequestReply(appId: string, requestId: string, replyId: string, prevState: FeatureRequestReplyState, formData: FormData) {
    const validatedFields = SupportReplyFormSchema.safeParse({
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Feature Request.',
        };
    }

    try {
        const newRequest = await SupportService.editFeatureRequestReply(appId, requestId, replyId, validatedFields.data);

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to edit Feature Request reply." }
    }
}

export async function editBugReportReply(appId: string, requestId: string, replyId: string, prevState: FeatureRequestReplyState, formData: FormData) {
    const validatedFields = SupportReplyFormSchema.safeParse({
        description: formData.get('description')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Bug Report.',
        };
    }

    try {
        const newRequest = await SupportService.editBugReportReply(appId, requestId, replyId, validatedFields.data);

        return { message: "success", request: newRequest }

    } catch {
        return { message: "AO Error: failed to edit Bug Report." }
    }
}

