'use client'

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loader from '../../Loader';
import { motion } from 'framer-motion';
import { AnimatedButton } from '../../animations/AnimatedButton';
import { Reply } from '@/types/reply';
import { editBugReportReply, editFeatureRequestReply, FeatureRequestReplyState } from '@/lib/supportActions';
import { EditButton } from '../../EditButton';
import ModalDialog from '../ModalDialog';

const initialState: FeatureRequestReplyState = { message: null, errors: {}, request: null };

export function FeatureRequestReplyEditForm({ appId, requestId, reply, requestType }: { appId: string, requestId: string, reply: Reply, requestType: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    // Local state for the reply to support optimistic updates
    const [localReply, setLocalReply] = useState<Reply>(reply);

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: FeatureRequestReplyState, _formData: FormData) => {
            // Capture the new description for the optimistic update
            const newDescription = _formData.get("description") as string;
            const previousReply = { ...localReply };

            // Optimistically update the local reply state
            const updatedReply = { ...localReply, description: newDescription };
            setLocalReply(updatedReply);

            try {
                let newState: FeatureRequestReplyState;
                if (requestType === "feature") {
                    newState = await editFeatureRequestReply(appId, requestId, reply.replyId, prevState, _formData);
                } else if (requestType === "bug") {
                    newState = await editBugReportReply(appId, requestId, reply.replyId, prevState, _formData);
                } else {
                    throw new Error("Invalid Request Type!");
                }

                // Update local state if a new reply is returned from the server
                if (newState.message === "success" && newState.request) {
                    setLocalReply(newState.request);
                    toast.success(`${requestType === "feature" ? "Support request" : "Bug report"} submitted successfully!`);
                    router.refresh();
                }


                return newState;
            } catch (error) {
                // Revert the optimistic update on error
                setLocalReply(previousReply);
                toast.error(`${requestType === "feature" ? "Support request" : "Bug report"} submission failed.`);
                console.error("Edit reply failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <>
            <EditButton toolTip="Edit Reply" onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Edit Reply</h3>
                    <form action={formAction} className="space-y-2 max-w-lg">
                        <div>
                            <textarea
                                name="description"
                                placeholder="Write a reply..."
                                defaultValue={localReply.description}
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

                        <div id="form-error" aria-live="polite" aria-atomic="true">
                            {state?.message && state?.message !== "success" && (
                                <p className="text-sm text-red-500">{state.message}</p>
                            )}
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
                                    'Edit Reply'
                                )}
                            </AnimatedButton>
                        </div>
                    </form>
                </motion.div>
            </ModalDialog>
        </>
    );
}
