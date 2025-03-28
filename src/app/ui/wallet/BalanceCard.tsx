// ui/wallet/BalanceCard.tsx
'use client'

import { useState } from "react"

export default function BalanceCard() {
  const [activeToken, setActiveToken] = useState<string>("aos")
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">Current Balance</h2>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold dark:text-white">4,892.00</span>
          <select
            value={activeToken}
            onChange={(e) => {
              setActiveToken(e.target.value)
            }}
            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"
          >
            <option value="aos">aos</option>
            <option value="botega">Botega</option>
            <option value="arweave">Arweave</option>
          </select>
          {/* <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm">
            AOS
          </span> */}
        </div>

        {/* <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">AOS Tokens</div>
            <div className="text-xl font-semibold mt-1 dark:text-white">1,234.56</div>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">AOS Points</div>
            <div className="text-xl font-semibold mt-1 dark:text-white">89,500</div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
