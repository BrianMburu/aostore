'use client'

import { motion } from "framer-motion";

interface HighlightCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

export function HighlightCard({ title, value, icon }: HighlightCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="p-6 border rounded-xl dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{value}</p>
        </motion.div>
    );
}