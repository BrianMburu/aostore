'use client';

import { useState, useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { StarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// import { Review } from '@/types/review';
import Loader from '../../Loader';
import { ReviewState, sendReview } from '@/lib/reviewActions';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';


export default function DappReviewForm() {
    const { user } = useAuth();
    const params = useParams();
    const appId = params.appId as string;

    const initialState: ReviewState = { message: null, errors: {}, review: null };
    const [state, formAction, isSubmitting] = useActionState(sendReview.bind(null, appId, user), initialState);
    const [selectedRating, setSelectedRating] = useState(0);

    useEffect(() => {
        if (state.message === 'success' && state.review) {
            // setReviews(prev => state.review ? [state.review, ...prev] : prev);
            toast.success('Support request submitted successfully!');
        }
    }, [state.message, state.review]);

    return (
        <>
            {/* Review Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Write a Review</h3>
                <form action={formAction} className="space-y-4">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                type="button"
                                key={rating}
                                onClick={() => setSelectedRating(rating)}
                                className={`h-8 w-8 ${rating <= selectedRating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                            >
                                <StarIcon />
                            </button>
                        ))}
                        <input
                            type="hidden"
                            name="rating"
                            value={selectedRating}
                            aria-describedby='dapp-rating-error'
                        />
                        <span id='dapp-rating-error' aria-live="polite" aria-atomic="true">
                            {state?.errors?.rating &&
                                state.errors.rating.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </span>
                    </div>


                    <textarea
                        name="comment"
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Share your experience..."
                        rows={4}
                        aria-describedby='dapp-comment-error'
                    />
                    <span id='dapp-comment-error' aria-live="polite" aria-atomic="true">
                        {state?.errors?.comment &&
                            state.errors.comment.map((error: string) => (
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
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <Loader />
                                Submitting...
                            </div>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </form>
            </motion.div>
        </>
    )
}