'use client'

import { useAuth } from "@/context/AuthContext";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { AnimatedButton } from "../../animations/AnimatedButton";
import Loader from "../../Loader";
import { motion } from "framer-motion";
import { useRank } from "@/context/RankContext";
import { sendReply, TaskReplyState } from "@/lib/taskAction";
import ModalDialog from "../../MyDapps/ModalDialog";

export function TaskReplyForm({ taskId, appId, showForm, onClose, onParticipate }:
    { taskId: string, appId: string, showForm: boolean, onClose: () => void, onParticipate: () => void }) {
    const { user } = useAuth();
    const { rank } = useRank();

    const initialState: TaskReplyState = { message: null, errors: {}, reply: null }

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: TaskReplyState, _formData: FormData) => {
            try {
                const newState = await sendReply(appId, taskId, user, rank, prevState, _formData);

                if (newState.message === 'success' && newState.reply) {
                    onParticipate();
                    toast.success("Reply posted successfully!");
                    onClose();
                }

                return newState

            } catch {
                toast.error("Failed to submit Post. Please try again.");
                return initialState
            }

        }, initialState)

    return (
        <ModalDialog isOpen={showForm} onClose={onClose}>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Participation Form</h3>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-6"
            >
                <form action={formAction} className="space-y-2 max-w-lg">
                    <div>
                        <label htmlFor="title" className="text-gray-900 dark:text-white">
                            Task URL
                        </label>
                        <input
                            name="url"
                            type="text"
                            placeholder="Enter Task URL"
                            className="w-full p-2 rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.url &&
                            state.errors.url.map((error: string) => (
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
                                    sending...
                                </div>
                            ) : (
                                'send solution'
                            )}
                        </AnimatedButton>
                    </div>
                </form>
            </motion.div>
        </ModalDialog>
    )
}
