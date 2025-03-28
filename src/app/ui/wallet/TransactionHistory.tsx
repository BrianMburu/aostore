'use client'

import { Table, Badge } from '@tremor/react'

const transactions = [
    {
        id: '1',
        type: 'deposit',
        amount: '0.500 ETH',
        date: '2024-03-15 14:32',
        status: 'completed'
    },
    {
        id: '2',
        type: 'swap',
        amount: '500 AOS',
        date: '2024-03-14 09:15',
        status: 'pending'
    }
]

export default function TransactionHistory() {
    if (transactions.length === 0) {
        return <EmptyState />
    }

    return (
        <Table className="mt-4">
            <thead>
                <tr>
                    <th className="text-left">Type</th>
                    <th className="text-left">Amount</th>
                    <th className="text-left">Date</th>
                    <th className="text-left">Status</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="capitalize">{tx.type}</td>
                        <td>{tx.amount}</td>
                        <td>{tx.date}</td>
                        <td>
                            <Badge
                                color={tx.status === 'completed' ? 'emerald' : 'amber'}
                                className="w-fit"
                            >
                                {tx.status}
                            </Badge>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

function EmptyState() {
    return (
        <div className="text-center py-12">
            <div className="mb-4 text-6xl">📭</div>
            <h3 className="text-lg font-medium">No transactions yet</h3>
            <p className="text-gray-500 mt-2">
                Your transaction history will appear here once you start using your wallet
            </p>
        </div>
    )
}