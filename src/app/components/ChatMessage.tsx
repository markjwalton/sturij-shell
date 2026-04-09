import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  timestamp: string;
  actions?: Array<{ label: string; primary?: boolean; onClick?: () => void }>;
}

export function ChatMessage({ message, timestamp, actions }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-4 mb-4"
    >
      <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl p-5 shadow-sm shell-surface shell-border">
          <div
            className="leading-relaxed text-sm"
            style={{ color: 'var(--shell-text-primary)' }}
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <div className="text-xs mt-3 flex items-center gap-2" style={{ color: 'var(--shell-text-muted)' }}>
            <span className="font-medium">Sturij AI</span>
            <span>·</span>
            <span>{timestamp}</span>
          </div>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  action.primary
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                    : 'border border-gray-300 dark:border-gray-600 hover:border-gray-400 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
