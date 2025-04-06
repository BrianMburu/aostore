import { TransactionsFilterParams } from '@/services/ao/tokenService';
import { ProfileHeader } from '../ui/wallet/ProfileHeader'
import { WalletMain } from '../ui/wallet/WalletMain'
interface Props {
    searchParams: Promise<TransactionsFilterParams>;
}
export default async function WalletPage(props: Props) {
    const filterParams = await props.searchParams;
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Profile Header */}
            <ProfileHeader />

            {/* Main Content */}
            <WalletMain searchParams={filterParams} />
        </div>
    )
}