import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface ArtifactCard {
  id: string;
  title: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  isExpanded?: boolean;
}

interface ArtifactStackProps {
  artifacts: ArtifactCard[];
  onReorder?: (artifacts: ArtifactCard[]) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface ArtifactStackHandle {
  expandAll: () => void;
  collapseAll: () => void;
  toggleCollapse: () => void;
}

export const ArtifactStack = forwardRef<ArtifactStackHandle, ArtifactStackProps>(
  ({ artifacts: initialArtifacts, onReorder, isCollapsed = false, onToggleCollapse }, ref) => {
    const [artifacts, setArtifacts] = useState(initialArtifacts);

    useEffect(() => {
      setArtifacts(prev =>
        prev.map(card => {
          const updated = initialArtifacts.find(a => a.id === card.id);
          if (updated) {
            return { ...card, content: updated.content, badge: updated.badge, badgeColor: updated.badgeColor, title: updated.title, icon: updated.icon };
          }
          return card;
        })
      );
    }, [initialArtifacts]);

    const toggleCardExpansion = (cardId: string) => {
      setArtifacts(prev =>
        prev.map(card =>
          card.id === cardId ? { ...card, isExpanded: !card.isExpanded } : card
        )
      );
    };

    const expandAll = () => {
      setArtifacts(prev => prev.map(card => ({ ...card, isExpanded: true })));
    };

    const collapseAll = () => {
      setArtifacts(prev => prev.map(card => ({ ...card, isExpanded: false })));
    };

    useImperativeHandle(ref, () => ({
      expandAll,
      collapseAll,
      toggleCollapse: () => {},
    }));

    if (isCollapsed) {
      return (
        <motion.aside
          initial={{ width: 420 }}
          animate={{ width: 64 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-[65px] bottom-[97px] z-50 flex flex-row shell-surface shell-panel-depth"
        >
          <div className="shell-accent-rule-v" />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex flex-col gap-1 items-center">
                {artifacts.map((artifact) => (
                  <Tooltip key={artifact.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleCardExpansion(artifact.id)}
                        className={`w-12 h-12 flex items-center justify-center rounded-lg border-none cursor-pointer transition-all ${
                          artifact.isExpanded
                            ? 'shell-nav-active shell-nav-active-text'
                            : 'shell-icon hover:bg-[var(--shell-border)]'
                        }`}
                      >
                        {artifact.icon || <Layers className="w-7 h-7" strokeWidth={1.5} />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">{artifact.title}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      );
    }

    return (
      <motion.aside
        initial={false}
        animate={{ width: 420 }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-[65px] bottom-[97px] z-50 flex flex-row shell-surface shell-panel-depth"
      >
        <div className="shell-accent-rule-v" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex flex-col gap-1">
              {artifacts.map((artifact) => (
                <div key={artifact.id}>
                  <button
                    onClick={() => toggleCardExpansion(artifact.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border-none cursor-pointer text-left text-sm transition-all ${
                      artifact.isExpanded
                        ? 'shell-nav-active shell-nav-active-text font-medium'
                        : 'shell-text-muted font-normal hover:bg-[var(--shell-border)]'
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {artifact.icon || <Layers className="w-7 h-7" strokeWidth={1.5} />}
                    </span>
                    <span className="whitespace-nowrap text-base truncate">{artifact.title}</span>
                  </button>

                  <AnimatePresence>
                    {artifact.isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 shell-bg">
                          {artifact.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>
    );
  }
);

ArtifactStack.displayName = 'ArtifactStack';
