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
      <div className="w-10 h-10 rounded-full shell-avatar flex items-center justify-center flex-shrink-0 shadow-md">
        <Sparkles className="w-5 h-5" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl p-5 shadow-sm bg-transparent">
          <div
            className="leading-relaxed text-sm shell-text"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <div className="text-xs mt-3 flex items-center gap-2 shell-text-muted">
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
                    ? 'shell-accent-bg shadow-sm'
                    : 'shell-action-secondary'
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
