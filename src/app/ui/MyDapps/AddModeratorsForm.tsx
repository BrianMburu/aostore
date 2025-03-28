'use client'
import { useState, useActionState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import Loader from '../Loader';
import toast from 'react-hot-toast';
import { addModerators, DappModeratorState } from '@/lib/mydappActions';
import { ModeratorsList } from './ModeratorList';


export function AddModeratorsForm({ appId }: { appId: string }) {
    const [inputValue, setInputValue] = useState('');
    const [moderators, setModerators] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const initialState = { message: null, errors: {} }

    const [state, formAction, isSubmitting] = useActionState<DappModeratorState, FormData>(
        async (_prevState: DappModeratorState, _formData: FormData) => {
            try {
                _formData.append('mods', moderators.join(","));

                const newState = await addModerators(appId, _prevState, _formData);
                if (newState.message === 'success') {
                    toast.success('Moderators added successfully!');
                    setModerators([]);
                    setInputValue('');
                }

                toast.error("Mods added successfully.");
                return newState;
            } catch {

                toast.error("Failed to add Mods. Please try again.");
                return initialState
            }
        }, initialState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Check for comma to split values
        if (value.endsWith(',')) {
            const newMod = value.slice(0, -1).trim();
            if (newMod && !moderators.includes(newMod)) {
                setModerators(prev => [...prev, newMod]);
                setInputValue('');
                return;
            }
        }
        setInputValue(value);
    };

    const removeModerator = (modToRemove: string) => {
        setModerators(prev => prev.filter(mod => mod !== modToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && inputValue === '' && moderators.length > 0) {
            const lastMod = moderators[moderators.length - 1];
            removeModerator(lastMod);
            setInputValue(lastMod);
        }
    };

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add Moderators
                </h2>
                <ModeratorsList appId={appId} refreshTrigger={state.message} />

                <div className="relative">
                    <div
                        className={`flex flex-wrap gap-2 items-center p-3 border rounded-lg transition-colors ${state?.errors?.moderators
                            ? 'border-red-500 dark:border-red-400'
                            : 'border-gray-300 dark:border-gray-600 focus-within:border-indigo-500 dark:focus-within:border-indigo-400'
                            } bg-white dark:bg-gray-800`}
                        onClick={() => inputRef.current?.focus()}
                    >
                        <AnimatePresence>
                            {moderators.map((mod) => (
                                <motion.div
                                    key={mod}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full"
                                >
                                    <CheckBadgeIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-sm text-indigo-800 dark:text-indigo-200">{mod}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeModerator(mod)}
                                        className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={moderators.length === 0 ? 'Enter user IDs separated by commas...' : ''}
                            className="flex-1 min-w-[200px] p-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>

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

                <div className="flex justify-end">
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

