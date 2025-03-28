// import BalanceCard from "../ui/wallet/BalanceCard";
// import TokenSwapForm from "../ui/wallet/TokenSwapForm";
// import TransactionForm from "../ui/wallet/TransactionForm";
// import TransactionHistory from "../ui/wallet/TransactionHistory";

// export default function WalletPage() {
//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//             {/* Balance Summary */}
//             <BalanceCard />

//             {/* Action Grid */}
//             {/* <div className="px-6">
//                 <div className="flex flex-col md:flex-row justify-beetween gap-8">
//                     <TransactionForm type="deposit" />
//                     <TransactionForm type="withdraw" />
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-8">
//                     <TokenSwapForm />
//                     <TransactionForm type="transfer" />
//                 </div>
//             </div> */}

//             <div className="grid md:grid-cols-2 gap-8">
//                 <div className="space-y-8">
//                     <TransactionForm type="deposit" />
//                     <TransactionForm type="withdraw" />
//                 </div>

//                 <div className="space-y-8">
//                     <TokenSwapForm />
//                     <TransactionForm type="transfer" />
//                 </div>
//             </div>

//             {/* Transaction History */}
//             <TransactionHistory />
//         </div>
//     )
// }

// app/wallet/page.tsx
// app/wallet/page.tsx
'use client'

import { useState } from 'react'
import ProfileImage from '../ui/ProfilePic'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import BalanceCard from "../ui/wallet/BalanceCard"
import TransactionHistory from "../ui/wallet/TransactionHistory"
import { SwapModal, TransferModal } from '../ui/wallet/Modals'

export default function WalletPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState(0)
    const [activeModal, setActiveModal] = useState<'transfer' | 'swap'>()

    const shortenedAddress = `${user?.walletAddress.slice(0, 6)}...${user?.walletAddress.slice(-4)}`

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(user?.walletAddress || "")
            toast.success('Address copied to clipboard!')
        } catch {
            toast.error('Failed to copy address')
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Profile Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div className='flex items-center gap-4'>
                    <ProfileImage
                        imgUrl={''}
                        alt={'User avatar'}
                        className='h-16 w-16 rounded-lg border-2 border-indigo-100 dark:border-gray-700'
                    />

                    <div className='space-y-1'>
                        <h1 className='text-xl font-semibold dark:text-white'>Username</h1>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm bg-indigo-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-md'>
                                Architect: 500 pts
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                        {shortenedAddress}
                    </span>
                    <button
                        onClick={copyToClipboard}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title="Copy address"
                    >
                        <DocumentDuplicateIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-6">
                    <BalanceCard />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => setActiveModal('swap')}
                            className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="font-medium dark:text-white">Swap Tokens</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('transfer')}
                            className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="font-medium dark:text-white">Transfer Funds</span>
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab(0)}
                                className={`pb-3 px-1 border-b-2 ${activeTab === 0
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Transactions
                            </button>
                        </div>
                    </div>

                    <TransactionHistory />
                </div>
            </div>

            {/* Modals */}
            <TransferModal open={activeModal === 'transfer'} onClose={() => setActiveModal(undefined)} />
            <SwapModal open={activeModal === 'swap'} onClose={() => setActiveModal(undefined)} />
        </div>
    )
}