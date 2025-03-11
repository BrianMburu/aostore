'use client'

import Loader from "../../Loader"
import { ReviewState, updateReview } from "@/lib/reviewActions"
import { useActionState, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Review } from "@/types/review"
import { StarIcon } from "lucide-react"
import ModalDialog from "../../MyDapps/ModalDialog"
import { EditButton } from "../../EditButton"
import { AnimatedButton } from "../../animations/AnimatedButton"


export function DappReviewEditForm({ review }: { review: Review }) {
    const [isOpen, setIsOpen] = useState(false)
    const initialState: ReviewState = { message: null, errors: {}, review: null };

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ReviewState, _formData: FormData) => {
            const newState = await updateReview(review.reviewId, prevState, _formData)

            if (newState.message === 'success' && newState.review) {
                setIsOpen(false);
                toast.success('Review updated successfully!');
            }

            return newState
        }

        , initialState);
    const [selectedRating, setSelectedRating] = useState(review.rating);

    return (
        <>
            {/* Floating Action Button */}
            <EditButton toolTip="Edit Review" onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>

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
                            defaultValue={review.comment}
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
                        <AnimatedButton
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
                        </AnimatedButton>
                    </form>
                </motion.div>
            </ModalDialog>
        </>
    )
}