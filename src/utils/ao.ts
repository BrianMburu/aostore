import { createDataItemSigner, message, result } from "@permaweb/aoconnect";

export async function fetchAOmessages(
    tags: { name: string; value: string }[],
    process: string
) {
    console.log("Fetching AO messages using Window wallet: ", window.arweaveWallet);
    console.log("Tags => ", tags);
    console.log("Process => ", process);

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