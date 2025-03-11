'use client'
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

import { Message, MessageType } from "@/types/message";

export function MessageCard({ message }: { message: Message }) {
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b dark:border-gray-700"
        >
            <div className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <TypeBadge type={message.type} />
                        {!message.read && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                        )}
                    </div>
                    <h3 className="mt-2 text-lg font-medium dark:text-gray-100">
                        {message.title}
                    </h3>
                    <AnimatePresence initial={false}>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: expandedMessage === message.id ? 'auto' : 0 }}
                            className="overflow-hidden"
                        >
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                {message.content}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                    <button
                        onClick={() => setExpandedMessage(
                            expandedMessage === message.id ? null : message.id
                        )}
                        className="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                    >
                        {expandedMessage === message.id ? 'Show less' : 'Show more'}
                        {expandedMessage === message.id ? (
                            <ChevronUpIcon className="h-4 w-4 inline ml-1" />
                        ) : (
                            <ChevronDownIcon className="h-4 w-4 inline ml-1" />
                        )}
                    </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                    {new Date(message.currentTime).toLocaleDateString()}
                </span>
            </div>
        </motion.div>
    )
}

function TypeBadge({ type }: { type: MessageType }) {
    const baseStyles = 'px-2 py-1 rounded-full text-sm font-medium';
    const typeStyles = {
        bug: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
        feature: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        update: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
    };

    return (
        <span className={`${baseStyles} ${typeStyles[type]}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
    );
}