'use client'
import { useState, useActionState, useEffect, useCallback } from 'react';
import Loader from '../Loader';
import toast from 'react-hot-toast';
import { addModerators, DappModeratorState } from '@/lib/mydappActions';
import { DAppService } from '@/services/ao/dappService';
import { MultiItemInput } from './MultiItemInput';
import { DeleteModForm } from './DeleteModForm';


export function AddModeratorsForm({ appId }: { appId: string }) {
    const [moderators, setModerators] = useState<string[]>([]);
    const [accessPage, setAccessPage] = useState<string>("reviews")
    const initialState = { message: null, errors: {} };

    const fetchDappMods = useCallback(async () => {
        try {
            const { data } = await DAppService.getMods(appId, accessPage);
            setModerators(data);

        } catch (error) {
            toast.error('Failed to fetch moderators');
            console.error(error)
        }
    }, [appId, accessPage]);

    useEffect(() => {
        fetchDappMods();
    }, [fetchDappMods]);

    const refreshMods = () => {
        fetchDappMods();
    }

    const [state, formAction, isSubmitting] = useActionState<DappModeratorState, FormData>(
        async (_prevState: DappModeratorState, _formData: FormData) => {
            try {
                _formData.append('mods', moderators.join(","));

                const newState = await addModerators(appId, accessPage, _prevState, _formData);
                if (newState.message === 'success') {
                    toast.success('Moderators added successfully!');
                }

                return newState;
            } catch {

                toast.error("Failed to add Mods. Please try again.");
                return initialState
            }
        }, initialState);


    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <div className='flex flex-col sm:flex-row sm:justify-between'>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add Moderators
                    </h2>
                    <select
                        value={accessPage}
                        onChange={(e) => {
                            setAccessPage(e.target.value)
                        }}
                        className="dark:bg-gray-800 dark:text-white rounded p-2 text-sm"
                    >
                        <option value="reviews">Reviews</option>
                        <option value="bugReport">Bug Report</option>
                        <option value="developerForum">Developer Forum</option>
                        <option value="featureRequest">Feature Request</option>
                    </select>
                </div>


                <div className="relative">
                    <MultiItemInput
                        items={moderators}
                        onChange={setModerators}
                        placeholder="Enter banner urls separated by commas..."
                        inputClassName='focus:ring-0'
                    />

                    {state?.errors?.moderators && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                            {state.errors.moderators.join(', ')}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>Valid user ID requirements:</p>
                    <ul className="list-disc pl-5">
                        <li>Minimum 8 characters</li>
                        <li>Alphanumeric characters only</li>
                        <li>No special symbols or spaces</li>
                    </ul>
                </div>

                <div className="flex justify-end gap-2">
                    <DeleteModForm appId={appId} accessPage={accessPage} refreshMods={refreshMods} />

                    <button
                        type="submit"
                        disabled={isSubmitting || moderators.length === 0}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader />
                                Adding...
                            </>
                        ) : (
                            `Add ${moderators.length} Moderator${moderators.length !== 1 ? 's' : ''}`
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}

