import { PROCESS_ID_RANKS, PROCESS_ID_REVIEW_TABLE, PROCESS_ID_TIP_TABLE } from "@/config/ao";
import { AppTipTransactionData, AppTokenData, AppTransactionData } from "@/types/dapp";
import { cleanAoJson, fetchAOmessages } from "@/utils/ao";
import { processes } from "./dappService";
import { DEFAULT_PAGE_SIZE } from "@/config/page";

export interface TransactionsFilterParams {
    page?: number;
    itemsPerPage?: number;
    filter?: string;
    sort?: string;
}
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

            // console.log("Dapps Messages Data => ", messageData);

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

            // console.log("Dapps Token Balance Data => ", messageData);

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

            // console.log("Dapps Messages Data => ", messageData);

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

    async fetchTransactions(accessPage: string, params: TransactionsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: AppTransactionData[], total: number }> {
        let transactions: AppTransactionData[] = [];
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "view_transactions" },
            ], processes[accessPage] || PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }
            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            // Parse the Messages
            const messageData = JSON.parse(cleanedData);

            // console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                transactions = Object.values(messageData.data);

            } else {
                throw new Error(messageData.message);
            }

            const filtered = transactions.filter(transaction => {
                const matchesFilter = !params.filter || transaction.transactionType.toLowerCase().includes(params.filter.toLowerCase());

                return matchesFilter;
            });

            // Pagination
            const page = Number(params?.page) || 1;
            const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

            // Sort the filtered data
            const sortedData = filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            // Slice the data for the current page
            const data = useInfiniteScroll
                ? sortedData.slice(0, page * itemsPerPage)
                : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

            // Return the filtered data and the total count
            return {
                data,
                total: filtered.length
            };

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Tokens, ${error}`)
        }
    },

    async fetchTipTransactions(params: TransactionsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: AppTipTransactionData[], total: number }> {
        let transactions: AppTipTransactionData[] = [];
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetUserTips" },
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
                transactions = Object.values(messageData.data);

            } else {
                throw new Error(messageData.message);
            }

            const filtered = transactions.filter(transaction => {
                const matchesFilter = !params.filter || transaction.transactionType.toLowerCase().includes(params.filter.toLowerCase());

                return matchesFilter;
            });

            // Pagination
            const page = Number(params?.page) || 1;
            const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

            // Sort the filtered data
            const sortedData = filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            // Slice the data for the current page
            const data = useInfiniteScroll
                ? sortedData.slice(0, page * itemsPerPage)
                : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

            // Return the filtered data and the total count
            return {
                data,
                total: filtered.length
            };

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Tokens, ${error}`)
        }
    },

    async fetchItemTipTransactions(appId: string, userId: string, tipId: string, params: TransactionsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: AppTipTransactionData[], total: number }> {
        let transactions: AppTipTransactionData[] = [];
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetCommentTips" },
                { name: "appId", value: appId },
                { name: "user", value: userId },
                { name: "tipId", value: tipId }
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

            // console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                transactions = Object.values(messageData.data);

            } else {
                throw new Error(messageData.message);
            }

            const filtered = transactions.filter(transaction => {
                const matchesFilter = !params.filter || transaction.transactionType.toLowerCase().includes(params.filter.toLowerCase());

                return matchesFilter;
            });

            // Pagination
            const page = Number(params?.page) || 1;
            const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

            // Sort the filtered data
            const sortedData = filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            // Slice the data for the current page
            const data = useInfiniteScroll
                ? sortedData.slice(0, page * itemsPerPage)
                : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

            // Return the filtered data and the total count
            return {
                data,
                total: filtered.length
            };

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Tokens, ${error}`)
        }
    },

    async saveTipTransaction(appId: string, receiverId: string, tipId: string, amount: number,) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "TipsEarned" },
                { name: "appId", value: appId },
                { name: "receiverId", value: receiverId },
                { name: "tipId", value: tipId },
                { name: "amount", value: String(amount) }
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

            if (!messageData || messageData.code !== 200) {
                throw new Error(messageData.message);
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Save Tokens Transaction, ${error}`)
        }
    },
}