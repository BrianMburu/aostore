
import { AppTokenData, CreateDapp, Dapp, DappList } from "@/types/dapp";
import { DEFAULT_PAGE_SIZE } from '@/config/page'
// import { generateDAppTestData } from "@/utils/dataGenerators";
import { Tip } from "@/types/tip";
import { PROCESS_ID_DAPPS, PROCESS_ID_FAVORITE_DAPPS, PROCESS_ID_FLAG_TABLE, PROCESS_ID_REVIEW_TABLE, PROCESS_ID_TIP_TABLE } from "@/config/ao";
import { cleanAoJson, fetchAOmessages } from "@/utils/ao";
// services/dapps.ts
export interface DAppsFilterParams {
    companyName?: string;
    protocol?: string;
    category?: string;
    search?: string;
    verified?: string;
    page?: string;
    fv_page?: string
}

// const dummyDApps: AppData[] = generateDAppTestData(20)

export const DAppService = {
    async getDApp(appId: string): Promise<Dapp> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchAppDetails" },
                { name: "appId", value: appId }
            ], PROCESS_ID_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];
            // console.log("Last Messages Data => ", lastMessage.Data);

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            console.log("Dapps Details Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const dapp: Dapp = messageData.data;

                return dapp
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Data, ${error}`)
        }
    },

    async getDApps(params: DAppsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: DappList[], total: number }> {
        let dapps: DappList[] = [];

        // Fetch Data from AO
        try {
            const messages = await fetchAOmessages([{ name: "Action", value: "FetchAllApps" }], PROCESS_ID_DAPPS);

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
                dapps = Object.values(messageData.data);
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Data, ${error}`)
        }

        console.log("Dapps => ", dapps);

        // Filter the dummyDApps based on the parameters
        const filtered = dapps.filter(dapp => {
            const matchesProtocol = !params.protocol || params.protocol === 'all' || dapp.protocol === params.protocol;
            const matchesCategory = !params.category || params.category === 'all' || dapp.projectType === params.category;
            const matchesSearch = !params.search || dapp.appName.toLowerCase().includes(params.search.toLowerCase());
            // const matchesVerification = !params.verified || params.verified === 'all' || dapp.verified === params.verified;

            return matchesProtocol && matchesCategory && matchesSearch;
        });

        // Pagination
        const page = Number(params.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort the filtered data
        const sortedData = filtered.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // Return the filtered data and the total count
        return {
            data,
            total: filtered.length
        };
    },

    async getMyDApps(params: DAppsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: DappList[], total: number }> {
        let dapps: DappList[] = [];

        // Fetch Data from AO
        try {
            const messages = await fetchAOmessages([{ name: "Action", value: "GetMyApps" }], PROCESS_ID_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];
            // console.log("Last Messages Data => ", lastMessage.Data);

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            if (messageData && messageData.code == 200) {
                dapps = Object.values(messageData.data);
            }

        } catch (error) {
            console.error(error);
        }

        console.log("MyDapps => ", dapps);

        // Filter the dummyDApps based on the parameters
        const filtered = dapps.filter(dapp => {
            const matchesProtocol = !params.protocol || params.protocol === 'all' || dapp.protocol === params.protocol;
            const matchesCategory = !params.category || params.category === 'all' || dapp.projectType === params.category;
            const matchesSearch = !params.search || dapp.appName.toLowerCase().includes(params.search.toLowerCase());
            // const matchesVerification = !params.verified || params.verified === 'all' || dapp.verified === params.verified;

            return matchesProtocol && matchesCategory && matchesSearch;
        });

        // Pagination
        const page = Number(params.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort the filtered data
        const sortedData = filtered.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // Return the filtered data and the total count
        return {
            data,
            total: filtered.length
        };
    },

    async getDAppsLimited(params: DAppsFilterParams, limit: number = 4): Promise<{ data: DappList[], total: number }> {
        let dapps: DappList[] = [];

        try {
            const messages = await fetchAOmessages([{ name: "Action", value: "FetchAllApps" }], PROCESS_ID_DAPPS);

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
                dapps = Object.values(messageData.data);

            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Data, ${error}`)
        }

        // Filter the dummyDApps based on the parameters
        const filtered = dapps.filter(dapp => {
            const matchesProtocol = !params.protocol || params.protocol === 'all' || dapp.protocol === params.protocol;
            const matchesCategory = !params.category || params.category === 'all' || dapp.projectType === params.category;
            const matchesSearch = !params.search || dapp.appName.toLowerCase().includes(params.search.toLowerCase());
            // const matchesVerification = !params.verified || params.verified === 'all' || dapp.verified === params.verified;
            const matchesCompanyName = !params.companyName || params.companyName === 'all' || dapp.companyName === params.companyName;

            return matchesProtocol && matchesCategory && matchesSearch && matchesCompanyName;
        });

        // Pagination
        // Sort the filtered data
        const sortedData = filtered.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        // Slice the data for the current page
        const data = sortedData.slice(0, limit)

        // Return the filtered data and the total count
        return {
            data,
            total: filtered.length
        };
    },

    async getFavoriteDApps(params: DAppsFilterParams, useInfiniteScroll: boolean = false): Promise<{ data: DappList[], total: number }> {
        let favoriteDapps: DappList[] = [];

        // Fetch Data from AO
        try {
            const messages = await fetchAOmessages([{ name: "Action", value: "GetFavoriteApps" }], PROCESS_ID_FAVORITE_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];
            console.log("Favorite Dapps Messages Data => ", lastMessage.Data);

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            // Parse the Messages
            const messageData = JSON.parse(cleanedData);

            if (messageData && messageData.code == 200) {
                favoriteDapps = Object.values(messageData.data);
            }

        } catch (error) {
            console.error(error);
        }

        console.log("Favorite Dapps => ", favoriteDapps);

        // Filter the dummyDApps based on the parameters
        const filtered = favoriteDapps.filter(dapp => {
            const matchesProtocol = !params.protocol || params.protocol === 'all' || dapp.protocol === params.protocol;
            const matchesCategory = !params.category || params.category === 'all' || dapp.projectType === params.category;
            const matchesSearch = !params.search || dapp.appName.toLowerCase().includes(params.search.toLowerCase());
            // const matchesVerification = !params.verified || params.verified === 'all' || dapp.verified === params.verified;

            return matchesProtocol && matchesCategory && matchesSearch;
        });

        // Pagination
        const page = 1;
        const itemsPerPage = 8; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort the filtered data
        const sortedData = filtered.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

        // Slice the data for the current page
        const data = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        // Return the filtered data and the total count
        return {
            data,
            total: filtered.length
        };
    },

    async createDApp(dappData: CreateDapp) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddProjectZ" },
                { name: "appName", value: dappData.appName },
                { name: "appIconUrl", value: dappData.appIconUrl },
                { name: "projectType", value: dappData.projectType },
                { name: "description", value: dappData.description },
                { name: "companyName", value: dappData.companyName },
                { name: "websiteUrl", value: dappData.websiteUrl },
                { name: "twitterUrl", value: dappData.twitterUrl },
                { name: "discordUrl", value: dappData.discordUrl },
                { name: "coverUrl", value: dappData.coverUrl },
                { name: "bannerUrls", value: JSON.stringify(dappData.bannerUrls) },
                { name: "protocol", value: dappData.protocol },
                { name: "username", value: dappData.username },
                { name: "profileUrl", value: dappData.profileUrl },

            ], PROCESS_ID_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            console.log("Messages => ", messages);

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            // Parse the Messages
            const messageData = JSON.parse(cleanedData);

            console.log("Dapps Messages Data => ", messageData);

            if (!messageData || messageData.code != 200) {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to add Dapp, ${error}`)
        }
    },

    async updateDApp(appId: string, dappData: CreateDapp): Promise<Dapp> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "UpdateAppDetails" },
                { name: "appId", value: appId },
                { name: "appName", value: dappData.appName },
                { name: "appIconUrl", value: dappData.appIconUrl },
                { name: "projectType", value: dappData.projectType },
                { name: "description", value: dappData.description },
                { name: "companyName", value: dappData.companyName },
                { name: "websiteUrl", value: dappData.websiteUrl },
                { name: "twitterUrl", value: dappData.twitterUrl },
                { name: "discordUrl", value: dappData.discordUrl },
                { name: "coverUrl", value: dappData.coverUrl },
                { name: "bannerUrls", value: JSON.stringify(dappData.bannerUrls) },
                { name: "protocol", value: dappData.protocol },
                { name: "username", value: dappData.username },
                { name: "profileUrl", value: dappData.profileUrl },

            ], PROCESS_ID_DAPPS);

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
                const updatedDapp: Dapp = messageData.data;
                return updatedDapp
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to update Dapp, ${error}`)
        }
    },

    async deleteDApp(appId: string): Promise<void> {
        // Fetch Data from AO
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "DeleteApp" },
                { name: "appId", value: appId }
            ], PROCESS_ID_DAPPS);

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

            if (!messageData || messageData.code != 200) {
                throw new Error(messageData.message);
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to delete dapp, ${error}`);
        }
    },

    async submitVerification(appId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Submitting verification for appId => ", appId);
        // Simulate verification process
    },

    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },

    async addDappToken(appId: string, tokenData: AppTokenData): Promise<AppTokenData> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddTokenTable" },
                { name: "tokenId", value: tokenData.tokenId },
                { name: "tokenName", value: tokenData.tokenName },
                { name: "tokenTicker", value: tokenData.tokenTicker },
                { name: "tokenDenomination", value: tokenData.tokenDenomination.toString() },
                { name: "logo", value: tokenData.logo },
                { name: "appId", value: appId },

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

    async FetchTokenData(tokenId: string): Promise<AppTokenData | undefined> {
        // Fetch Data from AO
        try {
            const messages = await fetchAOmessages([{ name: "Action", value: "Info" }], tokenId);
            console.log("Messages => ", messages);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            console.log("Messages => ", messages);

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            // Parse the Messages
            const messageData = JSON.parse(cleanedData);

            console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const tokenData: AppTokenData = messageData.data;
                return { ...tokenData, tokenId };
            }

        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch token data.");
        }
    },

    async changeDappOwner(appId: string, newOwnerId: string): Promise<void> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "ChangeAppOwnership" },
                { name: "appId", value: appId },
                { name: "newOwnerId", value: newOwnerId }
            ], PROCESS_ID_DAPPS);

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

            if (!messageData || messageData.code != 200) {
                throw new Error(messageData.message);
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Change dapp ownership, ${error}`);
        }
    },

    async addMods(appId: string, mods: string[]): Promise<string[]> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddMods" },
                { name: "appId", value: appId },
                { name: "mods", value: JSON.stringify(mods) },

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
                const mods: string[] = messageData.data;
                return mods;
            } else {
                throw new Error(messageData.message);
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to add token data, ${error}`);
        }
    },

    async getMods(appId: string): Promise<{ data: string[], total: number }> {
        let mods: string[] = [];

        // Fetch Data from AO
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetMods" },
                { name: "appId", value: appId }
            ], PROCESS_ID_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }


            // Fetch the last message
            const lastMessage = messages[messages.length - 1];
            // console.log("First Messages Data => ", firstMessage.Data);

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            console.log("Mods Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                mods = Object.values(messageData.data);
            }

        } catch (error) {
            console.error(error);
        }

        console.log("mods => ", mods);


        // Return the filtered data and the total count
        return { data: mods, total: mods.length }
    },

    async getDappRating(appId: string): Promise<{ rating: number, totalReviews: number }> {
        let rating = { rating: 0, totalReviews: 0 };

        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchAppReviewsInfo" },
                { name: "appId", value: appId }
            ], PROCESS_ID_REVIEW_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            console.log("RATINGS DATA: =>", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData && messageData.code == 200) {
                const totalReviews = messageData.data.reviewsCount;
                const appRating = messageData.data.totalRatings / messageData.data.ratingsCount;

                rating = { rating: appRating, totalReviews }
            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Dapp Rating, ${error}`)
        }
        return rating
    },

    async addDappToFavorites(appId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddAppToFavorite" },
                { name: "appId", value: appId }
            ], PROCESS_ID_FAVORITE_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            console.log("Favorites Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (!messageData || messageData.code != 200) {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Dapp Rating, ${error}`)
        }
    },

    async flagDappAsInappropriate(appId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FlagApp" },
                { name: "appId", value: appId }
            ], PROCESS_ID_FLAG_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (!messageData || messageData.code != 200) {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to flag Dapp as Inappropriate, ${error}`)
        }
    }
};