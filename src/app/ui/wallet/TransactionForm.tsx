// app/wallet/TransactionForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '@/lib/WalletAction'

export default function TransactionForm({ type }: { type: 'deposit' | 'withdraw' | 'transfer' }) {
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(transactionSchema)
    })

    const labels = {
        deposit: { title: 'Deposit Funds', action: 'Deposit' },
        withdraw: { title: 'Withdraw Funds', action: 'Withdraw' },
        transfer: { title: 'Transfer Funds', action: 'Send' }
    }

    return (
        <div className="border dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
                {labels[type].title}
            </h3>

            <form onSubmit={handleSubmit(console.log)} className="space-y-4">
                {type === 'transfer' && (
                    <input
                        {...register('recipient')}
                        placeholder="Recipient Address"
                        className="w-full p-2 rounded dark:bg-gray-800"
                    />
                )}

                <div className="flex gap-4">
                    <input
                        {...register('amount')}
                        type="number"
                        placeholder="Amount"
                        className="flex-1 p-2 rounded dark:bg-gray-800"
                    />
                    <select
                        {...register('token')}
                        className="p-2 rounded dark:bg-gray-800"
                    >
                        <option value="ETH">ETH</option>
                        <option value="DAPP">DAPP</option>
                        <option value="USDC">USDC</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
                >
                    {labels[type].action}
                </button>
            </form>
        </div>
    )
}