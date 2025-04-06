import { Message } from "@/types/message";
import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { cleanAoJson, fetchAOmessages } from "@/utils/ao";
import { PROCESS_ID_FAVORITE_DAPPS } from "@/config/ao";

export interface MessageFilterParams {
    type?: string;
    search?: string;
    page?: string;
}

export const aoMessageService = {
    async getTotalUnreadMessages(): Promise<number> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetUserUnreadMessagesCount" }
            ], PROCESS_ID_FAVORITE_DAPPS);

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
                const unreadMessages: number = messageData.data;
                return unreadMessages
            } else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch unread message totals , ${error}`)
        }

    },

    async getReceivedMessages(params: MessageFilterParams, useInfiniteScroll: boolean = false): Promise<{ messages: Message[], total: number }> {
        let recievedMesages: Message[] = [];

        // Fetch Data from AO
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetUserInbox" }
            ], PROCESS_ID_FAVORITE_DAPPS);

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
                recievedMesages = Object.values(messageData.data);
                // console.log("Messages Data:=>", recievedMesages)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch messages, ${error}`)
        }

        // Filter the dummy Posts based on the parameters
        const filtered = recievedMesages.filter(message => {
            const matchesTopic = !params.type || params.type === 'all' || message.messageType === params.type;
            const matchesSearch = !params.search || message.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesTopic && matchesSearch;
        });
        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort and slice the data for the current page
        const sortedData = filtered
            .sort((a, b) => new Date(b.currentTime).getTime() - new Date(a.currentTime).getTime())

        const messages = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return {
            messages,
            total: filtered.length
        }
    },

    async getSentMessages(params: MessageFilterParams, useInfiniteScroll: boolean = false): Promise<{ messages: Message[], total: number }> {
        let sentMesages: Message[] = [];

        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "GetUserSentBox" }
            ], PROCESS_ID_FAVORITE_DAPPS);

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
                sentMesages = Object.values(messageData.data);
                // console.log("Messages Data:=>", sentMesages)
            } else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch messages, ${error}`)
        }

        // Filter the dummy Posts based on the parameters
        const filtered = sentMesages.filter(message => {
            const matchesType = !params.type || params.type === 'all' || message.messageType === params.type;
            const matchesSearch = !params.search || message.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesType && matchesSearch;
        });

        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort and slice the data for the current page
        const sortedData = filtered
            .sort((a, b) => new Date(b.currentTime).getTime() - new Date(a.currentTime).getTime())

        const messages = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        return {
            messages,
            total: filtered.length
        }
    },

    async markMessageAsRead(messageId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkUserMessageRead" },
                { name: "messageId", value: messageId }

            ], PROCESS_ID_FAVORITE_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];
            // console.log("Last Messages Data => ", lastMessage.Data);

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            if (!messageData || messageData.code !== 200) {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to mark Message as read, ${error}`)
        }
    },

    async sendMessage(appId: string, messageData: { message: string, messageType: string, title: string, link?: string }) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "SendMessage" },
                { name: "appId", value: appId },
                { name: "title", value: messageData.title },
                { name: "messageType", value: messageData.messageType },
                { name: "message", value: messageData.message },
                { name: "link", value: messageData.link || "" }
            ], PROCESS_ID_FAVORITE_DAPPS);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const newMessageData = JSON.parse(cleanedData);

            if (!newMessageData || newMessageData.code !== 200) {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to send message, ${error}`)
        }
    }
};