import { AirdropService } from "@/services/ao/airdropService";
import { AppAirdropData } from "@/types/airDrop";
import * as z from "zod";

export type AirDropState = {
    message?: string | null;
    errors?: { [key: string]: string[] },
    airdrop?: AppAirdropData
};

export const airdropSchema = z.object({
    title: z.string().min(3, 'Name must be at least 3 characters'),
    tokenId: z.string().max(100, 'Token must not exceed 100 characters'),
    amount: z.number().gt(0, 'Amount must be greater than 0'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    expiryTime: z
        .number().refine((val) => val > Date.now(), {
            message: "Expiry Time must be a valid future date and time",
        }),
});

export type FormValues = z.infer<typeof airdropSchema>;

export async function createAirDrop(userId: string, appId: string, prevState: AirDropState, formData: FormData) {
    // Fetch raw form data.
    const title = formData.get("title");
    const tokenId = formData.get("tokenId");
    const amount = formData.get("amount");
    const description = formData.get("description");
    const rawExpiryTime = formData.get("expiryTime");
    const timezone = formData.get("timezone") || "America/New_York"; // default to UTC

    const date = new Date(new Date(rawExpiryTime as string).toLocaleString('en-US', { timeZone: timezone as string }));
    const expiryTimeUnix = date.getTime();

    // Build our data object. Note: amount should be a number.
    const data = {
        title,
        tokenId,
        amount: Number(amount),
        description,
        expiryTime: expiryTimeUnix,
    };

    const validatedFields = airdropSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to submit Airdrop.',
        };
    }
    try {
        // Simulate a network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newAirdrop = await AirdropService.createAirdrop(userId, appId, validatedFields.data);

        return { message: 'success', airdrop: newAirdrop };

    } catch (error) {
        return { message: `AO Error: failed to submit Airdrop: ${error}` };
    }
}