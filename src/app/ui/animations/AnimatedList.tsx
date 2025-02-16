'use client'

import { motion } from 'framer-motion'

export function AnimatedList({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {},
            }}
        >
            {children}
        </motion.div>
    )
}