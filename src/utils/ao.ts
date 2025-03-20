import { createDataItemSigner, message, result } from "@permaweb/aoconnect";

export async function fetchAOmessages(
    tags: { name: string; value: string }[],
    process: string, signer: ReturnType<typeof createDataItemSigner>
) {
    console.log("Fetching AO messages using signer: ", signer);
    const fetchDappsMessages = await message({
        process: process,
        tags: tags,
        signer,
    });
    const { Messages, Error: error } = await result({
        message: fetchDappsMessages,
        process: process
    })

    if (error) {
        console.error("Error => ", error);
    }

    return Messages
}