import { PROCESS_ID_USER_TABLE } from "@/config/ao";
import { User } from "@/types/user";
import { fetchAOmessages } from "@/utils/ao";

export const UserService = {
    fetchUser: async (): Promise<User | undefined> => {
        try {
            const messages = await fetchAOmessages([{ name: "Action", value: "GetUser" }], PROCESS_ID_USER_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the First message
            const firstMessage = messages[0];

            // Parse the Messages
            const messageData = JSON.parse(firstMessage.Data);

            // console.log("User Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const user: User = messageData.data;
                return user;
            }

        } catch (error) {
            console.error(error);
        }
    },

    addUser: async (userData: User): Promise<User | undefined> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddUser" },
                { name: "username", value: userData.username },
                { name: "avatar", value: userData.avatar || "" },
            ], PROCESS_ID_USER_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // console.log("Messages => ", messages);

            // Fetch the last message
            const firstMessage = messages[0];
            // console.log("First Messages Data => ", firstMessage.Data);

            // Parse the Messages
            const messageData = JSON.parse(firstMessage.Data);

            // console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const user: User = messageData.data;
                return user;
            }

        } catch (error) {
            console.error(error);
        }
    },

    updateUser: async (userData: { username: string, avatar?: string }): Promise<User | undefined> => {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "UpdateUser" },
                { name: "username", value: userData.username },
                { name: "avatar", value: userData.avatar || "" },
            ], PROCESS_ID_USER_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const firstMessage = messages[0];

            // Parse the Messages
            const messageData = JSON.parse(firstMessage.Data);

            // console.log("User Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const user: User = messageData.data;
                return user;
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to Update User Data, ${error}`)
        }
    },
}