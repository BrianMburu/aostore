'use client'

import { useActionState, useState } from 'react'
import { sendReply } from '@/lib/reviewActions'
import { ReplyState } from '@/lib/reviewActions'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import Loader from '../../Loader'
import { motion } from 'framer-motion'
import { AnimatedButton } from '../../animations/AnimatedButton'
import { useRank } from '@/context/RankContext'
import { useRouter } from 'next/navigation'

const initialState: ReplyState = { message: null, errors: {}, reply: null }
export function ReviewReplyForm({ appId, reviewId }: { appId: string, reviewId: string }) {
    const { user } = useAuth();
    const { rank } = useRank();
    const router = useRouter();

    // Local state for the request details to support optimistic updates
    const [localRequest, setLocalRequest] = useState<{ description: string }>({ description: "" });

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ReplyState, _formData: FormData) => {
            const formValues = Object.fromEntries(_formData.entries());

            // Capture form values for the optimistic update
            const previousRequest = { ...localRequest };

            // Optimistically update local request state
            const updatedRequest = { ...localRequest, ...formValues };
            setLocalRequest(updatedRequest);

            try {
                const newState = await sendReply(appId, reviewId, user, rank, prevState, _formData);

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message === 'success') {
                    setLocalRequest({ description: "" })
                    toast.success('Reply posted successfully!');
                }
                router.refresh();
                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                toast.error(`"Failed to create Reply. Please try again later."`);
                console.error("Create reply failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 border-t dark:border-gray-700 pt-6"
        >
            <form action={formAction} className="space-y-2 max-w-lg">
                <div>
                    <textarea
                        name="description"
                        defaultValue={localRequest.description}
                        placeholder="Write a reply..."
                        className="w-full p-2 rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        rows={2}
                    />
                    {state?.errors?.description &&
                        state.errors.description.map((error: string) => (
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