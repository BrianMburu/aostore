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
import { useRank } from "@/context/RankContext"

const initialState: ReviewState = { message: null, errors: {}, review: null };

export function DappReviewEditForm({ appId, review, refreshReviews }: { appId: string, review: Review, refreshReviews: () => void }) {
    const [isOpen, setIsOpen] = useState(false)

    const { rank } = useRank();

    // Local state for the request details to support optimistic updates
    const [localReview, setLocalReview] = useState<Review>(review);

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: ReviewState, _formData: FormData) => {
            // Capture form values for the optimistic update
            const newTitle = _formData.get("title") as string;
            const newDescription = _formData.get("description") as string;
            const previousRequest = { ...localReview };

            // Optimistically update local request state
            const updatedRequest = { ...localReview, title: newTitle, description: newDescription };
            setLocalReview(updatedRequest);

            try {
                const newState = await updateReview(appId, review.reviewId, rank, prevState, _formData);

                // If the server returns an updated request, update localReview accordingly.
                if (newState.message === 'success') {
                    toast.success(`Review submitted successfully!`);

                    // setLocalReview(newState.review);
                    setIsOpen(false)
                    refreshReviews()
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalReview(previousRequest);
                toast.error(`Review submission failed.`);
                console.error("Edit request failed:", error);
                return initialState;
            }
        },
        initialState
    );

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
                                    onClick={() => setLocalReview(prev => ({ ...prev, rating }))}
                                    className={`h-8 w-8 ${rating <= localReview.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                >
                                    <StarIcon />
                                </button>
                            ))}
                            <input
                                type="hidden"
                                name="rating"
                                value={localReview.rating}
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
                            name="description"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            placeholder="Share your experience..."
                            rows={4}
                            defaultValue={localReview.description}
                            aria-describedby='dapp-comment-error'
                        />
                        <span id='dapp-comment-error' aria-live="polite" aria-atomic="true">
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