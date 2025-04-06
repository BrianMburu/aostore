'use client'

import { useActionState, useState } from 'react';
import toast from 'react-hot-toast';
import { postForumQuestion, ForumPostState } from '@/lib/forumActions';
import { updateOptions } from '@/types/forum';
import Loader from '../Loader';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AnimatedButton } from '../animations/AnimatedButton';
import { useRank } from '@/context/RankContext';

const initialState: ForumPostState = { message: null, errors: {}, post: null }

export default function ForumQuestionForm({ appId }: { appId: string }) {
    const { user } = useAuth();
    const { rank } = useRank();
    const router = useRouter()

    // Local state for the request details to support optimistic updates
    const [localRequest, setLocalRequest] = useState<{ topic: string, title: string, description: string }>({ title: "", topic: "", description: "" });

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ForumPostState, _formData: FormData) => {
            const formValues = Object.fromEntries(_formData.entries());

            // Capture form values for the optimistic update
            const previousRequest = { ...localRequest };

            // Optimistically update local request state
            const updatedRequest = { ...localRequest, ...formValues };
            setLocalRequest(updatedRequest);

            try {
                const newState = await postForumQuestion(appId, user, rank, prevState, _formData);

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message === 'success') {
                    setLocalRequest({ title: "", topic: "", description: "" })

                    router.refresh();
                    toast.success('Support request submitted successfully!');
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                toast.error("Failed to submit Post. Please try again.");
                console.error("Edit request failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Ask a Question
            </h2>
            <form action={formAction} className="space-y-4">
                <input
                    name="title"
                    placeholder="Question title"
                    defaultValue={localRequest.title}
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
                    defaultValue={localRequest.topic}
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
                    defaultValue={localRequest.description}
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
                            Posting...
                        </div>
                    ) : (
                        'Post Question'
                    )}
                </AnimatedButton>
            </form>
        </div>

    )
}