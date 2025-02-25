'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { aoMessageService, MessageFilterParams } from "@/services/ao/messageService";
import { Message } from "@/types/message";
import InfinityScrollControls from "../InfinityScrollControls";
import { DEFAULT_PAGE_SIZE } from "@/config";
import { MessageCard } from "./MessageCard";

export function ReceivedMessageList() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [totalItems, setTotalItems] = useState(1);

    const searchParams = useSearchParams();

    useEffect(() => {
        const loadMessages = async () => {
            const filterParams: MessageFilterParams = {
                search: searchParams.get('search') || "",
                type: searchParams.get('type') || "",
                page: searchParams.get('page') || "",
            }
            try {
                const { messages, total } = await aoMessageService.getReceivedMessages(filterParams, true);

                if (messages) {
                    setMessages(messages);
                    setTotalItems(total);
                }
            } catch (error) {
                toast.error('Failed to load messages with error: ' + error);
                console.error('Failed to load messages:', error);

            }
        };

        loadMessages();
    }, [searchParams]);

    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 shadow rounded-lg"
            >
                <AnimatePresence>
                    {messages.map((message) => (
                        <MessageCard key={message.id} message={message} />
                    ))}
                </AnimatePresence>
            </motion.div>
            {messages.length > 0 &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}

