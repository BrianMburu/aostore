import { TokenService } from "@/services/ao/tokenService";
import { AppTokenData } from "@/types/dapp";
import { Tip } from "@/types/tip";
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

export async function sendTip(appId: string, tipId: string, userBalance: number, tokenData: AppTokenData | null, recipientWallet: string, prevState: TipState, formData: FormData) {
    if (!tokenData) {
        return {
            message: 'Invalid tokenId selected!',
        };
    }

    const validatedFields = tipSchema.safeParse({
        amount: Number(formData.get('amount')),
    });

    if (!recipientWallet) {
        return {
            message: 'Invalid recipient wallet address!',
        };
    }

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to send Tip.',
        };
    }

    try {
        const { amount } = validatedFields.data;

        const realAmount = amount * Number(tokenData.tokenDenomination);

        // Check if the amount is valid
        if (realAmount > userBalance * Number(tokenData.tokenDenomination)) {
            return {
                errors: { amount: [`You have only ${userBalance} ${tokenData.tokenTicker} Tokens`] },
                message: 'Form has errors. Failed to Tip.',
            };
        }

        // Check if the recipient wallet is valid
        if (!recipientWallet) {
            return {
                errors: { amount: ['Invalid recipient wallet address'] },
                message: 'Form has errors. Failed to Tip.',
            };
        }

        // Transfer Token
        await TokenService.transferToken(tokenData.tokenId, recipientWallet, amount * Number(tokenData.tokenDenomination));

        // Save Token
        await TokenService.saveTipTransaction(appId, recipientWallet, tipId, amount);

        return { message: 'success' };

    } catch {
        return { message: 'AO Error: failed to send tip.' };
    }
}