import { motion } from 'motion/react';

interface CanvasHeaderProps {
  title?: string;
  subtitle?: string;
}

export function CanvasHeader({ 
  title = 'The Canvas', 
  subtitle = 'Chat-first operations. Ask anything, action everything.' 
}: CanvasHeaderProps) {
  return (
    <div className="mb-12">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold mb-3 text-gray-900 dark:text-white"
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-gray-600 dark:text-gray-400 text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}