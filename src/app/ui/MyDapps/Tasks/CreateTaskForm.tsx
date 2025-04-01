// components/my-dapps/AddDAppModal.tsx
'use client';

import React, { useActionState, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast';

// import { State, createDapp, createTemporaryDApp, dappSchema } from '@/lib/mydappActions';
import Loader from '../../Loader';
import { AnimatedButton } from '../../animations/AnimatedButton';
import { createTask, TaskState } from '@/lib/taskAction';
import ModalDialog from '../ModalDialog';
import { AddTaskFloatingButton } from './AddTaskFloatingButton';

export const AddTaskForm = () => {
    // Get appId from URL
    const params = useParams()
    const appId = params.appId as string;

    // Get userId from session
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const initialState: TaskState = { message: null, errors: {}, task: null };

    const defaultFormValues = { title: "", task: "", taskerCount: "", description: "", link: "", amount: "" }
    // Local state for the request details to support optimistic updates
    const [localRequest, setLocalRequest] = useState<
        { title: string, task: string, taskerCount: string, amount: string, description: string, link: string }>(
            defaultFormValues);

    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: TaskState, _formData: FormData) => {
            const formValues = Object.fromEntries(_formData.entries());

            // Capture form values for the optimistic update
            const previousRequest = { ...localRequest };

            // Optimistically update local request state
            const updatedRequest = { ...localRequest, ...formValues };
            setLocalRequest(updatedRequest);

            try {
                const newState = await createTask(appId, prevState, _formData);

                // If the server returns an updated request, update localRequest accordingly.
                if (newState.message === 'success') {
                    setIsOpen(false);
                    setLocalRequest(defaultFormValues)
                    router.refresh();
                    toast.success("Task Added successfully! It will be visible after verification.");
                }

                return newState;
            } catch (error) {
                // Revert optimistic update on error
                setLocalRequest(previousRequest);
                toast.error("Failed to submit Airdrop. Please try again.");
                console.error("Edit request failed:", error);
                return initialState;
            }
        },
        initialState
    );

    return (
        <div>
            {/* Floating Action Button */}
            <AddTaskFloatingButton onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <form action={formAction} className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Add a new Task
                    </h2>
                    <div>
                        <label htmlFor="title" className="text-gray-900 dark:text-white">
                            Task Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            defaultValue={localRequest.title}
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

                    <div>
                        <label htmlFor="task" className="text-gray-900 dark:text-white">
                            Task Summary
                        </label>
                        <input
                            id="task"
                            name="task"
                            defaultValue={localRequest.task}
                            type="text"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.task &&
                            state.errors.task.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label htmlFor="taskerCount" className="text-gray-900 dark:text-white">
                            Number of Taskers
                        </label>
                        <input
                            id="taskerCount"
                            name="taskerCount"
                            defaultValue={localRequest.taskerCount}
                            type="number"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />

                        {state?.errors?.taskerCount &&
                            state.errors.taskerCount.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label htmlFor="amount" className="text-gray-900 dark:text-white">
                            Total Task Amount
                        </label>
                        <input
                            id="amount"
                            name="amount"
                            defaultValue={localRequest.amount}
                            type="number"
                            step={0.01}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.amount &&
                            state.errors.amount.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    <div>
                        <label htmlFor="link" className="text-gray-900 dark:text-white">
                            Task Link
                        </label>
                        <input
                            id="link"
                            name="link"
                            defaultValue={localRequest.link}
                            type='text'
                            placeholder='e.g twitter url to repost to the task.'
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.link &&
                            state.errors.link.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="text-gray-900 dark:text-white">
                            Task instructions
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

                    {/* Form Error */}
                    <div id="form-error" aria-live="polite" aria-atomic="true">
                        {state?.message && state.message !== "success" && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4">
                        <AnimatedButton
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <Loader />
                                    Adding ...
                                </div>
                            ) : (
                                "Add New Task"
                            )}
                        </AnimatedButton>
                    </div>
                </form>
            </ModalDialog>

        </div>
    );
};