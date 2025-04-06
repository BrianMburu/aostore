'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Dapp } from '@/types/dapp';

export function DeleteConfirmationModal({
    dapp,
    onDelete
}: {
    dapp: Dapp;
    onDelete: () => Promise<void>;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await onDelete();
            toast.success('DApp deleted successfully');
            setIsOpen(false);
        } catch {
            toast.error('Failed to delete DApp');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
                Delete DApp
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Delete DApp</h2>
                        <p className="mb-6">
                            Are you sure you want to delete <strong>{dapp.appName}</strong>? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}