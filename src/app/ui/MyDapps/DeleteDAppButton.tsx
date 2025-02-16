// app/mydapps/[appId]/DeleteDAppButton.tsx
'use client'

import { useState } from 'react'
import ConfirmationDialog from './ConfirmationDialog';
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { DAppService } from '@/services/ao/dappService';

export default function DeleteDAppButton({
    appId,
    appName,
}: {
    appId: string
    appName: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            await DAppService.deleteDApp(appId);

            router.push('/mydapps')
            router.refresh()

            toast.success(`DApp ${appName} deleted successfully`)

        } catch {
            toast.error('Failed to delete DApp')
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Delete DApp
            </button>

            <ConfirmationDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete "${appName}"? This action cannot be undone.`}
            />
        </>
    )
}