'use client'

import { useActionState } from 'react';
import toast from 'react-hot-toast';
import { postForumQuestion, ForumPostState } from '@/lib/forumActions';
import { ForumPost, updateOptions } from '@/types/forum';
import Loader from '../Loader';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { AnimatedButton } from '../animations/AnimatedButton';

export default function ForumQuestionForm({ setPosts }: { setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>> }) {
    const initialState: ForumPostState = { message: null, errors: {}, post: null }
    const { user } = useAuth();
    const params = useParams();
    const appId = params.appId as string;

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ForumPostState, _formData: FormData) => {
            try {
                const newState = await postForumQuestion(appId, user?.walletAddress || null, prevState, _formData);

                if (newState.message === 'success' && newState.post) {
                    setPosts(prev => state.post ? [state.post, ...prev] : prev);
                    toast.success('Support request submitted successfully!');
                }

                return newState

            } catch {
                toast.error("Failed to submit Post. Please try again.");
                return initialState
            }

        }, initialState)

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Ask a Question
            </h2>
            <form action={formAction} className="space-y-4">
                <input
                    name="title"
                    placeholder="Question title"
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
                    name="content"
                    placeholder="Detailed description"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-32"
                    aria-describedby="forum-content-error"
                />
                <span id="forum-content-error" aria-live="polite" aria-atomic="true">
                    {state?.errors?.content &&
                        state.errors.content.map((error: string) => (
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