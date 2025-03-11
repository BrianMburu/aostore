import { AppAirdropData } from "@/types/airDrop";
import { AirdropCard } from "./AirdropCard";
import InfinityScrollControls from "../InfinityScrollControls";
import { DEFAULT_PAGE_SIZE } from "@/config/page";

export function AirdropsList({ airdrops, totalItems }: { airdrops: AppAirdropData[], totalItems: number }) {

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {airdrops.map(airdrop => (
                    <AirdropCard
                        key={airdrop.airdropId}
                        airdrop={airdrop}
                    />
                ))}
            </div>
            {airdrops &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />
            }
        </>

    )
}