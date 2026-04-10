import { motion } from 'motion/react';

interface UserMessageProps {
  message: string;
  timestamp: string;
  userInitials: string;
}

export function UserMessage({ message, timestamp, userInitials }: UserMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-4 mb-4"
    >
      <div className="flex-1">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-2xl px-6 py-4 mb-2 shadow-lg max-w-md backdrop-blur-sm shell-accent-dim shell-text"
        >
          <div className="leading-relaxed">
            {message}
          </div>
        </motion.div>
        <div className="text-xs shell-text-muted flex items-center gap-2">
          <span>{timestamp}</span>
        </div>
      </div>
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md font-medium text-sm shell-accent-bg"
      >
        {userInitials}
      </motion.div>
    </motion.div>
  );
}