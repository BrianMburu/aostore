// app/wallet/NetworkSelector.tsx
'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Dialog } from '@headlessui/react'

const networks = [
    { id: 'eth', name: 'Ethereum', logo: '🌐' },
    { id: 'sol', name: 'Solana', logo: '⚡' },
    { id: 'dot', name: 'Polkadot', logo: '🔴' },
]

export default function NetworkSelector() {
    const [selectedNetwork, setSelectedNetwork] = useState(networks[0])
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
                <span className="text-2xl">{selectedNetwork.logo}</span>
                <span className="font-medium dark:text-white">{selectedNetwork.name}</span>
                <ChevronDownIcon className="w-4 h-4 dark:text-gray-300" />
            </button>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-xl p-4">
                        <div className="space-y-2">
                            {networks.map((network) => (
                                <button
                                    key={network.id}
                                    onClick={() => {
                                        setSelectedNetwork(network)
                                        setIsOpen(false)
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <span className="text-2xl">{network.logo}</span>
                                    <span className="dark:text-white">{network.name}</span>
                                </button>
                            ))}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    )
}