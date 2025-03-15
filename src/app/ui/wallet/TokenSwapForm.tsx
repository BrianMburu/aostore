// app/wallet/TokenSwapForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { swapSchema } from '@/lib/WalletAction'

export default function TokenSwapForm() {
    const { register, handleSubmit, watch } = useForm({
        resolver: zodResolver(swapSchema)
    })

    return (
        <div className="border dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Swap Tokens</h3>

            <form onSubmit={handleSubmit(console.log)} className="space-y-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input
                            {...register('fromAmount')}
                            placeholder="From"
                            className="flex-1 p-2 rounded dark:bg-gray-800"
                        />
                        <select
                            {...register('fromToken')}
                            className="p-2 rounded dark:bg-gray-800"
                        >
                            <option value="ETH">ETH</option>
                            <option value="DAPP">DAPP</option>
                            <option value="USDC">USDC</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            {...register('toAmount')}
                            placeholder="To"
                            className="flex-1 p-2 rounded dark:bg-gray-800"
                            readOnly
                            value={watch('fromAmount') * 0.95} // Simplified conversion
                        />
                        <select
                            {...register('toToken')}
                            className="p-2 rounded dark:bg-gray-800"
                        >
                            <option value="DAPP">DAPP</option>
                            <option value="ETH">ETH</option>
                            <option value="USDC">USDC</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700"
                >
                    Swap Tokens
                </button>
            </form>
        </div>
    )
}