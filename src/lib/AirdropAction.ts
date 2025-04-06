import { PROCESS_ID_AIRDROP_TABLE } from "@/config/ao";
import { AirdropService } from "@/services/ao/airdropService";
import { TokenService } from "@/services/ao/tokenService";
import { Airdrop } from "@/types/airDrop";
import { AppTokenData } from "@/types/dapp";
import * as z from "zod";

export type AirDropState = {
    message?: string | null;
    errors?: { [key: string]: string[] },
    airdrop?: Airdrop | null
};

export const airdropSchema = z
    .object({
        title: z.string().min(3, { message: "Name must be at least 3 characters" }),
        amount: z.number().gt(0, { message: "Amount must be greater than 0" }),
        description: z.string().min(10, { message: "Description must be at least 10 characters" }),
        airdropsReceivers: z.string().min(1, { message: "ReciverType cannot be empty" }),
        minAosPoints: z.number().gt(0, { message: "Amount must be greater than 0" }),
        startTime: z.number().refine(
            (val) => val > Date.now(),
            { message: "Start Time must be a valid future date and time" }
        ),
        endTime: z.number().refine(
            (val) => val > Date.now(),
            { message: "Expiry Time must be a valid future date and time" }
        )
    })
    .refine(
        (data) => data.startTime < data.endTime,
        { message: "End Time must be after Start Time", path: ["endTime"] }
    );


export type FormValues = z.infer<typeof airdropSchema>;

export async function createAirDrop(userId: string, appId: string, prevState: AirDropState, formData: FormData) {
    // Fetch raw form data.
    const title = formData.get("title");
    const amount = formData.get("amount");
    const minAosPoints = formData.get("minAosPoints");
    const description = formData.get("description");
    const airdropsReceivers = formData.get("airdropsReceivers");
    const rawExpiryTime = formData.get("endTime");
    const rawStartTime = formData.get("startTime");
    const timezone = formData.get("timezone") || "America/New_York"; // default to UTC

    const startDate = new Date(new Date(rawStartTime as string).toLocaleString('en-US', { timeZone: timezone as string }));
    const startTimeUnix = startDate.getTime();

    const expiryDate = new Date(new Date(rawExpiryTime as string).toLocaleString('en-US', { timeZone: timezone as string }));
    const expiryTimeUnix = expiryDate.getTime();

    // Build our data object. Note: amount should be a number.
    const data = {
        title,
        airdropsReceivers,
        amount: Number(amount),
        minAosPoints: Number(minAosPoints),
        description,
        startTime: startTimeUnix,
        endTime: expiryTimeUnix,
    };

    const validatedFields = airdropSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to submit Airdrop.',
        };
    }
    try {
        // Fetch Token Data
        const tokenData: AppTokenData = await TokenService.fetchTokenDetails(appId);

        // Transfer to our main Process.
        const amount = validatedFields.data.amount
        await TokenService.transferToken(tokenData.tokenId, PROCESS_ID_AIRDROP_TABLE, amount * tokenData.tokenDenomination);

        // Confirm Deposit.
        const airdropId = await AirdropService.confirmAirdropTokenDeposit(appId, tokenData, amount);

        // Create Airdrop
        await AirdropService.createAirdrop(appId, airdropId, validatedFields.data);


        return { message: 'success' };

    } catch (error) {
        return { message: `AO Error: failed to submit Airdrop: ${error}` };
    }
}