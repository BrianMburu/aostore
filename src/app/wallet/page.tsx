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
import BalanceCard from "../ui/wallet/BalanceCard"
import TransactionHistory from "../ui/wallet/TransactionHistory"
import { SwapModal, TransferModal } from '../ui/wallet/Modals'
import { ProfileHeader } from '../ui/wallet/ProfileHeader'

export default function WalletPage() {
    const [activeTab, setActiveTab] = useState(0)
    const [activeModal, setActiveModal] = useState<'transfer' | 'swap'>()


    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Profile Header */}
            <ProfileHeader />

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