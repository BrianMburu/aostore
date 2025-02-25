// components/my-dapps/AddDAppModal.tsx
'use client';

import React, { useState, useActionState } from 'react';
import { useSearchParams, usePathname, useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast';

// import { State, createDapp, createTemporaryDApp, dappSchema } from '@/lib/mydappActions';
import Loader from '../../Loader';
import ModalDialog from '../ModalDialog';
import { AirDropState, createAirDrop } from '@/lib/AirdropAction';
import { useAuth } from '@/context/AuthContext';
import { AddAirdropFloatingButton } from './AddAirDropFloatingButton';
import { getTimeZones } from '@/utils/airdrops';

export const AddAirDropForm = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Get appId from URL
    const params = useParams()
    const appId = params.appId as string;

    // Get userId from session
    const { user } = useAuth()

    const [isOpen, setIsOpen] = useState(false);
    const initialState: AirDropState = { message: null, errors: {} };

    const clearFilters = (filterNames: string[]) => {
        filterNames.map(
            (filtername: string) => {
                const params = new URLSearchParams(searchParams)
                //reset Page
                params.delete(filtername);

                replace(`${pathname}?${params.toString()}`);
            }
        )
    }

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: AirDropState, _formData: FormData) => {
            try {
                // Call createDapp to submit the data to the server
                const newState = await createAirDrop(user?.walletAddress || '', appId, prevState, _formData);

                if (newState.message === 'success' && newState.airdrop) {
                    // Close modal and show success message
                    setIsOpen(false);

                    // clear page filters
                    clearFilters(['page', 'search', 'status']);

                    toast.success("Airdrop submitted successfully! It will be visible after verification.");
                }
                return newState;

            } catch {
                // Handle error and rollback
                toast.error("Failed to submit Airdrop. Please try again.");
                return prevState
            }


        }, initialState)

    return (
        <div>
            {/* Floating Action Button */}
            <AddAirdropFloatingButton onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <form action={formAction} className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Add New Airdrop
                    </h2>

                    {/* Airdrop Title */}
                    <div>
                        <label htmlFor="title" className="text-gray-900 dark:text-white">
                            Airdrop Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.title &&
                            state.errors.title.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    {/* Airdrop TokenId */}
                    <div>
                        <label htmlFor="tokenId" className="text-gray-900 dark:text-white">
                            Token ID
                        </label>
                        <input
                            id="tokenId"
                            name="tokenId"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.tokenId &&
                            state.errors.tokenId.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    {/* Airdrop Amount */}
                    <div>
                        <label htmlFor="amount" className="text-gray-900 dark:text-white">
                            Airdrop Amount
                        </label>
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.amount &&
                            state.errors.amount.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.description &&
                            state.errors.description.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    {/* Expiry Time with Timepicker and Timezone Picker */}
                    <div>
                        <label htmlFor="expiryTime" className="text-gray-900 dark:text-white">
                            Expiry Time
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                id="expiryTime"
                                name="expiryTime"
                                type="datetime-local"
                                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            />
                            <select
                                name="timezone"
                                defaultValue="America/New_York"
                                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            >
                                {getTimeZones().map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {state?.errors?.expiryTime &&
                            state.errors.expiryTime.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                        {state?.errors?.timezone &&
                            state.errors.timezone.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    {/* Form Error */}
                    <div id="form-error" aria-live="polite" aria-atomic="true">
                        {state?.message && state.message !== "success" && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-gray-100 bg-gray-200 dark:bg-gray-500 rounded"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <Loader />
                                    Submitting ...
                                </div>
                            ) : (
                                "Submit for Verification"
                            )}
                        </button>
                    </div>
                </form>
            </ModalDialog>

        </div>
    );
};