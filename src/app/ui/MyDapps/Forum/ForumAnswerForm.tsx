'use client'

import { useAuth } from "@/context/AuthContext";
import { ForumReplyState, sendAnswer } from "@/lib/forumActions";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { AnimatedButton } from "../../animations/AnimatedButton";
import Loader from "../../Loader";
import { motion } from "framer-motion";
import { useRank } from "@/context/RankContext";
import { useRouter } from "next/navigation";

export function ForumAnswerForm({ postId, appId }: { postId: string, appId: string }) {
    const { user } = useAuth();
    const { rank } = useRank();
    const router = useRouter();

    const initialState: ForumReplyState = { message: null, errors: {}, reply: null }

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ForumReplyState, _formData: FormData) => {
            try {
                const newState = await sendAnswer(appId, postId, user, rank, prevState, _formData);

                if (newState.message === 'success' && newState.reply) {
                    router.refresh()
                    toast.success("Reply posted successfully!");
                }

                return newState

            } catch {
                toast.error("Failed to submit Post. Please try again.");
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
                        name="description"
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
                                posting...
                            </div>
                        ) : (
                            'Post Answer'
                        )}
                    </AnimatedButton>
                </div>
            </form>
        </motion.div>
    )
}