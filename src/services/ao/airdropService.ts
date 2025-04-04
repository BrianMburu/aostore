import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { Airdrop } from '@/types/airDrop';
import { cleanAoJson, fetchAOmessages } from '@/utils/ao';
import { PROCESS_ID_AIRDROP_TABLE } from '@/config/ao';
import { AppTokenData } from '@/types/dapp';

export interface AidropsFilterParams {
    appId?: string;
    sort?: string;
    search?: string;
    page?: string;
}

export const AirdropService = {
    fetchAirdrop: async (appId: string, airdropId: string): Promise<Airdrop | undefined> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchAirdropData" },
                { name: "appId", value: appId },
                { name: "airdropId", value: airdropId }
            ], PROCESS_ID_AIRDROP_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];
            // console.log("Last Messages Data => ", lastMessage.Data);

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            // console.log("Airdrop Details Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const airdrop: Airdrop = messageData.data;

                return airdrop
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Airdrop Data, ${error}`)
        }
    },

    fetchAirdrops: async (appId: string, params: AidropsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: Airdrop[]; total: number }> => {
        // Fetch Data from AO
        let airdrops: Airdrop[] = [];
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchAppAirdrops" },
                { name: "appId", value: appId }

            ], PROCESS_ID_AIRDROP_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];
            // console.log("Last Messages Data => ", lastMessage.Data);

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            // console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                airdrops = Object.values(messageData.data);
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Data, ${error}`)
        }

        const filteredData = airdrops
            .filter(airdrop => {
                const matchesSearch = !params.search || airdrop.appName.toLowerCase().includes(params.search.toLowerCase());
                return matchesSearch;
            });

        // console.log("AirDrops Messages filtered Data => ", filteredData);

        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        const sortedData = filteredData
            .sort((a, b) => (params.sort === 'expiryTime' ?
                a.endTime - b.endTime :
                b.startTime - a.startTime
            ));

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // Return the filtered data and the total count
        return {
            data,
            total: filteredData.length
        };
    },

    fetchAirdropsLimit: async (appId: string, params: AidropsFilterParams, limit: number = 5): Promise<{ data: Airdrop[]; total: number }> => {
        // Fetch Data from AO
        let airdrops: Airdrop[] = [];

        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetAirdropsByAppId" },
                { name: "appId", value: appId }

            ], PROCESS_ID_AIRDROP_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            // console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                airdrops = Object.values(messageData.data);

            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Airdrop Data, ${error}`)
        }

        const filteredData = airdrops
            .filter(airdrop => airdrop.appId === params.appId)

        const sortedData = filteredData
            .sort((a, b) => (params.sort === 'expiryTime' ?
                a.endTime - b.endTime :
                b.startTime - a.startTime
            ));

        // Slice the data for the current page
        const data = sortedData.slice(0, limit)

        // Return the filtered data and the total count
        return {
            data,
            total: filteredData.length
        };
    },

    async createAirdrop(appId: string, airdropId: string, airdropData: {
        airdropsReceivers: string, description: string, title: string,
        startTime: number, endTime: number, minAosPoints: number
    }) {
        try {
            const messages = await fetchAOmessages([
                { name: "appId", value: appId },
                { name: "airdropId", value: airdropId },
                { name: "title", value: airdropData.title },
                { name: "airdropsReceivers", value: airdropData.airdropsReceivers },
                { name: "description", value: airdropData.description },
                { name: "startTime", value: String(airdropData.startTime) },
                { name: "endTime", value: String(airdropData.endTime) },
                { name: "minAosPoints", value: String(airdropData.minAosPoints) },
            ], PROCESS_ID_AIRDROP_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            if (!messageData || messageData.code != 200) {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Finalize Airdrop, ${error}`)
        }
    },

    async confirmAirdropTokenDeposit(appId: string, tokenData: AppTokenData, amount: number): Promise<string> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "DepositConfirmedN" },
                { name: "appId", value: appId },
                { name: "tokenId", value: String(tokenData.tokenId) },
                { name: "tokenName", value: String(tokenData.tokenName) },
                { name: "tokenTicker", value: String(tokenData.tokenTicker) },
                { name: "tokenDenomination", value: String(tokenData.tokenDenomination) },
                { name: "amount", value: String(amount) },

            ], PROCESS_ID_AIRDROP_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            // console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const airdropId = messageData.data;
                return airdropId

            } else {

                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Data, ${error}`)
        }

    },
};