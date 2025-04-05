'use client'

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { TipForm } from "../../Dapps/TipButton";
import { SupportService } from "@/services/ao/supportServices";
import { BugReport, FeatureRequest } from "@/types/support";
import { DappFeatureRequestEditForm } from "../../Dapps/FeatureRequests/DappFREditForm";
import { useAuth } from "@/context/AuthContext";
import { Voters } from "@/types/voter";
import { DetailedHelpfulButton } from "../../MyDapps/DetailedHelpfulButton";
import { FeatureRequestRepliesList } from "../../MyDapps/FeatureRequests/FeatureRequestReplyList";
import { TipHistoryDialog } from "../TipHistoryButton";

type RequestType = 'feature' | 'bug';

interface FeatureRequestItemProps {
    request: BugReport | FeatureRequest;
    appId: string;
    requestType: RequestType;
}

export function FeatureRequestItem({ request, appId, requestType }: FeatureRequestItemProps) {
    const { user } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [voters, setVoters] = useState<Voters>(request.voters);


    const handleVote = async (action: 'helpful' | 'unhelpful') => {
        // Store previous state for potential rollback
        const previousVoters = { ...voters };

        // Optimistically update the count in a shallow way (keeping the existing structure)
        setVoters({
            ...voters,
            foundHelpful: {
                ...voters.foundHelpful,
                count: voters.foundHelpful.count + (action === 'helpful' ? 1 : 0)
            },
            foundUnhelpful: {
                ...voters.foundUnhelpful,
                count: voters.foundUnhelpful.count + (action === 'unhelpful' ? 1 : 0)
            }
        });

        startTransition(async () => {
            try {
                let data;
                if (requestType === 'feature') {
                    data = action === 'helpful'
                        ? await SupportService.markFeatureRequestHelpful(appId, request.requestId)
                        : await SupportService.markFeatureRequestUnhelpful(appId, request.requestId);
                } else if (requestType === 'bug') {
                    data = action === 'helpful'
                        ? await SupportService.markBugReportHelpful(appId, request.requestId)
                        : await SupportService.markBugReportUnhelpful(appId, request.requestId);
                } else {
                    throw new Error("Invalid request type");
                }

                if (data) {
                    toast.success(`Request marked as ${action}.`);
                } else {
                    // If the API call did not return data, revert the optimistic update
                    setVoters(previousVoters);
                    toast.error(`Failed to mark as ${action}.`);
                }
            } catch (error) {
                // On error, revert the optimistic update
                setVoters(previousVoters);
                toast.error(`An error occurred while marking as ${action}.`);
                console.error('Voting failed:', error);
            }
        });
    };

    return (
        <div className="border rounded-lg p-4 dark:border-gray-700">
            <div className="flex items-start gap-3">
                <div className={`w-2 h-full rounded ${request.type === 'feature' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium dark:text-white">{request.title}</h3>
                            <div className="flex items-center gap-2">
                                {user?.walletAddress === request.user && (
                                    <DappFeatureRequestEditForm
                                        request={request}
                                        appId={appId}
                                        requestType={requestType}
                                    />
                                )}
                                <TipHistoryDialog appId={appId} userId={request.user} taskId={request.requestId} />
                            </div>

                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{request.description}</p>
                    </div>
                    <div className="mt-2 text-sm flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <TipForm recipientWallet={request.user} appId={appId} tipId={request.requestId} />
                        <DetailedHelpfulButton
                            helpfulVotes={voters.foundHelpful.count}
                            unhelpfulVotes={voters.foundUnhelpful.count}
                            isPending={isPending}
                            handleVote={handleVote}
                        />
                        {new Date(Number(request.createdTime)).toLocaleDateString()}
                    </div>
                    <FeatureRequestRepliesList appId={appId} requestId={request.requestId}
                        replies={Object.values(request.replies)} requestType={requestType}
                    />
                </div>
            </div>
        </div>
    );
}
