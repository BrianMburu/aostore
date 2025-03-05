'use client'

import { useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";
import { DetailedHelpfulButton } from "../DetailedHelpfulButton";
import { TipForm } from "../../Dapps/TipButton";
import { SupportService } from "@/services/ao/supportServices";
import { BugReport, FeatureRequest } from "@/types/support";
import { DappFeatureRequestEditForm } from "../../Dapps/FeatureRequests/DappFREditForm";
import { useAuth } from "@/context/AuthContext";


export function FeatureRequestItem({ request }: { request: (BugReport | FeatureRequest) }) {
    const { user } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [optimisticState, setOptimisticState] = useOptimistic(
        request,
        (current, action: 'helpful' | 'unhelpful') => ({
            ...current,
            helpfulVotes: current.helpfulVotes + (action === 'helpful' ? 1 : 0),
            unhelpfulVotes: current.unhelpfulVotes + (action === 'unhelpful' ? 1 : 0),
        })
    )

    const handleVote = async (action: 'helpful' | 'unhelpful') => {
        startTransition(async () => {
            try {
                // Optimistically update the count
                setOptimisticState(action);

                let response;
                let data;

                if (action == 'helpful') {
                    response = await SupportService.markFeatureRequestHelpful(request.id);
                    data = await response.json();
                } else {
                    response = await SupportService.markFeatureRequestUnhelpful(request.id);
                    data = await response.json();
                }

                if (data.success) {
                    toast.success(`Request Marked as ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                } else {

                    // Revert the optimistic update if the operation failed
                    setOptimisticState(action === 'helpful' ? 'unhelpful' : 'helpful')
                    toast.error(`Failed to vote ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                }
            } catch (error) {
                // Revert the optimistic update in case of an error
                setOptimisticState(action === 'helpful' ? 'unhelpful' : 'helpful')
                toast.error(`An error occurred while voting ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                console.error('Voting failed:', error);

            }
        });
    }

    return (
        <div className="border rounded-lg p-4 dark:border-gray-700">
            <div className="flex items-start gap-3">
                <div className={`w-2 h-full rounded ${request.type === 'feature' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium dark:text-white">{request.title}</h3>
                            {user && user.walletAddress == request.userId && <DappFeatureRequestEditForm request={request} />}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mt-1">{request.description}</p>
                    </div>

                    <div className="mt-2 text-sm flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <TipForm recipientWallet={request.userId} />
                        <DetailedHelpfulButton
                            helpfulVotes={optimisticState.helpfulVotes} unhelpfulVotes={optimisticState.unhelpfulVotes}
                            isPending={isPending} handleVote={handleVote}
                        />
                        {new Date(request.timestamp).toLocaleDateString()}

                    </div>
                </div>
            </div>
        </div>
    )
}