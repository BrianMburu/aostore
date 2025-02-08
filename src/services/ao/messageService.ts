import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
// import { Othent } from "@othent/kms";
import { initializeOthent } from "@/services/auth/othent";
import { ARS_PROCESS } from "@/utils/ao_processes";
import { Message } from "@/types/message";

export const aoMessageService = {
    getMessages: async (page: number, pageSize: number, search?: string) => {

        await new Promise(resolve => setTimeout(resolve, 500));
        const mockMessages: Message[] = [
            {
                id: '1',
                appName: 'AOS Store',
                appIconUrl: 'https://avatars.dicebear.com/api/avataaars/aos-store.svg',
                company: 'AOS',
                type: 'feature',
                title: 'Feature Request: Dark Mode',
                message: 'Would love to see a dark mode option in the settings...',
                linkInfo: 'https://aostore.com',
                currentTime: '2024-03-15',
                read: false,
            },
            {
                id: '2',
                appName: 'Arweave',
                appIconUrl: 'https://avatars.dicebear.com/api/avataaars/arweave.svg',
                company: 'Arweave',
                type: 'bug',
                title: 'Login Issue on Mobile',
                message: 'When trying to log in from mobile devices...',
                linkInfo: 'https://arweave.com',
                currentTime: '2024-03-15',
                read: false,
            },
            // Add more mock messages
        ];
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

        const messages: Message[] = mockMessages //JSON.parse(localStorage.getItem('messages') || '[]');

        // const messages: Message[] = Object.values(JSON.parse(Messages[0].Data));

        return {
            data: messages
                .filter(msg =>
                    msg.title.toLowerCase().includes(search?.toLowerCase() || '') ||
                    msg.message.toLowerCase().includes(search?.toLowerCase() || '')
                )
                .slice((page - 1) * pageSize, page * pageSize),
            total: messages.length
        };
    }
};