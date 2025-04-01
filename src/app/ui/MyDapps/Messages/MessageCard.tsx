'use client'

import { motion } from 'framer-motion'
import { Message } from "@/types/message";
import { capitalizeFirstLetter } from '@/utils/message';
import { AnimatedButton } from '../../animations/AnimatedButton';

export function MessageCard({ message }: {
    message: Message
}) {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border rounded-lg p-4 dark:border-gray-700"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium dark:text-white">{message.title}</h3>
                </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mt-2">{message.message}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="text-indigo-600 dark:text-indigo-400">
                    {capitalizeFirstLetter(message.messageType)} •
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                    Created: {new Date(message.currentTime).toLocaleDateString()}
                </span>
            </div>
        </motion.div>
    )
}

export function EditButton({ onClick }: { onClick: () => void }) {
    return (
        <div className='flex flex-col'>
            <AnimatedButton
                onClick={onClick}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
                Edit
            </AnimatedButton>
        </div>
    )
}