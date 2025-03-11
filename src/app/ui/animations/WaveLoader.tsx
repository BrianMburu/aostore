// components/Loader.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

type WaveProps = {
  delay?: number;
};

const Wave = ({ delay = 0 }: WaveProps) => {
  return (
    <motion.div
      className="absolute w-52 h-52 rounded-full border border-blue-500 dark:border-blue-400"
      animate={{
        scale: [0, 1.5, 3],
        opacity: [1, 0.5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeOut',
        delay,
      }}
    />
  );
};

export const WaveLoader = () => {
  return (
    <AnimatePresence>
      <div className="relative flex items-center justify-center h-screen w-full bg-white dark:bg-gray-800">
        {/* Waves animations */}
        {[...Array(5)].map((_, i) => (
          <Wave key={i} delay={i * 0.2} />
        ))}

        {/* Centered pulsing text */}
        <motion.div
          className="relative z-10 text-2xl font-bold text-gray-900 dark:text-gray-100"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          Verifying Session
        </motion.div>
      </div>
    </AnimatePresence>

  );
};