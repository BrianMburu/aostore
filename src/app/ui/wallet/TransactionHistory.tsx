// app/wallet/TransactionHistory.tsx
'use client'

import { Transaction } from '@/types/wallet'
import { Table } from '@tremor/react'

const dummyTransactions: Transaction[] = [
    // Sample transactions
]

export default function TransactionHistory() {
    return (
        <div className="border dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Transaction History
            </h3>

            <Table className="mt-4">
                <thead>
                    <tr>
                        <th className="text-left">Type</th>
                        <th className="text-left">Amount</th>
                        <th className="text-left">Token</th>
                        <th className="text-left">Date</th>
                        <th className="text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyTransactions.map((tx) => (
                        <tr key={tx.id}>
                            <td className="capitalize">{tx.type}</td>
                            <td>{tx.amount}</td>
                            <td>{tx.token}</td>
                            <td>{new Date(tx.date).toLocaleDateString()}</td>
                            <td>
                                <span className={`badge ${tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {tx.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}