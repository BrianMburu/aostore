'use client'

import { useActionState, useState } from "react"
import { motion } from "framer-motion";
import ModalDialog from "../../MyDapps/ModalDialog";
import Loader from "../../Loader";
import { EditButton } from "../../EditButton";
import toast from "react-hot-toast";
import { BugReport, FeatureRequest } from "@/types/support";
import { editBugReport, editFeatureRequest, FeatureRequestState } from "@/lib/supportActions";
import { AnimatedButton } from "../../animations/AnimatedButton";
import { useRank } from "@/context/RankContext";
import { useRouter } from "next/navigation";

const initialState: FeatureRequestState = { message: null, errors: {}, request: null };

interface DappFeatureRequestEditFormProps {
    request: FeatureRequest | BugReport;
    appId: string;
    requestType: string; // ideally: 'feature' | 'bug'
}

export function DappFeatureRequestEditForm({ request, requestType, appId }: DappFeatureRequestEditFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { rank } = useRank();
    const router = useRouter();

    // Local state for the request details to support optimistic updates
    const [localRequest, setLocalRequest] = useState<FeatureRequest | BugReport>(request);

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: FeatureRequestState, _formData: FormData) => {
            // Capture form values for the optimistic update
            const formValues = Object.fromEntries(_formData.entries());
            const previousRequest = { ...localRequest };

            // Optimistically update local request state
            const updatedRequest = { ...localRequest, ...formValues };
            setLocalRequest(updatedRequest);

            try {
                let newState: FeatureRequestState;
                if (requestType === "feature" || requestType === "") {
                    newState = await editFeatureRequest(appId, request.requestId, rank, prevState, _formData);
                } else {
                    newState = await editBugReport(appId, request.requestId, rank, prevState, _formData);
                }

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message == "success" && newState.request) {
                    setLocalRequest(newState.request);
                    toast.success(`${requestType === "feature" ? "Support request" : "Bug report"} submitted successfully!`);
                    router.refresh();
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                toast.error(`${requestType === "feature" ? "Support request" : "Bug report"} submission failed.`);
                console.error("Edit request failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <>
            <EditButton toolTip="Edit Request" onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Edit Request</h3>
                    <form action={formAction} className="space-y-3" aria-describedby="form-error">
                        <input
                            name="type"
                            value={requestType}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            aria-describedby="sp-request-error"
                            hidden
                            readOnly
                        />
                        <div id="sp-request-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.type &&
                                state.errors.type.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>

                        <input
                            name="title"
                            defaultValue={localRequest.title}
                            placeholder={`Title for your ${localRequest.type} request`}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            aria-describedby="sp-title-error"
                        />
                        <div id="sp-title-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.title &&
                                state.errors.title.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>

                        <textarea
                            name="description"
                            defaultValue={localRequest.description}
                            placeholder="Request description"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            aria-describedby="sp-message-error"
                            rows={3}
                        />
                        <div id="sp-message-error" aria-live="polite" aria-atomic="true">
                            {state?.errors?.description &&
                                state.errors.description.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>

                        {/* Form Error */}
                        <div id="form-error" aria-live="polite" aria-atomic="true">
                            {state?.message && state?.message !== "success" && (
                                <p className="text-sm text-red-500">{state.message}</p>
                            )}
                        </div>

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
                                "Update Request"
                            )}
                        </AnimatedButton>
                    </form>
                </motion.div>
            </ModalDialog>
        </>
    );
}