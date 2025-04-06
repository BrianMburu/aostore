import { TokenService } from "@/services/ao/tokenService";
import { AppTokenData } from "@/types/dapp";
import { z } from "zod";

export interface TokenTransferState {
    message?: string | null;
    errors?: {
        recipient?: string[];
        amount?: string[];
    }
}

export const tokenTransferSchema = z.object({
    recipient: z.string().min(8, "Minimum 8 characters"),
    amount: z.number().gt(0, "Amount must be greater that 0")
})

export const transfer = async (tokenData: AppTokenData, prevState: TokenTransferState, formData: FormData): Promise<TokenTransferState> => {
    if (!tokenData?.tokenId) {
        return {
            message: 'Invalid Token Selected!',
        };
    }
    const data = {
        recipient: formData.get("recipient"),
        amount: Number(formData.get("amount")) * tokenData.tokenDenomination
    };

    const validatedFields = tokenTransferSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to transfer Token.',
        };
    }


    try {
        const { recipient, amount } = validatedFields.data

        await TokenService.transferToken(tokenData.tokenId, recipient, amount)
        return { message: "success" };

    } catch (error) {
        return { message: `AO Error: failed to transfer Token: ${error}` }
    }
}

export interface SwapTokenState {
    message?: string | null;
    errors?: {
        aosPoints?: string[];
    }
}

export const tokenSwapSchema = z.object({
    aosPoints: z.number().gt(0, "Amount must be greater that 0")
})

export const swap = async (totalPoints: number, prevState: SwapTokenState, formData: FormData): Promise<SwapTokenState> => {
    const data = {
        aosPoints: Number(formData.get("aosPoints"))
    };

    const validatedFields = tokenSwapSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to swap AOS point.',
        };
    }
    const { aosPoints } = validatedFields.data;

    if (aosPoints > totalPoints) {
        return {
            errors: { aosPoints: [`You have only ${totalPoints} AOS points`] },
            message: 'Form has errors. Failed to swap AOS point.',
        };
    }
    try {
        await TokenService.swapAos(aosPoints)

        return { message: "success" };

    } catch (error) {

        return { message: `AO Error: failed to swap AOS point. ${error}` }

    }

}