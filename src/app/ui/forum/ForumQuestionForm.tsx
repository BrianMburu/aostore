'use client'

import { useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { postForumQuestion, State } from '@/lib/forumActions';
import { ForumPost, updateOptions } from '@/types/forum';
import Loader from '../Loader';
import { useAuth } from '@/context/AuthContext';

export default function ForumQuestionForm({ setPosts }: { setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>> }) {
    const initial_state: State = { message: null, errors: {}, post: null }
    const { user } = useAuth()

    const [state, formAction, isSubmitting] = useActionState(postForumQuestion.bind(null, user ? user.walletAddress : "no-user"), initial_state)

    useEffect(() => {
        if (state.message === 'success' && state.post) {
            setPosts(prev => state.post ? [state.post, ...prev] : prev);
            toast.success('Support request submitted successfully!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.message, state.post]);

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

                {/* Submit Button with Loader */}
                <button
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
                </button>
            </form>
        </div>

    )
}