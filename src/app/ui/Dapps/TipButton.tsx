'use client'

import { useActionState, useState } from 'react';
import { BadgeDollarSignIcon } from "lucide-react";
import { AnimatedButton } from "../animations/AnimatedButton";
import ModalDialog from '../MyDapps/ModalDialog';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { sendTip, TipState } from '@/lib/TipAction';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';


export function TipButton({ onClick }: { onClick: () => void }) {
    return (
        <AnimatedButton onClick={onClick} className="relative group text-yellow-600 dark:text-yellow-300">
            <BadgeDollarSignIcon className="h-5 w-5" />
            <span className="absolute border bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2">
                Tip User
            </span>
        </AnimatedButton>
    );
}


const tokenOptions = [
    { name: "AO", icon: "AO", tokenid: "adjandj" },
    { name: "AOS", icon: "AOS", tokenid: "fjndjfvf" },
    { name: "USDT", icon: "USDT", tokenid: "qwpoewdwmls" }
];

export function TipForm({ recipientWallet }: { recipientWallet: string }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const initialState: TipState = { message: null, errors: {} };

    const { user } = useAuth()
    const [state, formAction, isSubmitting] = useActionState(
        async (prevState: TipState, _formData: FormData) => {
            try {
                // Call createDapp to submit the data to the server
                const newState = await sendTip(selectedToken, recipientWallet, user, prevState, _formData);

                if (newState.message === 'success' && newState.tip) {
                    // Close modal and show success message
                    setIsOpen(false);
                    setSelectedToken(null);

                    toast.success(`${newState.tip.amount} sent to ${recipientWallet.substring(0, 5)}... successfully!`);
                }
                return newState;

            } catch {
                // Handle error and rollback
                toast.error("Failed to submit Airdrop. Please try again.");
                return prevState
            }
        }, initialState)

    return (
        <>
            {/* Floating Action Button */}
            <TipButton onClick={() => setIsOpen(true)} />

            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Add New Airdrop
                </h2>
                {/* Token Card selection */}
                <div className="mb-6">
                    <p className="text-gray-900 dark:text-white mb-2">Select Token</p>
                    <div className="flex space-x-4">
                        {tokenOptions.map((token) => (
                            <TokenCard
                                key={token.tokenid}
                                {...token}
                                isSelected={selectedToken === token.tokenid}
                                onClick={() => setSelectedToken(token.tokenid)}
                            />
                        ))}
                    </div>
                </div>
                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="amount" className="text-gray-900 dark:text-white">
                            Enter Tip Amount
                        </label>
                        <input
                            id="amount"
                            name="amount"
                            type='number'
                            step={0.01}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                        />
                        {state?.errors?.amount &&
                            state.errors.amount.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                    {/* Form Error */}
                    <div id="form-error" aria-live="polite" aria-atomic="true">
                        {state?.message && state.message !== "success" && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-gray-100 bg-gray-200 dark:bg-gray-500 rounded"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <Loader />
                                    sending ...
                                </div>
                            ) : (
                                "Send TIP"
                            )}
                        </button>
                    </div>
                </form>
            </ModalDialog>
        </>
    )
}


interface TokenCardProps {
    name: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
}

function TokenCard({ name, icon, isSelected, onClick }: TokenCardProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
                "cursor-pointer border py-2 px-4 rounded-xl flex items-center justify-center shadow transition-all duration-200 gap-2",
                isSelected
                    ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900"
                    : "border-gray-300 dark:border-gray-600"
            )}
        >
            <div className="w-12 h-12 mb-2 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                <span className="text-xl font-bold">{icon}</span>
            </div>
            <p className="font-medium dark:text-gray-100">{name}</p>
        </motion.button>
    );
}