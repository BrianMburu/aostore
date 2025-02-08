// app/messages/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { aoMessageService } from '@/services/ao/messageService';
import { Message } from '@/types/message';
import toast from 'react-hot-toast';

// type MessageType = 'normal' | 'feature' | 'bug';

// interface Message {
//     id: string;
//     type: MessageType;
//     title: string;
//     content: string;
//     date: string;
//     read: boolean;
// }

const mockApi = {
    getMessages: async (page: number, pageSize: number, search?: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockMessages: Message[] = [
            {
                id: '1',
                type: 'feature',
                title: 'Feature Request: Dark Mode',
                content: 'Would love to see a dark mode option in the settings...',
                date: '2024-03-15',
                read: false
            },
            {
                id: '2',
                type: 'bug',
                title: 'Login Issue on Mobile',
                content: 'When trying to log in from mobile devices...',
                date: '2024-03-14',
                read: true
            },
            // Add more mock messages
        ];
        const messages: Message[] = mockMessages //JSON.parse(localStorage.getItem('messages') || '[]');
        return {
            data: messages
                .filter(msg =>
                    msg.title.toLowerCase().includes(search?.toLowerCase() || '') ||
                    msg.content.toLowerCase().includes(search?.toLowerCase() || '')
                )
                .slice((page - 1) * pageSize, page * pageSize),
            total: messages.length
        };
    }
};

export default function MessagesPage() {
    const { theme } = useTheme();
    const { user, updateUserData } = useAuth();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 5;

    const { register, watch } = useForm<{ search: string }>();
    const searchQuery = watch('search');

    // const [messages, setMessages] = useState<Message[]>([]);
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadMessages = async () => {
            setIsLoading(true);
            try {

                const response = await aoMessageService.getMessages(currentPage, pageSize, searchQuery);

                updateUserData('messages', response.data);
                setTotalPages(Math.ceil(response.total / pageSize));
            } catch (error) {
                toast.error('Failed to load messages with error: ' + error);
                console.error('Failed to load messages:', error);

            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, [currentPage, searchQuery]);

    const toggleMessage = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const markAsRead = (ids: string[]) => {
        const updated = user!.messages!.map(msg =>
            ids.includes(msg.id) ? { ...msg, read: true } : msg
        );
        updateUserData('messages', updated);
        localStorage.setItem('messages', JSON.stringify(updated));
    };

    const deleteMessages = (ids: string[]) => {
        const updated = user!.messages!.filter(msg => !ids.includes(msg.id));
        updateUserData('messages', updated);
        localStorage.setItem('messages', JSON.stringify(updated));
        setSelectedIds([]);
    };

    if (!user) return <div className="text-center py-8">Please connect your wallet to view messages</div>;

    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        {...register('search')}
                        placeholder="Search messages..."
                        className="px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    <button
                        onClick={() => selectedIds.length > 0 && markAsRead(selectedIds)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
                        disabled={selectedIds.length === 0}
                    >
                        Mark Read
                    </button>
                    <button
                        onClick={() => selectedIds.length > 0 && deleteMessages(selectedIds)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
                        disabled={selectedIds.length === 0}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Loading messages...</div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-gray-800 shadow rounded-lg"
                >
                    <AnimatePresence>
                        {user!.messages!.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-b dark:border-gray-700"
                            >
                                <div className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(message.id)}
                                        onChange={() => toggleMessage(message.id)}
                                        className="mt-1 mr-4"
                                    />
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
                                                    {message.message}
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
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-600 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function TypeBadge({ type }: { type: MessageType }) {
    const baseStyles = 'px-2 py-1 rounded-full text-sm font-medium';
    const typeStyles = {
        bug: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
        feature: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        normal: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
    };

    return (
        <span className={`${baseStyles} ${typeStyles[type]}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
    );
}