import { PROCESS_ID_RANKS } from "@/config/ao";
import { Rank } from "@/types/rank";
import { cleanAoJson, fetchAOmessages } from "@/utils/ao";

export const RankService = {
    async fetchRanks(): Promise<Rank> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetUserRank" },
            ], PROCESS_ID_RANKS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Ranking Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const rank: Rank = messageData.data;
                return rank;
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Dapp Rating, ${error}`)
        }
    }
}