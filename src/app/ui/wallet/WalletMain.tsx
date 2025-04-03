import { useEffect, useState, useTransition } from "react";
import BalanceCard from "./BalanceCard";
import TransactionHistory from "./TransactionHistory";
import { SwapModal, TransferModal } from "./Modals";
import { AppTokenData } from "@/types/dapp";
import { TokenService } from "@/services/ao/tokenService";
import { useAuth } from "@/context/AuthContext";

export function WalletMain() {
    const [tokens, setTokens] = useState<AppTokenData[]>([]);
    const [activeToken, setActiveToken] = useState<AppTokenData>();
    const [activeTab, setActiveTab] = useState(0);
    const [activeModal, setActiveModal] = useState<'transfer' | 'swap'>();
    const [fetching, startTransition] = useTransition();
    const { isConnected } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    const fetchedTokens = await TokenService.fetchTokens();
                    if (fetchedTokens.length > 0) {
                        setTokens(fetchedTokens)
                    }
                } catch (error) {
                    console.error(error);
                    setTokens([]);
                }
            })
    }, [isConnected]);

    console.log("All App Tokens=>>", tokens)

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
                <BalanceCard tokens={tokens} fetchingTokens={fetching} activeToken={activeToken} setActiveToken={setActiveToken} />

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

            <TransferModal open={activeModal === 'transfer'} onClose={() => setActiveModal(undefined)} tokenData={activeToken!} />
            <SwapModal open={activeModal === 'swap'} onClose={() => setActiveModal(undefined)} />
        </div>
    )
}