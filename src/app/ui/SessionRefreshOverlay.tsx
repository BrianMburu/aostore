// app/ui/SessionRefreshOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function SessionRefreshOverlay() {
    const { isLoading, user, isConnected, requireAuth } = useAuth();
    const [showOverlay, setShowOverlay] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Only show overlay if there's a user but connection is invalid
        if (!isLoading && user && !isConnected) {
            setShowOverlay(true);
        }
    }, [user, isConnected, isLoading]);

    const handleVerifySession = async () => {
        setIsVerifying(true);

        try {
            await requireAuth();
            // Instead of full reload, trigger auth state update
            const res = await fetch('/api/session');
            if (res.ok) {
                setShowOverlay(false);
            }
        } catch (error) {
            console.error("Verification failed:", error);
            router.push('/');
        } finally {
            setIsVerifying(false);
        }
    };

    if (!showOverlay) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Session Verification Required
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                        Your session needs to be re-validated for security purposes.
                    </p>
                    <button
                        onClick={handleVerifySession}
                        disabled={isVerifying}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isVerifying ? "Verifying..." : "Verify Session"}
                    </button>
                </div>
            </div>
        </div>
    );
}