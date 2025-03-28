// components/VerificationStatus.tsx
'use client';
import { CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { Dapp } from '@/types/dapp';

export function VerificationStatus({ dapp }: { dapp: Dapp }) {
    return (
        <div className="py-4 md:pl-4 rounded-lg">
            <div className="flex items-center gap-3">
                {dapp.verified?.toLowerCase() === 'verified' ? (
                    <>
                        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                        <span className="text-green-700 dark:text-green-300">
                            Verified
                        </span>
                    </>
                ) : (
                    <>
                        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                        <span className="text-yellow-700 dark:text-yellow-300">
                            Unverified - Submit for Verification
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}

export function VerificationSection({ isVerified }: { isVerified: boolean }) {
    return (
        <>
            {!isVerified && (
                <div className="w-fullmt-4 space-y-2">
                    <h3 className="font-medium dark:text-gray-300">Verification Requirements</h3>
                    <ul className="list-disc list-inside text-sm dark:text-white">
                        <li>Complete DApp profile</li>
                        <li>Provide valid contact information</li>
                        <li>Submit required documentation</li>
                    </ul>
                    <button
                        onClick={() => toast('Verification submission coming soon!')}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Submit for Verification
                    </button>
                </div>
            )}
        </>

    )
}