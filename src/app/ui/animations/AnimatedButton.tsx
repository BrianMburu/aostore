'use client'

import { motion } from 'framer-motion'

export function AnimatedButton({
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <motion.button
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.button>
    )
}