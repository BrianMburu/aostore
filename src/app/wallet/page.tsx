import { ProfileHeader } from '../ui/wallet/ProfileHeader'
import { WalletMain } from '../ui/wallet/WalletMain'

export default function WalletPage() {

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Profile Header */}
            <ProfileHeader />

            {/* Main Content */}
            <WalletMain />
        </div>
    )
}