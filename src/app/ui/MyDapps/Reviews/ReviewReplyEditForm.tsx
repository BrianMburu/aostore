'use client'

import Loader from "../../Loader"
import { ReplyState, updateReply } from "@/lib/reviewActions"
import { useActionState, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import ModalDialog from "../../MyDapps/ModalDialog"
import { EditButton } from "../../EditButton"
import { AnimatedButton } from "../../animations/AnimatedButton"
import { Reply } from "@/types/reply"
import { useRouter } from "next/navigation"
import { useRank } from "@/context/RankContext"

const initialState: ReplyState = { message: null, errors: {}, reply: null };

export function DappReplyEditForm({ appId, reviewId, reply }: { appId: string, reviewId: string, reply: Reply }) {
    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter();
    const { rank } = useRank()

    // Local state for the request details to support optimistic updates
    const [localRequest, setLocalRequest] = useState<{ description: string }>({ description: reply.description });

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ReplyState, _formData: FormData) => {
            const formValues = Object.fromEntries(_formData.entries());

            // Capture form values for the optimistic update
            const previousRequest = { ...localRequest };

            // Optimistically update local request state
            const updatedRequest = { ...localRequest, ...formValues };
            setLocalRequest(updatedRequest);

            try {
                const newState = await updateReply(appId, reviewId, reply.replyId, rank, prevState, _formData);

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message === 'success') {
                    setIsOpen(false);
                    router.refresh();
                    toast.success('Reply updated successfully!');
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                toast.error(`Reply update failed.`);
                console.error("Edit request failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <>
            {/* Floating Action Button */}
            <EditButton toolTip="Edit Reply" onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Update Reply</h3>
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
            </ModalDialog>
        </>
    )
}