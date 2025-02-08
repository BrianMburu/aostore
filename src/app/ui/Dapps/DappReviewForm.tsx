'use client';

import { useState, useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { StarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { Review } from '@/types/dapp';
import Loader from '../Loader';
import { State, sendReview } from '@/lib/reviewActions';


export default function DappReviewForm({ setReviews }: { setReviews: React.Dispatch<React.SetStateAction<Review[]>> }) {
    const initialState: State = { message: null, errors: {}, review: null };
    const [state, formAction, isSubmitting] = useActionState(sendReview, initialState);
    const [selectedRating, setSelectedRating] = useState(0);

    useEffect(() => {
        if (state.message === 'success' && state.review) {
            setReviews(prev => state.review ? [state.review, ...prev] : prev);
            toast.success('Support request submitted successfully!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.message]);

    return (
        <div>
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
                        />
                        <div id='sp-request-error' aria-live="polite" aria-atomic="true">
                            {state?.errors?.rating &&
                                state.errors.rating.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>


                    <textarea
                        name="comment"
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Share your experience..."
                        rows={4}
                    />
                    <div id='sp-request-error' aria-live="polite" aria-atomic="true">
                        {state?.errors?.comment &&
                            state.errors.comment.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
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
        </div>
    )
}


// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// const reviewSchema = z.object({
//     comment: z.string().min(10, 'Comment must be at least 10 characters'),
//     rating: z.number().min(1).max(5),
// });

// type ReviewFormData = z.infer<typeof reviewSchema>;

// export default function DappReviewForm({ setReviews }: { setReviews: React.Dispatch<React.SetStateAction<Review[]>> }) {
//     const [isSubmittingReview, setIsSubmittingReview] = useState(false);

//     const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ReviewFormData>({
//         resolver: zodResolver(reviewSchema),
//     });

//     const onSubmitReview = async (data: ReviewFormData) => {
//         setIsSubmittingReview(true);
//         try {
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             const newReview: Review = {
//                 profileUrl: 'https://picsum.photos/40',
//                 reviewId: `rev-${Date.now()}`,
//                 username: 'Current User',
//                 comment: data.comment,
//                 rating: data.rating,
//                 timestamp: Date.now(),
//                 upvotes: 0,
//                 downvotes: 0,
//                 helpfulVotes: 0,
//                 unhelpfulVotes: 0,
//                 voters: [],
//                 replies: [],
//             };
//             setReviews(prev => [newReview, ...prev]);
//             reset();
//             toast.success('Review submitted successfully!');
//         } catch {
//             toast.error('Failed to submit review');
//         } finally {
//             setIsSubmittingReview(false);
//         }
//     };

//     return (
//         <div>
//             {/* Review Form */}
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
//             >
//                 <h3 className="text-xl font-semibold mb-4 dark:text-white">Write a Review</h3>
//                 <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
//                     <div className="flex items-center gap-2">
//                         {[1, 2, 3, 4, 5].map((rating) => (
//                             <button
//                                 type="button"
//                                 key={rating}
//                                 onClick={() => setValue('rating', rating)}
//                                 className={`h-8 w-8 ${rating <= (watch('rating') || 0) ? 'text-yellow-400' : 'text-gray-300'
//                                     }`}
//                             >
//                                 <StarIcon />
//                             </button>
//                         ))}
//                         {errors.rating?.message && typeof errors.rating.message === 'string' && (
//                             <p className="text-red-500 text-sm">{errors.rating.message}</p>
//                         )}
//                     </div>

//                     <textarea
//                         {...register('comment')}
//                         className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
//                         placeholder="Share your experience..."
//                         rows={4}
//                     />
//                     {errors.comment && typeof errors.comment.message === 'string' &&
//                         <p className="text-red-500 text-sm">{errors.comment.message}</p>}

//                     {/* Submit Button with Loader */}
//                     <button
//                         type="submit"
//                         disabled={isSubmittingReview}
//                         className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
//                     >
//                         {isSubmittingReview ? (
//                             <div className="flex items-center justify-center">
//                                 <Loader />
//                                 Submitting...
//                             </div>
//                         ) : (
//                             'Submit Review'
//                         )}
//                     </button>
//                 </form>
//             </motion.div>
//         </div>
//     )
// }