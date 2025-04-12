import AirdropDetails from '@/app/ui/AirDrops/AirDropDetails';

export default function AirdropDetailsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AirdropDetails isMyDapp={true} />
        </div >
    );
}