import { FeatureRequestList } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestList";
import { TypeToggle } from "@/app/ui/MyDapps/FeatureRequests/TypeToggle";
import { DAppService } from "@/services/ao/dappService";
import { notFound } from "next/navigation";

// app/mydapps/[appId]/feature-requests/page.tsx
export default async function FeatureRequestsPage({ params, searchParams }: {
    params: { appId: string }
    searchParams: { type?: string; search?: string }
}) {

    const currParams = await params;
    const appId = currParams.appId as string;
    const { data, total } = await DAppService.getFeatureRequests(appId, await searchParams, true)

    if (!data) return notFound()

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">Feature Requests & Bugs</h2>
                <TypeToggle />
            </div>

            <FeatureRequestList requests={data} totalItems={total} />
        </div>
    )
}
