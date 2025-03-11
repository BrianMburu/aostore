// components/Toaster.tsx
'use client';

import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                className: 'text-sm font-medium',
                success: {
                    iconTheme: {
                        primary: '#4f46e5',
                        secondary: 'white',
                    },
                },
            }}
        />
    );
}