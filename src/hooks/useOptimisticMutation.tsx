/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useOptimisticMutation.ts
'use client'

import { useOptimistic } from 'react'

export function useOptimisticMutation<T>(
    initialData: T,
    updateFn: (current: T, mutation: any) => T
) {
    const [optimisticData, setOptimisticData] = useOptimistic(
        initialData,
        updateFn
    )

    const execute = async (mutation: Promise<any>, optimisticUpdate: any) => {
        try {
            setOptimisticData(optimisticUpdate)
            await mutation
        } catch (error) {
            // Revert optimistic update on error
            setOptimisticData(initialData)
            throw error
        }
    }

    return [optimisticData, execute] as const
}