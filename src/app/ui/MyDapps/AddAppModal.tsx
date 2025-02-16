// components/my-dapps/AddDAppModal.tsx
'use client';

import React, { useState, useActionState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import ModalDialog from './ModalDialog';
import { projectTypes } from '@/types/dapp';

import Loader from '../Loader';
import toast from 'react-hot-toast';
import { State, createDapp, createTemporaryDApp, dappSchema } from '@/lib/mydappActions';
import { AppData } from '@/types/dapp';
import { FloatingActionButton } from './AddAppFloatingButton';

interface AddDAppModalProps {
    addOptimisticDApp: (data: AppData) => void;
    setDapps: React.Dispatch<React.SetStateAction<AppData[]>>
}

export const AddDAppModal = ({ addOptimisticDApp, setDapps }: AddDAppModalProps) => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const [isOpen, setIsOpen] = useState(false);
    const initialState: State = { message: null, errors: {} };

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
        async (prevState: State, _formData: FormData) => {
            try {
                const tempApp = createTemporaryDApp(_formData);

                const validatedFields = dappSchema.safeParse(tempApp);

                if (!validatedFields.success) {
                    return {
                        errors: validatedFields.error.flatten().fieldErrors,
                        message: 'Form has errors. Failed to save DApp.',
                    };
                }

                addOptimisticDApp(tempApp)

                // Call createDapp to submit the data to the server
                const newState = await createDapp(prevState, _formData);

                if (newState.message === 'success' && newState.dapp) {
                    // Close modal and show success message
                    setIsOpen(false);

                    // Update with actual server data
                    setDapps(prev => newState.dapp ? [newState.dapp, ...prev] : prev);

                    // clear page filters
                    clearFilters(['page'])

                    toast.success("DApp submitted successfully! It will be visible after verification.");
                }
                return newState;

            } catch {
                // Handle error and rollback
                toast.error("Failed to submit DApp. Please try again.");
                return prevState
            }


        }, initialState)

    // useEffect(() => {
    //     if (state.message === 'success' && state.dapp) {
    //         // setDapps(prev => state.dapp ? [state.dapp, ...prev] : prev);;
    //         setIsOpen(false);
    //         toast.success('DApp created successfully! It will be visible after verification.');
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [state.message, state.dapp]);

    return (
        <div>
            {/* Floating Action Button */}
            <FloatingActionButton onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <form action={formAction} className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Add New DApp
                    </h2>

                    <div>
                        <label className="text-gray-900 dark:text-white">DApp Name</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="appName"
                        />
                        {state?.errors?.appName &&
                            state.errors.appName.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">AppIconUrl URL</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="appIconUrl"
                        />
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Description</label>
                        <textarea
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="description"
                            rows={4}
                        />
                        {state?.errors?.description &&
                            state.errors.description.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Website URL</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="websiteUrl"
                        />
                        {state?.errors?.websiteUrl &&
                            state.errors.websiteUrl.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Twitter URL</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="twitterUrl"
                        />
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Discord URL</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="discordUrl"
                        />
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Cover URL</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="coverUrl"
                        />
                    </div>

                    <div className="flex space-x-2">
                        <div className="w-1/2">
                            <label className="text-gray-900 dark:text-white">Protocol</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-300"
                                name="protocol"
                            >
                                <option value="">Select Protocol</option>
                                <option value="aocomputer">AO Computer</option>
                                <option value="arweave">Arweave</option>
                            </select>
                            {state?.errors?.protocol &&
                                state.errors.protocol.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>

                        <div className="w-1/2">
                            <label className="text-gray-900 dark:text-white pb-2">Project Type</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-300"
                                name="projectType"
                            >
                                <option value="">Select Project Type</option>
                                {projectTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {state?.errors?.projectType &&
                                state.errors.projectType.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Company Name</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="companyName"
                        />
                        {state?.errors?.companyName &&
                            state.errors.companyName.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                    <div>
                        <label className="text-gray-900 dark:text-white">Banner URLs</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="bannerUrls"
                        />
                        {state?.errors?.bannerUrls &&
                            state.errors.bannerUrls.map((error: string) => (
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
                                'Submit for Verification'
                            )}
                        </button>
                    </div>
                </form>
            </ModalDialog>
        </div>
    );
};