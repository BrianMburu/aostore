'use client'

import { useActionState, useState } from "react"
import { motion } from "framer-motion";
import ModalDialog from "../../MyDapps/ModalDialog";
import Loader from "../../Loader";
import { EditButton } from "../../EditButton";
import toast from "react-hot-toast";
import { BugReport, FeatureRequest } from "@/types/support";
import { FeatureRequestState, updateSupportRequest } from "@/lib/supportActions";
import { AnimatedButton } from "../../animations/AnimatedButton";

export function DappFeatureRequestEditForm({ request }: { request: FeatureRequest | BugReport }) {
    const [isOpen, setIsOpen] = useState(false)
    const initialState: FeatureRequestState = { message: null, errors: {}, request: null };

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: FeatureRequestState, _formData: FormData) => {
            const newState = await updateSupportRequest(request.id, prevState, _formData)

            if (newState.message === 'success' && newState.request) {
                setIsOpen(false);
                toast.success('Request updated successfully!');
            }

            return newState
        }
        , initialState);


    return (
        <>
            {/* Floating Action Button */}
            <EditButton toolTip="Edit Request" onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Edit Request</h3>
                    <form action={formAction} className="space-y-3" aria-describedby='form-error'>
                        <input
                            name="type"
                            value={request.type}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            aria-describedby='sp-request-error'
                            hidden readOnly
                        />
                        <div id='sp-request-error' aria-live="polite" aria-atomic="true">
                            {state?.errors?.type &&
                                state.errors.type.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>

                        <input
                            name="title"
                            defaultValue={request.title}
                            placeholder={`Title for your ${request.type} request`}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            aria-describedby='sp-title-error'
                        />
                        <div id='sp-title-error' aria-live="polite" aria-atomic="true">
                            {state?.errors?.title &&
                                state.errors.title.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>

                        <textarea
                            name="description"
                            defaultValue={request.description}
                            placeholder="Request description"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            aria-describedby='sp-message-error'
                            rows={3}
                        />
                        <div id='sp-message-error' aria-live="polite" aria-atomic="true">
                            {state?.errors?.description &&
                                state.errors.description.map((error: string) => (
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

                        <AnimatedButton type="submit" disabled={isSubmitting} className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50">
                            {isSubmitting ?
                                <div className="flex items-center justify-center">
                                    <Loader />
                                    Submitting...
                                </div> :
                                "Update Request"
                            }
                        </AnimatedButton>
                    </form>
                </motion.div>
            </ModalDialog>
        </>
    )
}