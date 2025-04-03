import { PROCESS_ID_RANKS, PROCESS_ID_TIP_TABLE } from "@/config/ao";
import { AppTokenData } from "@/types/dapp";
import { cleanAoJson, fetchAOmessages } from "@/utils/ao";

export const TokenService = {
    async addDappToken(appId: string, tokenData: AppTokenData): Promise<AppTokenData> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddTokenDetails" },
                { name: "appId", value: appId },
                { name: "tokenId", value: tokenData.tokenId },
                { name: "tokenName", value: tokenData.tokenName },
                { name: "tokenTicker", value: tokenData.tokenTicker },
                { name: "tokenDenomination", value: tokenData.tokenDenomination.toString() },
                { name: "logo", value: tokenData.logo },
            ], PROCESS_ID_TIP_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            // Parse the Messages
            const messageData = JSON.parse(cleanedData);

            console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const tokenData: AppTokenData = messageData.data;
                return tokenData;
            } else {
                throw new Error(messageData.message);
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to add token data, ${error}`);
        }
    },

    async fetchTokenDetails(appId: string): Promise<AppTokenData> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetTokenDetails" },
                { name: "appId", value: appId }

            ], PROCESS_ID_TIP_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            if (messageData && messageData.code == 200) {
                const tokenData = messageData.data;
                // console.log("Dapps Messages Data => ", messageData);
                return tokenData

            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch token data.`)
        }
    },

    async transferToken(tokenId: string, recipient: string, amount: number) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "Transfer" },
                { name: "Recipient", value: recipient },
                { name: "Quantity", value: String(amount) }
            ], tokenId);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            if (!(messages?.[0].Tags
                .find((tag: { name: string, value: string }) => tag.name === "Action").value === "Debit-Notice")
            ) {
                throw new Error("Token Transfer Failed")
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Transfer Tokens, ${error}`)
        }
    },

    async fetchTokenBalance(tokenId: string): Promise<string> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "Balance" }
            ], tokenId);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            // Parse the Messages
            const messageData = JSON.parse(cleanedData);

            console.log("Dapps Token Balance Data => ", messageData);

            if (messageData) {
                const tokenBalance: string = messageData;
                return tokenBalance;

            } else {
                throw new Error("Failed to fetch token balance");
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Fetch Tokens Balance, ${error}`)
        }
    },

    async fetchTokens(): Promise<AppTokenData[]> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchTokensX" },
            ], PROCESS_ID_TIP_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }
            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            // Parse the Messages
            const messageData = JSON.parse(cleanedData);

            console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const tokens: AppTokenData[] = Object.values(messageData.data);
                return tokens;

            } else {
                throw new Error(messageData.message);
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Tokens, ${error}`)
        }
    },

    async swapAos(aosPoints: number) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "SwapToAosTokens" },
                { name: "points", value: aosPoints.toString() }
            ], PROCESS_ID_RANKS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            // Parse the Messages
            const messageData = JSON.parse(cleanedData);

            if (!messageData || messageData.code != 200) {
                throw new Error(messageData.message);
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Fetch Tokens Balance, ${error}`)
        }
    },
}