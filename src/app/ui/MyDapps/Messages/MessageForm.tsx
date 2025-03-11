// app/mydapps/[appId]/messages/page.tsx
'use client'
import { MessageState, sendMessage } from '@/lib/messageActions'
import { messageTypes } from '@/types/message'
import { useParams } from "next/navigation";
import { useActionState } from 'react'
import Loader from '../../Loader'
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { capitalizeFirstLetter } from '@/utils/message';

export default function MessagesForm() {
    const params = useParams();
    const appId = params.appId as string;

    const initialState: MessageState = { message: null, errors: {}, messageData: null }

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: MessageState, _formData: FormData) => {
            try {
                const newState = await sendMessage(appId, prevState, _formData);

                if (newState.message === 'success' && newState.messageData) {
                    toast.success("Message sent successfully!");
                }
                return newState
            } catch {
                toast.error("Failed to send Message. Please try again.");
                return initialState
            }

        }, initialState)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8"
        >
            {/* Compose Form */}
            <h2 className="text-xl font-bold mb-6 dark:text-white">New Message</h2>
            <form action={formAction} className="space-y-4">
                <div>
                    <select
                        name="type"
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
        </motion.div>
    )
}