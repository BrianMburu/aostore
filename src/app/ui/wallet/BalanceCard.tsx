// app/wallet/BalanceCard.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import NetworkSelector from './NetworkSelector'

export default function BalanceCard() {
  const { user } = useAuth()
  const balances = {
    ETH: 4.892,
    DAPP: 1500,
    USDC: 5000
  }

  return (
    <div className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold dark:text-white">Wallet Balance</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
          </p>
        </div>
        <NetworkSelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {Object.entries(balances).map(([token, amount]) => (
          <div
            key={token}
            className="bg-white dark:bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium dark:text-white">{token}</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                ${(amount * 1.2).toLocaleString()}
              </span>
            </div>
            <div className="text-2xl font-bold mt-2 dark:text-white">
              {amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}