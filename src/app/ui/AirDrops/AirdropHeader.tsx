'use client'
import { motion } from 'framer-motion';
import { AirDropsFilter } from "./AirdropsFilter";

export function AirdropHeader() {
    return (
        <div className="text-center mb-12">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
                🚀 Active Airdrops
            </motion.h1>

            <AirDropsFilter />
        </div>
    )
}