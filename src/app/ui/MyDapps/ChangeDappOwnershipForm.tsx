'use client'

import { changeDappOwner, DappChangeOwnerState } from "@/lib/mydappActions";
import { useActionState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";

export const ChangeDappOwnershipForm = ({ appId }: { appId: string }) => {

    const initialState: DappChangeOwnerState = { message: null, errors: {} };


    const [state, formAction, isSubmitting] = useActionState(
        async (_prevState: DappChangeOwnerState, _formData: FormData) => {
            try {
                const newState: DappChangeOwnerState = await changeDappOwner(appId, _prevState, _formData);
                if (newState.message === 'success' && newState.newOwnerId) {

                    toast.success("Ownership updated successfully!");
                }
                return newState

            } catch {
                toast.error("Failed to update DApp. Please try again.");
                return initialState
            }
        }, initialState);

    return (
        <form action={formAction} className="space-y-6">

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Change DApp Ownership
            </h2>
            <div>
                <label className="text-gray-900 dark:text-white">New Owner ID</label>
                <input
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                    name="newOwnerId"
                    placeholder="Enter New Owner ID"
                />
                {state?.errors?.newOwnerId &&
                    state.errors.newOwnerId.map((error: string) => (
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
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <Loader />
                            Changing Ownership ...
                        </div>
                    ) : (
                        'Change Ownership'
                    )}
                </button>
            </div>
        </form>
    )
}