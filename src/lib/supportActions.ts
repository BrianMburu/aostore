import z from 'zod';

const SupportFormSchema = z.object({
    request: z.enum(['bug', 'feature'], {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: 'Please select a valid request type.' };
            }
            return { message: ctx.defaultError };
        },
    }),
    message: z.string().min(10, 'Message must be at least 10 characters.'),
});


export type State = {
    errors?: {
        request?: string[],
        message?: string[]
    },
    message?: string | null
}



export async function sendSupportRequest(prevState: State, formData: FormData) {
    const validatedFields = SupportFormSchema.safeParse({
        request: formData.get('request'),
        message: formData.get('message')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has Errors. Failed to Send Request.',
        };
    }

    const { request, message } = validatedFields.data;


    try {
        // To Do add functionality to send request to backend
        console.log('Data:', { request, message })
        await new Promise(resolve => setTimeout(resolve, 1000));

        return { message: "success" }

    } catch {
        return { message: "AO Error: failed to send Support Request." }
    }
}