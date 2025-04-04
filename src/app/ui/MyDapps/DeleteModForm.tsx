'use client'
import { useActionState, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { AnimatedButton } from "../animations/AnimatedButton"
import ModalDialog from "./ModalDialog"
import Loader from "../Loader"
import { DappModeratorState, deleteModerator } from "@/lib/mydappActions"

const initialState: DappModeratorState = { message: null, errors: {} };

export function DeleteModForm({ appId, accessPage, refreshMods }: { appId: string, accessPage: string, refreshMods: () => void }) {
    const [isOpen, setIsOpen] = useState(false)

    // Local state for the request details to support optimistic updates
    const [localRequest, setLocalRequest] = useState<{ modId: string }>({ modId: "" });

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: DappModeratorState, _formData: FormData) => {
            const formValues = Object.fromEntries(_formData.entries());

            // Capture form values for the optimistic update
            const previousRequest = { ...localRequest };

            // Optimistically update local request state
            const updatedRequest = { ...localRequest, ...formValues };
            setLocalRequest(updatedRequest);

            try {
                const newState = await deleteModerator(appId, accessPage, prevState, _formData);

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message === 'success') {
                    setIsOpen(false);
                    refreshMods();
                    toast.success('Delete Moderator successfully!');
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                toast.error(`Delete Moderator failed! Please try again.`);
                console.error("Delete Moderator failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <>
            {/* Floating Action Button */}
            <AnimatedButton
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => setIsOpen(true)}>
                Delete Mod
            </AnimatedButton>

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Delete Moderator</h3>
                    <form action={formAction} className="space-y-2 max-w-lg">
                        <div>
                            <input
                                name="modId"
                                defaultValue={localRequest.modId}
                                placeholder="Enter moderator ID to delete"
                                className="w-full p-2 rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                            {state?.errors?.modId &&
                                state.errors.modId.map((error: string) => (
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
                                        Deleting...
                                    </div>
                                ) : (
                                    'Delete Moderator'
                                )}
                            </AnimatedButton>
                        </div>
                    </form>
                </motion.div>
            </ModalDialog>
        </>
    )
}