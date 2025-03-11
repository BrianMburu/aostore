'use client'

import { Message } from "@/types/message";
import { MessageCard } from "./MessageCard";
import { AnimatedListItem } from "../../animations/AnimatedListItem";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from 'next/navigation'
import { aoMessageService, MessageFilterParams } from "@/services/ao/messageService";
import InfinityScrollControls from "../../InfinityScrollControls";
import { DEFAULT_PAGE_SIZE } from "@/config/page";

export function MessagesList() {
    const params = useParams();
    const searchParams = useSearchParams();

    const appId = params.appId as string;

    const [messages, setMessages] = useState<Message[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const filterParams: MessageFilterParams = {
            search: searchParams.get('search') || "",
            type: searchParams.get('type') || "",
            page: searchParams.get('page') || "",
        }
        const loadMessages = async () => {

            const { messages, total } = await aoMessageService.getSentMessages(appId, filterParams, true);
            if (messages) {
                setMessages(messages);
                setTotalItems(total);
            }

        }
        loadMessages()

    }, [appId, searchParams])

    return (
        <div className="space-y-6">
            {messages.map((message) => (
                <AnimatedListItem key={message.id}>
                    <MessageCard message={message} />
                </AnimatedListItem>
            ))}
            {messages.length > 0 &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    );
}