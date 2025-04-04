import { createDataItemSigner, message, result } from "@permaweb/aoconnect";

export async function fetchAOmessages(
    tags: { name: string; value: string }[],
    process: string
) {
    // console.log("Fetching AO messages using Window wallet: ", window.arweaveWallet);
    // console.log("Tags => ", tags);
    // console.log("Process => ", process);

    const fetchDappsMessages = await message({
        process: process,
        tags: tags,
        signer: createDataItemSigner(window.arweaveWallet),
    });
    const { Messages, Error: error } = await result({
        message: fetchDappsMessages,
        process: process
    })

    if (error) {
        console.error("Error => ", error);
        throw new Error("Error fetching AO messages");
    }

    return Messages
}

export function cleanAoJson(messageData: string) {
    const cleanedData = messageData
        .replace(/\n/g, '\\n')  // Escape newlines
        .replace(/\r/g, '\\r')  // Escape carriage returns
        .replace(/\t/g, '\\t');

    return cleanedData
}

export function calculateDenominationAmount(denomination: number): number {
    const amountValue = Math.pow(10, denomination);

    return amountValue;
}

/**
 * Normalizes an Arweave logo field value.
 * If the value is a full URL (starts with "http://" or "https://"), then it is returned unchanged.
 * Otherwise, it is assumed to be just an ID and "https://arweave.net/raw/" is prepended.
 *
 * @param logoValue - The raw logo field value.
 * @returns The full URL for the logo.
 */
export function normalizeArweaveLogo(logoValue: string | null | undefined): string {
    if (!logoValue) return "";

    // Trim any potential whitespace
    const trimmedValue = logoValue.trim();

    // If it's already a full URL, return it as-is.
    if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
        return trimmedValue;
    }

    // Otherwise, assume it's an ID and prepend the Arweave path.
    return `https://arweave.net/raw/${trimmedValue}`;
}

/**
 * Calculates the precision of a given denomination.
 * The precision is defined as the logarithm base 10 of the denomination.
 *
 * @param denomination - The denomination value.
 * @returns The precision of the denomination.
 */
export function findPrecision(denomination: number,): number {
    const precision = Math.log(denomination) / Math.log(10);
    return precision;
}


/**
 * Applies the precision to a given value based on the denomination.
 * The value is converted to a string with the specified precision.
 *
 * @param value - The value to be formatted.
 * @param denomination - The denomination used to determine the precision.
 * @returns The formatted value as a string.
 */
export function applyPrecision(value: number, denomination: number): string {
    const precision = findPrecision(denomination);
    const amount = Number(value).toFixed(precision);
    return amount;
}