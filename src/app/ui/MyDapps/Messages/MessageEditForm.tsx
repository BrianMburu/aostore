// app/mydapps/[appId]/messages/page.tsx
'use client'

import { useActionState } from 'react'
import { editMessage, MessageState } from '@/lib/messageActions'
import { Message, messageTypes } from '@/types/message'
import { useParams } from "next/navigation";
import Loader from '../../Loader'
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { capitalizeFirstLetter } from '@/utils/message';
import ModalDialog from '../ModalDialog';

export default function MessagesEditForm({ isOpen, setIsOpen, message }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, message: Message }) {
    const params = useParams();
    const appId = params.appId as string;

    const initialState: MessageState = { message: null, errors: {}, messageData: null }

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: MessageState, _formData: FormData) => {
            try {
                const newState = await editMessage(appId, prevState, _formData);

                if (newState.message === 'success' && newState.messageData) {
                    toast.success("Message Edited successfully!");
                }
                return newState
            } catch {
                toast.error("Failed to edit Message. Please try again.");
                return initialState
            } finally {
                setIsOpen(false)
            }

        }, initialState)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
            {/* Compose Form */}
            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-xl font-bold mb-6 dark:text-white">Edit Message</h2>
                <form action={formAction} className="space-y-4">
                    <div>
                        <select
                            name="type"
                            defaultValue={message.type || ''}
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Message Type</option>
                            {messageTypes.map(opt => (
                                <option key={opt.key} value={opt.value}>
                                    {capitalizeFirstLetter(opt.value)}
                                </option>
                            ))}
                        </select>
                        {state?.errors?.type &&
                            state.errors.type.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <input
                            name='title'
                            defaultValue={message.title}
                            placeholder="Message title"
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        {state?.errors?.title &&
                            state.errors.title.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <textarea
                            name='content'
                            defaultValue={message.content}
                            rows={4}
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Message content..."
                        />
                        {state?.errors?.content &&
                            state.errors.content.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <Loader />
                                sending...
                            </div>
                        ) : (
                            'Send Question'
                        )}
                    </button>
                </form>
            </ModalDialog>

        </motion.div>
    )
}