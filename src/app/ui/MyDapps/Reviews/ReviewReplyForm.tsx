'use client'

import { useActionState } from 'react'
import { sendReply } from '@/lib/reviewActions'
import { ReplyState } from '@/lib/reviewActions'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import Loader from '../../Loader'
import { motion } from 'framer-motion'
import { AnimatedButton } from '../../animations/AnimatedButton'

export function ReviewReplyForm({ reviewId }: { reviewId: string }) {
    const { user } = useAuth();

    const initialState: ReplyState = { message: null, errors: {}, reply: null }

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ReplyState, _formData: FormData) => {
            try {
                const newState = await sendReply(reviewId, user!, prevState, _formData);

                if (newState.message === 'success' && newState.reply) {
                    toast.success("Reply posted successfully!");
                }

                return newState
            } catch {

                toast.error("Failed to update DApp. Please try again.");
                return initialState
            }

        }, initialState)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 border-t dark:border-gray-700 pt-6"
        >
            <form action={formAction} className="space-y-2 max-w-lg">
                <div>
                    <textarea
                        name="comment"
                        placeholder="Write a reply..."
                        className="w-full p-2 rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        rows={2}
                    />
                    {state?.errors?.comment &&
                        state.errors.comment.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
                {/* Form Error */}
                <div id='form-error' aria-live="polite" aria-atomic="true">
                    {state?.message && state?.message != "success" &&
                        <p className="text-sm text-red-500">
                            {state.message}
                        </p>
                    }
                </div>
                <div className="flex justify-end gap-4">
                    <AnimatedButton
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <Loader />
                                Posting...
                            </div>
                        ) : (
                            'Post Reply'
                        )}
                    </AnimatedButton>
                </div>
            </form>
        </motion.div>
    )
}