'use client'

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { aoMessageService, MessageFilterParams } from "@/services/ao/messageService";
import { Message } from "@/types/message";
import InfinityScrollControls from "../InfinityScrollControls";
import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { MessageCard } from "./MessageCard";
import MessageListSkeleton from "./skeletons/MessageListSkeleton";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "../EmptyState";
import { MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function ReceivedMessageList() {
    const searchParams = useSearchParams();

    const [messages, setMessages] = useState<Message[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { isConnected, isLoading: isAuthLoading } = useAuth()

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const filterParams = Object.fromEntries(searchParams.entries()) as MessageFilterParams;

                setIsLoading(true);

                const { messages, total } = await aoMessageService.getReceivedMessages(filterParams, true);

                if (messages) {
                    setMessages(messages);
                    setTotalItems(total);
                }
            } catch (error) {
                toast.error('Failed to load messages with error: ' + error);
                console.error('Failed to load messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, [isConnected, isAuthLoading, searchParams]);

    if (isAuthLoading || isLoading) {
        return <MessageListSkeleton n={4} />
    }

    if (!isLoading && messages.length === 0) {
        return (
            <EmptyState
                title="No Messages found"
                icon={MessageCircle}
                description="We found no messages in your inbox"
                interactive
                className="my-8"
            />
        )
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 shadow rounded-lg"
            >
                <AnimatePresence>
                    {messages.map((message) => (
                        <MessageCard key={message.messageId} message={message} />
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

