'use client'

import { TokenService, TransactionsFilterParams } from '@/services/ao/tokenService';
import { AppTransactionData } from '@/types/dapp';
import { Table } from '@tremor/react'
import { useEffect, useState, useTransition } from 'react'
import PaginationControls from '../PaginationControls';
import { DEFAULT_PAGE_SIZE } from '@/config/page';
import TransactionHistorySkeleton from './skeletons/TransactionHistorySkeleton';
import { formatActivityTime } from '@/utils/forum';
import { useRank } from '@/context/RankContext';

export default function TransactionHistory({ accessPage, searchParams }: { accessPage: string, searchParams: TransactionsFilterParams }) {
    const [isFetching, startTransition] = useTransition();
    const [transactions, setTransactions] = useState<AppTransactionData[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);

    const { rank } = useRank();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    // Fetch transactions from the server
                    const { data: fetchedTransactions, total } = await TokenService.fetchTransactions(accessPage, searchParams);
                    // console.log("Fetched Transactions => ", fetchedTransactions);
                    setTransactions(fetchedTransactions);
                    setTotalItems(total);
                } catch (error) {
                    console.error(error);
                }
            }
        )

    }, [accessPage, searchParams, rank]);

    if (isFetching) {
        return (
            <TransactionHistorySkeleton />
        )
    }

    if (transactions.length === 0) {
        return <EmptyState />
    }

    return (
        <>
            {isFetching ?
                <TransactionHistorySkeleton /> :
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th className="text-left">Id</th>
                            <th className="text-left">Type</th>
                            <th className="text-left">Amount</th>
                            <th className="text-left">Date</th>
                            <th className="text-left">Accm Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td >{tx.transactionId}</td>
                                <td className="capitalize">{tx.transactionType}</td>
                                <td>{tx.amount}</td>
                                <td>{formatActivityTime(tx.timestamp)}</td>
                                <td>{tx.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            }
            <PaginationControls
                totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                paramName='page'
            />
        </>
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