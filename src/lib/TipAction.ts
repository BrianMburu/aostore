import { DAppService } from "@/services/ao/dappService";
import { Tip } from "@/types/tip";
import { UserDetails } from "@othent/kms";
import { z } from "zod";

export type TipState = {
    errors?: {
        amount?: string[],
    },
    tip?: Tip | null
    message?: string | null
}

export const tipSchema = z.object({
    amount: z.number().gt(0, 'Tip amount must be greater than 0'),
});

export async function sendTip(tokenId: string | null, recipientWallet: string, user: UserDetails | null, prevState: TipState, formData: FormData) {
    const validatedFields = tipSchema.safeParse({
        amount: Number(formData.get('amount')),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to send Tip.',
        };
    }

    if (!tokenId) {
        return {
            message: 'Invalid tokenId selected!',
        };
    }

    if (!user) {
        return {
            message: 'Invalid session. User not found!',
        };
    }

    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const tipData: Tip = {
            ...validatedFields.data,
            senderWallet: user.walletAddress,
            recipientWallet,
            tokenId,

        }

        const newTip = await DAppService.tip(tipData);

        return { message: 'success', tip: newTip };

    } catch {
        return { message: 'AO Error: failed to send tip.' };
    }
}