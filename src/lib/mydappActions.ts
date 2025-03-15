import * as z from 'zod';
import { DAppService } from '@/services/ao/dappService';
import { AppData, ProjectType, projectTypes, Protocol } from '@/types/dapp';

export type State = {
    message?: string | null;
    errors?: { [key: string]: string[] },
    dapp?: AppData
};

// Helper function to create a URL validator with custom error messages
export const createUrlSchema = (fieldName: string) => {
    return z.string().url({
        message: `Please enter a valid URL for ${fieldName}`
    }).or(z.literal('')); // Allow empty string as optional
};

// Define valid protocols
const Protocols = ["aocomputer", "arweave"] as const;


export const dappSchema = z.object({
    appName: z.string().min(3, 'Name must be at least 3 characters'),
    appIconUrl: z.string().url('Invalid URL format for App Icon URL'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    websiteUrl: z.string().url('Invalid URL format for Website URL'),
    twitterUrl: z.string().url('Invalid URL format for Twitter URL'),
    discordUrl: z.string().url('Invalid URL format for Discord URL'),
    coverUrl: z.string().url('Invalid URL format for Cover URL'),
    protocol: z.enum(Protocols, {
        errorMap: () => ({ message: 'Protocol is required' }),
    }),
    projectType: z.enum(projectTypes, {
        errorMap: () => ({ message: "Please select a valid project type" })
    }),
    companyName: z.string().min(1, 'Company Name is required'),
    bannerUrls: z.array(z.string()).nonempty('Banner URLs is required'),
});

export type FormValues = z.infer<typeof dappSchema>;

export async function createDapp(prevState: State, formData: FormData) {
    const data = {
        appName: formData.get('appName'),
        appIconUrl: formData.get('appIconUrl'),
        description: formData.get('description'),
        websiteUrl: formData.get('websiteUrl'),
        twitterUrl: formData.get('twitterUrl'),
        discordUrl: formData.get('discordUrl'),
        coverUrl: formData.get('coverUrl'),
        protocol: formData.get('protocol'),
        projectType: formData.get('projectType'),
        companyName: formData.get('companyName'),
        bannerUrls: formData.get('bannerUrls')?.toString().split(',').map(url => url.trim()),
    };

    const validatedFields = dappSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to submit DApp.',
        };
    }
    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const dapp = await DAppService.createDApp(validatedFields.data);

        return { message: 'success', dapp: dapp };

    } catch {
        return { message: 'AO Error: failed to submit DApp.' };
    }
}

export async function updateDapp(appId: string, prevState: State, formData: FormData) {
    const data = {
        appName: formData.get('appName'),
        appIconUrl: formData.get('appIconUrl'),
        description: formData.get('description'),
        websiteUrl: formData.get('websiteUrl'),
        twitterUrl: formData.get('twitterUrl'),
        discordUrl: formData.get('discordUrl'),
        coverUrl: formData.get('coverUrl'),
        protocol: formData.get('protocol'),
        projectType: formData.get('projectType'),
        companyName: formData.get('companyName'),
        bannerUrls: formData.get('bannerUrls')?.toString().split(',').map(url => url.trim()),
        updateTime: Date.now(),
    };

    const validatedFields = dappSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to save DApp.',
        };
    }
    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const dapp = await DAppService.updateDApp(appId, validatedFields.data);

        return { message: 'success', dapp: dapp };

    } catch {
        return { message: 'AO Error: failed to Save DApp.' };
    }
}

export const createTemporaryDApp = (formData: FormData): AppData => {
    const tempId = `temp-${Date.now()}`;
    const data = {
        appId: tempId,
        appName: formData.get('appName') as string,
        appIconUrl: formData.get('appIconUrl') as string,
        description: formData.get('description') as string,
        websiteUrl: formData.get('websiteUrl') as string,
        twitterUrl: formData.get('twitterUrl') as string,
        discordUrl: formData.get('discordUrl') as string,
        coverUrl: formData.get('coverUrl') as string,
        protocol: formData.get('protocol') as Protocol,
        projectType: formData.get('projectType') as ProjectType,
        companyName: formData.get('companyName') as string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bannerUrls: formData.get('bannerUrls')?.toString().split(',').map(url => url.trim()) as Record<string, any>,
    };

    return {
        ...data,
        company: data.companyName,
        ratings: 0,
        createdTime: Date.now(),
        downvotes: {},
        upvotes: {},
        reviews: [],
        totalRatings: 0
    };
};