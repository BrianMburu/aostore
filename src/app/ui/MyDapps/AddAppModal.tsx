// components/my-dapps/AddDAppModal.tsx
'use client';

import React, { useState, useActionState } from 'react';

import ModalDialog from './ModalDialog';
import { projectTypes } from '@/types/dapp';

import Loader from '../Loader';
import toast from 'react-hot-toast';
import { DappState, createDapp } from '@/lib/mydappActions';
import { AddDappFloatingButton } from './AddAppFloatingButton';
import { useAuth } from '@/context/AuthContext';
import { AnimatedButton } from '../animations/AnimatedButton';
import { MultiItemInput } from './MultiItemInput';

export const AddDAppModal = ({ onDappAdded }: { onDappAdded?: () => void }) => {

    const [bannerUrls, setBannerUrls] = useState<string[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const initialState: DappState = { message: null, errors: {} };
    const { user } = useAuth();

    const initialFormData = {
        appName: "", appIconUrl: "", description: "",
        websiteUrl: "", discordUrl: "", protocol: "",
        projectType: "", companyName: "", coverUrl: "",
        twitterUrl: "", bannerUrls: []
    }

    const [localRequest, setLocalRequest] = useState<{
        appName: string, appIconUrl: string, description: string,
        websiteUrl: string, discordUrl: string, protocol: string,
        projectType: string, companyName: string, coverUrl: string,
        twitterUrl: string
    }>(initialFormData);

    const [state, formAction, isSubmitting] = useActionState(
        async (_prevState: DappState, _formData: FormData) => {
            _formData.append('bannerUrls', bannerUrls.join(","));

            // Capture form values for the optimistic update
            const previousRequest = { ...localRequest };

            // Get form data as object and include bannerUrls
            const formValues = Object.fromEntries(_formData.entries());
            const updatedRequest = { ...localRequest, ...formValues };

            // Optimistically update local request state
            setLocalRequest(updatedRequest);

            try {
                const newState = await createDapp(user, _prevState, _formData);

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message === 'success') {
                    setLocalRequest(initialFormData);
                    setIsOpen(false);

                    // Trigger the callback to refresh the DApp list
                    if (onDappAdded) {
                        onDappAdded();
                    }

                    toast.success("DApp submitted successfully! It will be visible after verification.");
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                toast.error("Failed to submit DApp. Please try again.");
                console.error("Edit request failed:", error);
                return initialState;
            }
        },
        initialState);


    return (
        <div>
            {/* Floating Action Button */}
            <AddDappFloatingButton onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <form action={formAction} className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Add New DApp
                    </h2>

                    <div>
                        <label className="text-gray-900 dark:text-white">DApp Name</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="appName" defaultValue={localRequest.appName}
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
                            name="appIconUrl" defaultValue={localRequest.appIconUrl}
                        />
                        {state?.errors?.appIconUrl &&
                            state.errors.appIconUrl.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Description</label>
                        <textarea
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="description" defaultValue={localRequest.description}
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
                            name="websiteUrl" defaultValue={localRequest.websiteUrl}
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
                            name="twitterUrl" defaultValue={localRequest.twitterUrl}
                        />
                        {state?.errors?.twitterUrl &&
                            state.errors.twitterUrl.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Discord URL</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="discordUrl" defaultValue={localRequest.discordUrl}
                        />
                        {state?.errors?.discordUrl &&
                            state.errors.discordUrl.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label className="text-gray-900 dark:text-white">Cover URL</label>
                        <input
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                            name="coverUrl" defaultValue={localRequest.coverUrl}
                        />
                        {state?.errors?.websiteUrl &&
                            state.errors.websiteUrl.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div className="flex space-x-2">
                        <div className="w-1/2">
                            <label className="text-gray-900 dark:text-white">Protocol</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-300"
                                name="protocol" defaultValue={localRequest.protocol}
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
                                name="projectType" defaultValue={localRequest.projectType}
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
                            name="companyName" defaultValue={localRequest.companyName}
                        />
                        {state?.errors?.companyName &&
                            state.errors.companyName.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div >
                        <label className="text-gray-900 dark:text-white">Banner URLs</label>
                        <MultiItemInput
                            items={bannerUrls}
                            onChange={setBannerUrls}
                            placeholder="Enter banner urls separated by commas..."
                            inputClassName='focus:ring-0'
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
                        <AnimatedButton
                            type="button"
                            className="px-4 py-2 text-gray-100 bg-gray-200 dark:bg-gray-500 rounded"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </AnimatedButton>
                        <AnimatedButton
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <Loader />
                                    adding ...
                                </div>
                            ) : (
                                'Add New Dapp'
                            )}
                        </AnimatedButton>
                    </div>
                </form>
            </ModalDialog>
        </div>
    );
};