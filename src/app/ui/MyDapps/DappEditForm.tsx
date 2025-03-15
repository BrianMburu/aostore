// components/DAppEditForm.tsx
'use client';
import { useActionState, useOptimistic } from 'react';
import { toast } from 'react-hot-toast';

import { AppData, ProjectType, projectTypes, Protocol } from '@/types/dapp';
import { dappSchema, State, updateDapp } from '@/lib/mydappActions';
import Loader from '../Loader';


export function DAppEditForm({ initialDapp }: {
    initialDapp: AppData,
}) {
    const [optimisticDApp, setOptimisticDApp] = useOptimistic(
        initialDapp,
        (state, newData: AppData) => ({ ...state, ...newData })
    )
    const initialState: State = { message: null, errors: {}, dapp: optimisticDApp };


    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: State, _formData: FormData) => {
            try {
                const tempData = {
                    appName: _formData.get('appName') as string,
                    appIconUrl: _formData.get('appIconUrl') as string,
                    description: _formData.get('description') as string,
                    websiteUrl: _formData.get('websiteUrl') as string,
                    twitterUrl: _formData.get('twitterUrl') as string,
                    discordUrl: _formData.get('discordUrl') as string,
                    coverUrl: _formData.get('coverUrl') as string,
                    protocol: _formData.get('protocol') as Protocol,
                    projectType: _formData.get('projectType') as ProjectType,
                    companyName: _formData.get('companyName') as string,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    bannerUrls: _formData.get('bannerUrls')?.toString().split(',').map(url => url.trim()) as Record<string, any>,
                };

                setOptimisticDApp(tempData as AppData)

                const validatedFields = dappSchema.safeParse(tempData);

                if (!validatedFields.success) {
                    return {
                        errors: validatedFields.error.flatten().fieldErrors,
                        message: 'Form has errors. Failed to save DApp.',
                        dapp: initialDapp
                    };
                }

                const newState: State = await updateDapp(initialDapp.appId, prevState, _formData);

                if (newState.message === 'success' && newState.dapp) {
                    // Update with actual server data
                    // setDapps(prev => newState.dapp ? [newState.dapp, ...prev] : prev);

                    toast.success("DApp updated successfully!");
                }

                return newState


            } catch {
                setOptimisticDApp(initialDapp);

                toast.error("Failed to update DApp. Please try again.");
                return initialState
            }

        }, initialState)

    // useEffect(() => {
    //     if (state.message === 'success' && state.dapp) {
    //         // setDapp({ ...dapp, ...state.dapp });
    //         toast.success('DApp updated successfully!');
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [state.message, state.dapp]);

    return (
        <form action={formAction} className="space-y-6">

            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Update Your DApp
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <label className="text-gray-900 dark:text-white">DApp Name</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="appName"
                        defaultValue={optimisticDApp.appName}
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
                        defaultValue={optimisticDApp.appIconUrl}
                    />
                </div>

                <div>
                    <label className="text-gray-900 dark:text-white">Description</label>
                    <textarea
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="description"
                        defaultValue={optimisticDApp.description}
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
                        defaultValue={optimisticDApp.websiteUrl}
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
                        defaultValue={optimisticDApp.twitterUrl}
                    />
                </div>

                <div>
                    <label className="text-gray-900 dark:text-white">Discord URL</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="discordUrl"
                        defaultValue={optimisticDApp.discordUrl}
                    />
                </div>

                <div>
                    <label className="text-gray-900 dark:text-white">Cover URL</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="coverUrl"
                        defaultValue={optimisticDApp.coverUrl}
                    />
                </div>

                <div >
                    <label className="text-gray-900 dark:text-white">Protocol</label>
                    <select
                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-300"
                        name="protocol"
                        defaultValue={optimisticDApp.protocol}
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

                <div >
                    <label className="text-gray-900 dark:text-white pb-2">Project Type</label>
                    <select
                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-300"
                        name="projectType"
                        defaultValue={optimisticDApp.projectType}
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

                <div>
                    <label className="text-gray-900 dark:text-white">Company Name</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="companyName"
                        defaultValue={optimisticDApp.companyName}
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
                        defaultValue={optimisticDApp.bannerUrls?.main.join(",")}
                    />
                    {state?.errors?.bannerUrls &&
                        state.errors.bannerUrls.map((error: string) => (
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
                            Saving ...
                        </div>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </form>
    );
}