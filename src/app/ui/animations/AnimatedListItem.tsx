'use client'

import { motion } from 'framer-motion'

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 },
            }}
        >
            {children}
        </motion.div>
    )
}