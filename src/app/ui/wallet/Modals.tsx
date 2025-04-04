'use client'

import { swap, SwapTokenState, TokenTransferState, transfer } from '@/lib/tokenAction'
import { AnimatedButton } from '../animations/AnimatedButton'
import Loader from '../Loader'
import ModalDialog from '../MyDapps/ModalDialog'
import { AppTokenData } from '@/types/dapp'
import toast from 'react-hot-toast'
import { useActionState } from 'react'
import { useRank } from '@/context/RankContext'
import ProfileImage from '../ProfilePic'
import { CheckBadgeIcon } from '@heroicons/react/24/outline'


export function TransferModal({ tokenData, open, onClose }: {
    tokenData: AppTokenData
    open: boolean
    onClose: () => void
}) {
    const initialState: TokenTransferState = { message: null, errors: {} };
    const { fetchRankData } = useRank();

    const [state, formAction, isSubmitting] = useActionState(
        async (_prevState: TokenTransferState, _formData: FormData) => {
            try {
                const newState = await transfer(tokenData, _prevState, _formData);

                if (newState.message == "success") {
                    toast.success("Token Transfer was successful.");
                    fetchRankData();
                    onClose()
                }
                return newState
            } catch (error) {
                console.error(error)
                toast.error("Token Transfer Failed.")
                return initialState
            }
        }, initialState)

    return (
        <ModalDialog isOpen={open} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Transfer Token
            </h2>
            <form action={formAction} className="space-y-6">
                <div className="space-y-4">
                    <div className='flex items-center gap-4'>
                        <div className="flex justtify-center items-center gap-4">
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    {tokenData?.logo ?
                                        <ProfileImage
                                            imgUrl={tokenData.logo}
                                            alt={"Token Logo"}
                                            className="w-16 h-16 rounded-lg" />
                                        : <CheckBadgeIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    }
                                </div>
                            </div>
                            <div className='text-lg font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-lg'>
                                {tokenData?.tokenTicker}
                            </div>
                        </div>
                        <div className='w-full'>
                            <input
                                name="amount"
                                type="number"
                                step={0.001}
                                placeholder="Amount to send"
                                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                            />
                            {state?.errors?.amount &&
                                state.errors.amount.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div>
                        <input
                            name="recipient"
                            type="text"
                            placeholder="Recipient address"
                            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                        />
                        {state?.errors?.recipient &&
                            state.errors.recipient.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    Only send AO ecosystem assets to this address
                </div>

                {/* Form Error */}
                <div id='form-error' aria-live="polite" aria-atomic="true">
                    {state?.message && state?.message != "success" &&
                        <p className="text-sm text-red-500">
                            {state.message}
                        </p>
                    }
                </div>

                <AnimatedButton
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <Loader />
                            Sending ...
                        </div>
                    ) : (
                        'Send Token'
                    )}
                </AnimatedButton>
            </form>
        </ModalDialog>
    )
}

export function SwapModal({ open, onClose }: {
    open: boolean
    onClose: () => void,
}) {
    const { rank, fetchRankData } = useRank();
    const initialState: SwapTokenState = { message: null, errors: {} };

    const [state, formAction, isSubmitting] = useActionState(
        async (_prevState: SwapTokenState, _formData: FormData) => {
            try {
                const newState = await swap(rank.points, _prevState, _formData);

                if (newState.message == "success") {
                    onClose();
                    fetchRankData();

                    toast.success("Points Swapped successful.");
                }
                return newState
            } catch (error) {
                console.error(error);

                toast.error("Points Swap Failed.")
                return initialState
            }
        }, initialState);

    return (
        <ModalDialog isOpen={open} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Swap AOS points to AOS Token
            </h2>
            <form action={formAction} className="space-y-6">
                <div className="space-y-4">
                    <input
                        name="aosPoints"
                        type="number"
                        placeholder="Enter AOS Points to Swap"
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    />
                    {state?.errors?.aosPoints &&
                        state.errors.aosPoints.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>

                {/* Form Error */}
                <div id='form-error' aria-live="polite" aria-atomic="true">
                    {state?.message && state?.message != "success" &&
                        <p className="text-sm text-red-500">
                            {state.message}
                        </p>
                    }
                </div>

                <AnimatedButton
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <Loader />
                            Swapping ...
                        </div>
                    ) : (
                        'Swap AOS Points'
                    )}
                </AnimatedButton>
            </form>
        </ModalDialog>
    )
}
