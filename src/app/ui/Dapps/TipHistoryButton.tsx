'use client'

import { useEffect, useState, useTransition } from 'react';
import { Bitcoin } from "lucide-react";
import { AnimatedButton } from "../animations/AnimatedButton";
import ModalDialog from '../MyDapps/ModalDialog';
import { Table } from '@tremor/react';
import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { formatActivityTime } from '@/utils/forum';
import TransactionHistorySkeleton from '../wallet/skeletons/TransactionHistorySkeleton';
import { TokenService } from '@/services/ao/tokenService';
import { AppTipTransactionData } from '@/types/dapp';
import StatePaginationControls from '../StatePaginationControls';

export function TipHistoryButton({ onClick }: { onClick: () => void }) {
    return (
        <AnimatedButton onClick={onClick} className="relative group text-yellow-600 dark:text-yellow-300">
            <Bitcoin className="h-5 w-5" />
            <span className="absolute border bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2">
                Tip Earnings
            </span>
        </AnimatedButton>
    );
}

export function TipHistoryDialog({ appId, userId, taskId }: { appId: string, userId: string, taskId: string }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            {/* Floating Action Button */}
            <TipHistoryButton onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    View Tips History
                </h2>
                {/* Token Card selection */}
                <TipsTransactionHistory appId={appId} userId={userId} taskId={taskId} />

            </ModalDialog>
        </>
    )
}

export default function TipsTransactionHistory({ appId, userId, taskId }: { appId: string, userId: string, taskId: string }) {
    const [isFetching, startTransition] = useTransition();
    const [transactions, setTransactions] = useState<AppTipTransactionData[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1)

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    // Fetch transactions from the server
                    const { data: fetchedTransactions, total } = await TokenService.fetchItemTipTransactions(appId, userId, taskId, { page: currentPage });
                    // console.log("Fetched Transactions => ", fetchedTransactions);
                    setTransactions(fetchedTransactions);
                    setTotalItems(total);
                } catch (error) {
                    console.error(error);
                }
            }
        )

    }, [appId, currentPage, taskId, userId]);

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
            <Table className="mt-4">
                <thead>
                    <tr>
                        {/* <th className="text-left">Token</th> */}
                        <th className="text-left">Id</th>
                        <th className="text-left">Type</th>
                        <th className="text-left">Amount</th>
                        <th className="text-left">Date</th>
                        <th className="text-left">status</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            {/* <td >{tx.logo}</td> */}
                            <td >{tx.transactionId}</td>
                            <td className="capitalize">{tx.transactionType}</td>
                            <td>{tx.amount}</td>
                            <td>{formatActivityTime(tx.timestamp)}</td>
                            <td>{tx.tipped ? "received" : "sent"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <StatePaginationControls
                totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                currentPage={currentPage}
                onPageChange={(page: number) => setCurrentPage(page)}
            />
        </>

    )
}

function EmptyState() {
    return (
        <div className="text-center py-12">
            <div className="mb-4 text-6xl">📭</div>
            <h3 className="text-lg font-medium">No Tips yet</h3>
            <p className="text-gray-500 mt-2">
                Your tips history will appear here once people start tipping you.
            </p>
        </div>
    )
}