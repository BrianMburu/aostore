'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'


export function TransferModal({ open, onClose }: {
    open: boolean
    onClose: () => void
}) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 dark:text-gray-400 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-6">
                        <Dialog.Title className="text-lg font-semibold">Deposit Funds</Dialog.Title>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <select className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <option>Select Asset</option>
                            <option>AOS Tokens</option>
                            <option>USDC</option>
                            <option>ETH</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Deposit address"
                            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                            readOnly
                            value="ao_computer_deposit_address_1234"
                        />

                        <div className="text-sm text-gray-500">
                            Only send AO ecosystem assets to this address
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
export function SwapModal({ open, onClose }: {
    open: boolean
    onClose: () => void
}) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-6">
                        <Dialog.Title className="text-lg font-semibold">Deposit Funds</Dialog.Title>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <select className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <option>Select Asset</option>
                            <option>AOS Tokens</option>
                            <option>USDC</option>
                            <option>ETH</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Deposit address"
                            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                            readOnly
                            value="ao_computer_deposit_address_1234"
                        />

                        <div className="text-sm text-gray-500">
                            Only send AO ecosystem assets to this address
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}