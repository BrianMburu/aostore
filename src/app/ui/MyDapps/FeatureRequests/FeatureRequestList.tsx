import { FeatureRequest, BugReport } from "@/types/dapp";
import { DEFAULT_PAGE_SIZE } from "@/config";
import { AnimatedList } from "../../animations/AnimatedList";
import { AnimatedListItem } from "../../animations/AnimatedListItem";
import InfinityScrollControls from "../../InfinityScrollControls";

interface FeatureRequestList {
    requests: (BugReport | FeatureRequest)[];
    totalItems: number
}

export function FeatureRequestList({ requests, totalItems }: FeatureRequestList) {
    return (
        <div className="space-y-4">
            <AnimatedList>
                <div className="space-y-4">
                    {requests.map((request) => (
                        <AnimatedListItem key={request.id}>
                            <FeatureRequestItem request={request} />
                        </AnimatedListItem>

                    ))}
                </div>
            </AnimatedList>


            {requests &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}

export function FeatureRequestItem({ request }: { request: (BugReport | FeatureRequest) }) {
    return (
        <div className="border rounded-lg p-4 dark:border-gray-700">
            <div className="flex items-start gap-3">
                <div className={`w-2 h-full rounded ${request.type === 'feature' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1">
                    <h3 className="font-medium dark:text-white">{request.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{request.description}</p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(request.timestamp).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    )
}