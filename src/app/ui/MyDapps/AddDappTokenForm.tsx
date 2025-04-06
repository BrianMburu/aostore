'use client'
import { useActionState, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { addDappToken, DappTokenState } from "@/lib/mydappActions";
import { useRouter } from "next/navigation";


export const AddDappTokenForm = ({ appId }: { appId: string }) => {
    const initialState: DappTokenState = { message: null, errors: {} };
    const router = useRouter()

    const defaultFormValues = { tokenId: "", tokenName: "", tokenTicker: "", tokenDenomination: "", logo: "" };

    // Local state for the request details to support optimistic updates
    const [localRequest, setLocalRequest] = useState<
        { tokenId: string, tokenName: string, tokenTicker: string, tokenDenomination: string, logo: string }>(
            defaultFormValues);

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: DappTokenState, _formData: FormData) => {
            // Capture form values for the optimistic update
            const formValues = Object.fromEntries(_formData.entries());

            const previousRequest = { ...localRequest };

            // Optimistically update local request state
            const updatedRequest = { ...localRequest, ...formValues };
            setLocalRequest(updatedRequest);

            try {
                const newState: DappTokenState = await addDappToken(appId, prevState, _formData);

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message === 'success') {
                    setLocalRequest(defaultFormValues)
                    toast.success("DApp Token added successfully!");
                    router.refresh();
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                toast.error("Failed to add DApp Token. Please try again.");
                console.error("Edit request failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <form action={formAction} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Add DApp Token
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <label className="text-gray-900 dark:text-white">Token ID</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="tokenId"
                        defaultValue={localRequest.tokenId}
                        placeholder="Enter Token ID"
                    />
                    {state?.errors?.tokenId &&
                        state.errors.tokenId.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
                <div>
                    <label className="text-gray-900 dark:text-white">Token Name</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="tokenName"
                        defaultValue={localRequest.tokenName}
                        placeholder="Enter Token Name"
                    />
                    {state?.errors?.tokenName &&
                        state.errors.tokenName.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
                <div>
                    <label className="text-gray-900 dark:text-white">Token Ticker</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="tokenTicker"
                        defaultValue={localRequest.tokenTicker}
                        placeholder="Enter Token Ticker"
                    />
                    {state?.errors?.tokenTicker &&
                        state.errors.tokenTicker.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
                <div>
                    <label className="text-gray-900 dark:text-white">Token Denomination</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="tokenDenomination"
                        type="number"
                        defaultValue={localRequest.tokenDenomination}
                        placeholder="Enter Token Denomination"
                    />
                    {state?.errors?.tokenDenomination &&
                        state.errors.tokenDenomination.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
                <div>
                    <label className="text-gray-900 dark:text-white">Token Logo URL ID</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="logo"
                        defaultValue={localRequest.logo}
                        placeholder="Enter Token Logo URL"
                    />
                    {state?.errors?.logo &&
                        state.errors.logo.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
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
                            Adding Token ...
                        </div>
                    ) : (
                        'Add Token'
                    )}
                </button>
            </div>
        </form>
    )
}
