// import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
// import { Othent } from "@othent/kms";
// import { initializeOthent } from "@/services/auth/othent";
// import { ARS_PROCESS } from "@/utils/ao_processes";
import { Message } from "@/types/message";
import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { generateTestMessages } from "@/utils/dataGenerators";
import { DAppService } from "./dappService";


export interface MessageFilterParams {
    type?: string;
    search?: string;
    page?: string;
}
// Generate 5 test messages
const testMessages = generateTestMessages(5);

// Generate messages starting from a specific time
const pastMessages = generateTestMessages(20, new Date('2024-01-01').getTime());

export const aoMessageService = {
    async getMessage(messageId: string): Promise<Message | undefined> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const message = testMessages.find(message => message.id === messageId)

        return message;
    },

    async getReceivedMessages(params: MessageFilterParams, useInfiniteScroll: boolean = false): Promise<{ messages: Message[], total: number }> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // const mockMessages: Message[] = [
        //     {
        //         id: '1',
        //         appName: 'AOS Store',
        //         appIconUrl: 'https://avatars.dicebear.com/api/avataaars/aos-store.svg',
        //         company: 'AOS',
        //         type: 'feature',
        //         title: 'Feature Request: Dark Mode',
        //         message: 'Would love to see a dark mode option in the settings...',
        //         linkInfo: 'https://aostore.com',
        //         currentTime: '2024-03-15',
        //         read: false,
        //     },
        //     {
        //         id: '2',
        //         appName: 'Arweave',
        //         appIconUrl: 'https://avatars.dicebear.com/api/avataaars/arweave.svg',
        //         company: 'Arweave',
        //         type: 'bug',
        //         title: 'Login Issue on Mobile',
        //         message: 'When trying to log in from mobile devices...',
        //         linkInfo: 'https://arweave.com',
        //         currentTime: '2024-03-15',
        //         read: false,
        //     },
        //     // Add more mock messages
        // ];
        // const othent = initializeOthent();

        // const messageResponse = await message({
        //     process: ARS_PROCESS,
        //     tags: [{ name: "Action", value: "GetUserInbox" }],
        //     signer: createDataItemSigner(othent),
        // });

        // const resultResponse = await result({
        //     message: messageResponse,
        //     process: ARS_PROCESS,
        // });

        // const { Messages, Error } = resultResponse;

        // if (Error) {
        //     throw new Error(Error);
        // }

        const dummyMessages: Message[] = testMessages //JSON.parse(localStorage.getItem('messages') || '[]');

        // Filter the dummy Posts based on the parameters
        const filtered = dummyMessages.filter(message => {
            const matchesTopic = !params.type || params.type === 'all' || message.type === params.type;
            const matchesSearch = !params.search || message.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesTopic && matchesSearch;
        });
        // Pagination
        const page = Number(params.page) || 1;
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

    async getSentMessages(appId: string, params: MessageFilterParams, useInfiniteScroll: boolean = false): Promise<{ messages: Message[], total: number }> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const dummyMessages: Message[] = pastMessages;

        // Filter the dummy Posts based on the parameters
        const filtered = dummyMessages.filter(message => {
            const matchesType = !params.type || params.type === 'all' || message.type === params.type;
            const matchesSearch = !params.search || message.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesType && matchesSearch;
        });

        // Pagination
        const page = Number(params.page) || 1;
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

    async sendMessage(appId: string, MessageData: Partial<Message>): Promise<Message> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const dapp = await DAppService.getDApp(appId);

        if (!dapp) {
            throw new Error('Dapp not found');
        }
        const newMessage: Message = {
            id: crypto.randomUUID(),
            title: MessageData.title!,
            content: MessageData.content!,
            type: MessageData.type!,
            currentTime: Date.now(),
            updateTime: Date.now(),
            appName: dapp.appName,
            appIconUrl: dapp.appIconUrl,
            company: dapp.companyName,
            linkInfo: dapp.websiteUrl,
            read: false,
        }

        // Add the new Message to the beginning of the past sent messages array
        pastMessages.unshift(newMessage);

        return newMessage;
    },

    async editMessage(messageId: string, MessageData: Partial<Message>): Promise<Message> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const index = pastMessages.findIndex(d => d.id === messageId);
        if (index === -1) {
            throw new Error('Message not found');
        }

        pastMessages[index] = { ...pastMessages[index], ...MessageData };
        return pastMessages[index];
    },
};