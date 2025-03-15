import BalanceCard from "../ui/wallet/BalanceCard";
import TokenSwapForm from "../ui/wallet/TokenSwapForm";
import TransactionForm from "../ui/wallet/TransactionForm";
import TransactionHistory from "../ui/wallet/TransactionHistory";

export default function WalletPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Balance Summary */}
            <BalanceCard />

            {/* Action Grid */}
            {/* <div className="px-6">
                <div className="flex flex-col md:flex-row justify-beetween gap-8">
                    <TransactionForm type="deposit" />
                    <TransactionForm type="withdraw" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <TokenSwapForm />
                    <TransactionForm type="transfer" />
                </div>
            </div> */}

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <TransactionForm type="deposit" />
                    <TransactionForm type="withdraw" />
                </div>

                <div className="space-y-8">
                    <TokenSwapForm />
                    <TransactionForm type="transfer" />
                </div>
            </div>

            {/* Transaction History */}
            <TransactionHistory />
        </div>
    )
}