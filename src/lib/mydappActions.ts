import * as z from 'zod';
import { DAppService } from '@/services/ao/dappService';
import { AppTokenData, CreateDapp, Dapp, projectTypes } from '@/types/dapp';
import { User } from '@/types/user';
import { calculateDenominationAmount, normalizeArweaveLogo } from '@/utils/ao';
import { TokenService } from '@/services/ao/tokenService';

export type DappState = {
    message?: string | null;
    errors?: { [key: string]: string[] },
    dapp?: Dapp
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
    appName: z.string().min(2, 'Name must be at least 2 characters'),
    appIconUrl: z.string().url('Invalid URL format for App Icon URL'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    websiteUrl: z.string().min(1, 'Website Url is required').url('Invalid URL format for Website URL'),
    twitterUrl: z.string().min(1, 'Twitter Url is required'),//.url('Invalid URL format for Twitter URL'),
    discordUrl: z.string().min(1, 'Discord Url is required'),//.url('Invalid URL format for Discord URL'),
    coverUrl: z.string().min(1, 'Cover Url is required').url('Invalid URL format for Cover URL'),
    protocol: z.enum(Protocols, {
        errorMap: () => ({ message: 'Protocol is required' }),
    }),
    projectType: z.enum(projectTypes, {
        errorMap: () => ({ message: "Please select a valid project type" })
    }),
    companyName: z.string().min(1, 'Company Name is required'),
    bannerUrls: z.array(z.string().url('Invalid URL format for Banner URL')).nonempty('Banner URLs is required'),
});

export type FormValues = z.infer<typeof dappSchema>;

export async function createDapp(user: User | null, prevState: DappState, formData: FormData) {
    if (!user) {
        return { message: 'Invalid Session: User not Found!' }
    }

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
        const dappData: CreateDapp = {
            ...validatedFields.data,
            username: user.username,
            profileUrl: user.avatar || ""
        }

        await DAppService.createDApp(dappData);

        return { message: 'success' };

    } catch {
        return { message: 'AO Error: failed to submit DApp.' };
    }
}

export async function updateDapp(appId: string, user: User, prevState: DappState, formData: FormData) {
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
        const dappData: CreateDapp = {
            ...validatedFields.data,
            username: user.username,
            profileUrl: user.avatar || "",
        }

        const dapp = await DAppService.updateDApp(appId, dappData);

        return { message: 'success', dapp: dapp };

    } catch {
        return { message: 'AO Error: failed to Update DApp.' };
    }
}

export type DappTokenState = {
    message?: string | null;
    errors?: { [key: string]: string[] },
    dappToken?: AppTokenData
};

export const dappTokenSchema = z.object({
    tokenId: z.string().min(1, "Token ID is required").max(50, 'Id must have a maximum of 50 characters'),
    tokenName: z.string().min(3, 'Name must be at least 3 characters'),
    tokenTicker: z.string().min(3, 'Ticker must be at least 3 characters'),
    tokenDenomination: z.number().min(1, 'Denomination must be at least 1'),
    logo: z.string().min(1, 'Logo ID is required').url('Invalid URL, only enter the logo ID.'),
})

export async function addDappToken(appId: string, prevState: DappTokenState, formData: FormData) {
    const data = {
        tokenId: formData.get('tokenId') as string,
        tokenName: formData.get('tokenName') as string,
        tokenTicker: formData.get('tokenTicker') as string,
        tokenDenomination: calculateDenominationAmount(Number(formData.get('tokenDenomination'))),
        logo: normalizeArweaveLogo(formData.get('logo') as string)
    }

    const validatedFields = dappTokenSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to add DApp Token.',
        };
    }
    try {
        const dappToken = await TokenService.addDappToken(appId, validatedFields.data);

        return { message: 'success', dappToken: dappToken };

    } catch (error) {
        return { message: `AO Error: failed to add DApp Token. ${error}` };
    }

}

export type DappChangeOwnerState = {
    message?: string | null;
    errors?: { [key: string]: string[] },
    newOwnerId?: string
};

export const dappChangeOwnerSchema = z.object({
    newOwnerId: z.string().min(1, "New Owner ID is required").max(50, 'Id must have a maximum of 50 characters')
})

export async function changeDappOwner(appId: string, prevState: DappChangeOwnerState, formData: FormData) {
    const data = {
        newOwnerId: formData.get('newOwnerId') as string,
    }

    const validatedFields = dappChangeOwnerSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to change DApp Owner.',
        };
    }

    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newOwnerId = validatedFields.data.newOwnerId

        await DAppService.changeDappOwner(appId, newOwnerId);

        return { message: 'success', newOwnerId: validatedFields.data.newOwnerId };

    } catch (error) {
        return { message: `AO Error: failed to add DApp Token. ${error}` };
    }

}

export type DappModeratorState = {
    message?: string | null;
    errors?: { [key: string]: string[] },
    mods?: string[]
};

export const dappAddModsSchema = z.object({
    mods: z.array(z.string().min(8, "Minimum 8 characters")).nonempty('Atleast one mod is required')
});

export async function addModerators(appId: string, accessPage: string, prevState: DappModeratorState, formData: FormData) {
    const data = {
        mods: formData.get('mods')?.toString().split(',').map(url => url.trim()),
    }

    const validatedFields = dappAddModsSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to change add moderators.',
        };
    }

    try {
        const mods = validatedFields.data.mods

        const newMods = await DAppService.addMods(appId, mods, accessPage);

        return { message: 'success', mods: newMods };

    } catch (error) {
        return { message: `AO Error: failed to add Moderator. ${error}` };
    }

}

export const dappDeleteModsSchema = z.object({
    modId: z.string().min(8, "Minimum 8 characters")
});

export async function deleteModerator(appId: string, accessPage: string, prevState: DappModeratorState, formData: FormData) {
    const data = {
        modId: formData.get('modId'),
    }

    const validatedFields = dappDeleteModsSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to Delete Moderator.',
        };
    }

    try {
        const modId = validatedFields.data.modId

        await DAppService.removeMod(appId, modId, accessPage);

        return { message: 'success' };

    } catch (error) {
        return { message: `AO Error: failed to add Delete moderator. ${error}` };
    }

}