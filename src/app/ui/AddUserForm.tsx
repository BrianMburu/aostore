// components/my-dapps/AddDAppModal.tsx
'use client';

import React, { useState, useActionState } from 'react';

import toast from 'react-hot-toast';
import ModalDialog from './MyDapps/ModalDialog';
import Loader from './Loader';
import { createUser, UserState } from '@/lib/userActions';
import { useAuth } from '@/context/AuthContext';

export const AddUserForm = ({ isFirstTimeUser }: { isFirstTimeUser: boolean }) => {
    const { user, logout, setUserData } = useAuth();

    const [isOpen, setIsOpen] = useState(isFirstTimeUser);
    const initialState: UserState = { message: null, errors: {} };

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: UserState, _formData: FormData) => {
            try {
                // Call createDapp to submit the data to the server
                const newState = await createUser(user!.walletAddress, prevState, _formData);

                if (newState.message === 'success' && newState.user) {
                    setUserData(newState.user);

                    // Update your server session
                    await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ user: newState.user }),
                    });

                    // Close modal and show success message
                    setIsOpen(false);

                    toast.success("New User created successfully!");
                }
                return newState;

            } catch {
                // Handle error and rollback
                toast.error("Failed to create User. Please try again.");
                return prevState
            }


        }, initialState);
    const handleClose = () => {
        logout();
        setIsOpen(false);
    }


    return (
        <ModalDialog isOpen={isOpen} onClose={handleClose}>
            <form action={formAction} className="space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Add New User Profile
                </h2>

                <div>
                    <label className="text-gray-900 dark:text-white">Username</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="username"
                    />
                    {state?.errors?.username &&
                        state.errors.username.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>

                <div>
                    <label className="text-gray-900 dark:text-white">Profile Picture URL</label>
                    <input
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        name="avatar"
                    />
                    {state?.errors?.avatar &&
                        state.errors.avatar.map((error: string) => (
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
                                Adding User Profile ...
                            </div>
                        ) : (
                            'Add User Profile'
                        )}
                    </button>
                </div>
            </form>
        </ModalDialog>
    );
};