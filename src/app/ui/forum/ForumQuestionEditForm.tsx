'use client'

import { useActionState, useState } from "react"
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { EditButton } from "../EditButton";
import ModalDialog from "../MyDapps/ModalDialog";
import { AnimatedButton } from "../animations/AnimatedButton";
import { ForumPost, updateOptions } from "@/types/forum";
import { editForumQuestion, ForumPostState } from "@/lib/forumActions";
import Loader from "../Loader";
import { useRank } from "@/context/RankContext";


export function ForumEditQuestionForm({ post, appId, onEdit }: { appId: string, post: ForumPost, onEdit: () => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const initialState: ForumPostState = { message: null, errors: {}, post: null };
    const { rank } = useRank();

    // Local state for the request details to support optimistic updates
    const [localRequest, setLocalRequest] = useState<ForumPost>(post);

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ForumPostState, _formData: FormData) => {
            const formValues = Object.fromEntries(_formData.entries());
            // Capture form values for the optimistic update
            const previousRequest = { ...localRequest };

            // Optimistically update local request state
            const updatedRequest = { ...localRequest, ...formValues };
            setLocalRequest(updatedRequest);

            try {
                const newState = await editForumQuestion(appId, post.devForumId, rank, prevState, _formData);

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message === 'success') {
                    setLocalRequest(post);
                    setIsOpen(false);
                    onEdit();
                    toast.success('ForumPost updated successfully!');
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                console.error("Edit request failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <>
            {/* Floating Action Button */}
            <EditButton toolTip="Edit Question" onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Edit Forum Question</h3>
                    <form action={formAction} className="space-y-4">
                        <input
                            name="title"
                            placeholder="Question title"
                            defaultValue={post.title}
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            aria-describedby="forum-title-error"
                        />
                        <span id="forum-title-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.title &&
                                state.errors.title.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </span>

                        <select
                            name="topic"
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            aria-describedby="forum-topic-error"
                            defaultValue={post.topic}
                        >
                            <option value="">Select Topic</option>
                            {updateOptions.map(opt => (
                                <option key={opt.key} value={opt.value}>
                                    {opt.value}
                                </option>
                            ))}
                        </select>
                        <span id="forum-topic-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.topic &&
                                state.errors.topic.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </span>

                        <textarea
                            name="description"
                            placeholder="Detailed description"
                            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-32"
                            aria-describedby="forum-content-error"
                            defaultValue={post.description}
                        />
                        <span id="forum-content-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.description &&
                                state.errors.description.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </span>

                        {/* Form Error */}
                        <div id='form-error' aria-live="polite" aria-atomic="true">
                            {state?.message && state?.message != "success" &&
                                <p className="text-sm text-red-500">
                                    {state.message}
                                </p>
                            }
                        </div>

                        {/* Submit Button with Loader */}
                        <AnimatedButton
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <Loader />
                                    Editing...
                                </div>
                            ) : (
                                'Edit Question'
                            )}
                        </AnimatedButton>
                    </form>
                </motion.div>
            </ModalDialog>
        </>
    )
}