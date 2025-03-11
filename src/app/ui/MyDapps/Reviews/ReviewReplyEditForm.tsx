'use client'

import Loader from "../../Loader"
import { ReplyState, updateReply } from "@/lib/reviewActions"
import { useActionState, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Reply } from "@/types/review"
import ModalDialog from "../../MyDapps/ModalDialog"
import { EditButton } from "../../EditButton"
import { AnimatedButton } from "../../animations/AnimatedButton"


export function DappReplyEditForm({ reply }: { reply: Reply }) {
    const [isOpen, setIsOpen] = useState(false)
    const initialState: ReplyState = { message: null, errors: {}, reply: null };

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ReplyState, _formData: FormData) => {
            const newState = await updateReply(reply.replyId, prevState, _formData)

            if (newState.message === 'success' && newState.reply) {
                setIsOpen(false);
                toast.success('Reply updated successfully!');
            }

            return newState
        }

        , initialState);

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
                                name="comment"
                                defaultValue={reply.comment}
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
            </ModalDialog>
        </>
    )
}