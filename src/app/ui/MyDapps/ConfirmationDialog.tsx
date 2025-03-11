'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
}) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6">
                    <DialogTitle className="text-lg font-bold mb-4 dark:text-white">
                        {title}
                    </DialogTitle>

                    <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Confirm
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}