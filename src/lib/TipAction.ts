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

export async function sendTip(userBalance: number, tokenData: AppTokenData | null, recipientWallet: string, prevState: TipState, formData: FormData) {
    if (!tokenData) {
        return {
            message: 'Invalid tokenId selected!',
        };
    }

    const validatedFields = tipSchema.safeParse({
        amount: Number(formData.get('amount')) * Number(tokenData.tokenDenomination),
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

        if (amount > userBalance * Number(tokenData.tokenDenomination)) {
            return {
                errors: { amount: [`You have only ${userBalance} ${tokenData.tokenTicker} Tokens`] },
                message: 'Form has errors. Failed to Tip.',
            };
        }

        await TokenService.transferToken(tokenData.tokenId, recipientWallet, amount);

        return { message: 'success' };

    } catch {
        return { message: 'AO Error: failed to send tip.' };
    }
}