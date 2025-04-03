'use client'
import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    XMarkIcon,
    ShieldExclamationIcon,
    MegaphoneIcon,
    AcademicCapIcon,
    GiftIcon,
    UserGroupIcon,
    ChartBarIcon,
    TrophyIcon,
    BellAlertIcon,
    ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/outline"
import Image from 'next/image'
import { formatActivityTime } from "@/utils/forum"

import { Message } from "@/types/message";
import clsx from "clsx";
import { aoMessageService } from "@/services/ao/messageService";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
import { AnimatedButton } from "../animations/AnimatedButton";


const typeConfig = {
    'Security Alerts': {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300',
        icon: ShieldExclamationIcon,
        border: 'border-l-red-500'
    },
    'Announcement': {
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300',
        icon: MegaphoneIcon,
        border: 'border-l-blue-500'
    },
    'Educational': {
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300',
        icon: AcademicCapIcon,
        border: 'border-l-purple-500'
    },
    'Promotional': {
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300',
        icon: GiftIcon,
        border: 'border-l-green-500'
    },
    'Community Engagement': {
        color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300',
        icon: UserGroupIcon,
        border: 'border-l-indigo-500'
    },
    'Market Updates': {
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300',
        icon: ChartBarIcon,
        border: 'border-l-amber-500'
    },
    'Milestone Achievements': {
        color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300',
        icon: TrophyIcon,
        border: 'border-l-pink-500'
    },
    'Event Reminders': {
        color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300',
        icon: BellAlertIcon,
        border: 'border-l-cyan-500'
    },
    'Feedback and Surveys': {
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300',
        icon: ChatBubbleLeftEllipsisIcon,
        border: 'border-l-orange-500'
    }
} as const

export function MessageCard({ message }: {
    message: Message
}) {
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null)
    const config = typeConfig[message.messageType as keyof typeof typeConfig] || typeConfig.Announcement
    const [isMarking, startTransition] = useTransition();
    const router = useRouter()

    const markRead = async () => {
        startTransition(
            async () => {
                try {
                    await aoMessageService.markMessageAsRead(message.messageId);
                    router.refresh();
                    toast.success("Message successfully marked as Read");
                } catch {
                    toast.error("Marking message as read has failed");
                }
            }
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={clsx(
                "group relative border-l-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow",
                config.border,
                message.read ? 'opacity-75 hover:opacity-100' : ''
            )}
        >
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src={message.appIconUrl}
                                alt={message.appName}
                                width={40}
                                height={40}
                                className="rounded-lg h-10 w-10"
                            />

                            <div className="flex items-center gap-2">
                                <span className={clsx(
                                    "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2",
                                    config.color
                                )}>
                                    <config.icon className="h-4 w-4" />
                                    {message.messageType}
                                </span>

                                {!message.read && (
                                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                                )}
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold dark:text-gray-100 mb-2">
                            {message.title}
                        </h3>

                        <AnimatePresence initial={false}>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: expandedMessage === message.messageId ? 'auto' : 0 }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="text-gray-600 dark:text-gray-300 space-y-3">
                                    <p className="whitespace-pre-line">{message.message}</p>
                                    {message.link && (
                                        <a
                                            href={message.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center"
                                        >
                                            Learn more <ChevronUpIcon className="h-4 w-4 ml-1 rotate-45" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex items-center justify-between mt-4">
                            <button
                                onClick={() => setExpandedMessage(
                                    expandedMessage === message.messageId ? null : message.messageId
                                )}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                            >
                                {expandedMessage === message.messageId ? 'Show less' : 'Show more'}
                                {expandedMessage === message.messageId ? (
                                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                                ) : (
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                )}
                            </button>

                            {!message.read && (
                                <AnimatedButton
                                    onClick={markRead}
                                    disabled={isMarking}
                                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                                >
                                    {isMarking ? (
                                        <div className="flex items-center justify-center">
                                            <Loader />
                                            marking...
                                        </div>
                                    ) :
                                        (
                                            <div className="flex items-center justify-center">
                                                <XMarkIcon className="h-4 w-4" />
                                                Mark as read
                                            </div>
                                        )
                                    }
                                </AnimatedButton>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatActivityTime(message.currentTime)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {message.company}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}