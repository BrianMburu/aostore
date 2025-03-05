// components/FloatingActionButton.tsx
'use client';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { AnimatedButton } from '../../animations/AnimatedButton';

export function AddAirdropFloatingButton({ onClick }: { onClick: () => void }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <AnimatedButton
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-8 right-8 flex items-center gap-2 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200"
        >
            <PlusIcon className="h-6 w-6" />
            {isHovered && (
                <span className="pr-2 text-sm font-medium">Add Airdrop</span>
            )}
        </AnimatedButton>
    );
}