import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GripVertical, Layers } from 'lucide-react';
import { AnimatedToggle } from './icons/CollapseIcons';
import { Button } from './ui/button';
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
    const [draggedCard, setDraggedCard] = useState<string | null>(null);

    // Sync content from parent while preserving local expansion/order state
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

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      expandAll,
      collapseAll,
      toggleCollapse: () => {}, // No longer needed - controlled by parent
    }));

    const handleDragStart = (e: React.DragEvent, cardId: string) => {
      setDraggedCard(cardId);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetCardId: string) => {
      e.preventDefault();

      if (!draggedCard || draggedCard === targetCardId) return;

      const draggedIndex = artifacts.findIndex(card => card.id === draggedCard);
      const targetIndex = artifacts.findIndex(card => card.id === targetCardId);

      const newArtifacts = [...artifacts];
      const [removed] = newArtifacts.splice(draggedIndex, 1);
      newArtifacts.splice(targetIndex, 0, removed);

      setArtifacts(newArtifacts);
      onReorder?.(newArtifacts);
      setDraggedCard(null);
    };

    if (isCollapsed) {
      return (
        <motion.aside
          initial={{ width: 420 }}
          animate={{ width: 64 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-16 bottom-24 z-50 flex flex-col shell-surface shell-panel-depth shell-border-l"
        >
          {/* Panel toggle */}
          <div className="flex justify-end p-2">
            <button onClick={onToggleCollapse} className="w-12 h-12 flex items-center justify-center shell-accent-text shell-icon-btn">
              <AnimatedToggle isOpen={false} direction="horizontal" size={28} />
            </button>
          </div>
          {/* Collapsed Artifact Navigation */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2 flex flex-col items-center">
              {artifacts.map((artifact) => (
                <Tooltip key={artifact.id}>
                  <TooltipTrigger asChild>
                    <button
                      className="w-12 h-12 flex items-center justify-center rounded-lg transition-all shell-icon hover:bg-[var(--shell-border)] hover:shadow-sm border border-transparent hover:border-[var(--shell-border)] relative"
                    >
                      <span className="shell-icon">{artifact.icon || <Layers className="w-5 h-5" />}</span>
                      <GripVertical className="w-3 h-3 shell-icon absolute right-0.5 top-1/2 -translate-y-1/2 opacity-50" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div className="text-xs">
                      <div className="font-semibold">{artifact.title}</div>
                      {artifact.badge && (
                        <div className="shell-text-muted mt-0.5">{artifact.badge}</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
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
        className="fixed right-0 top-16 bottom-24 z-50 flex flex-col relative shell-surface shell-panel-depth shell-border-l"
      >
        {/* Panel toggle */}
        <div className="flex justify-end p-2">
          <button onClick={onToggleCollapse} className="w-12 h-12 flex items-center justify-center shell-accent-text shell-icon-btn">
            <AnimatedToggle isOpen={true} direction="horizontal" size={28} />
          </button>
        </div>
        {/* Stacked Artifact Cards */}
        <div className="flex-1 overflow-y-auto p-4 pt-2">
          <div className="space-y-3">
            {artifacts.map((artifact, index) => (
              <motion.div
                key={artifact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                draggable
                onDragStart={(e) => handleDragStart(e, artifact.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, artifact.id)}
                className={`rounded-lg shadow-sm transition-all hover:shadow-md shell-bg shell-border ${
                  draggedCard === artifact.id ? 'opacity-50 scale-95' : 'opacity-100'
                }`}
              >
                {/* Card Header */}
                <div className="p-3 flex items-center gap-3 cursor-move hover:bg-[var(--shell-border)] transition-colors">
                  <GripVertical className="w-4 h-4 shell-icon flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="shell-icon">{artifact.icon}</span>
                    <h3 className="font-semibold text-sm shell-text truncate">{artifact.title}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {artifact.badge && (
                      <span className="text-xs px-1.5 py-0.5 rounded shell-surface shell-border shell-text-muted">
                        {artifact.badge}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleCardExpansion(artifact.id)}
                      className="h-7 w-7 hover:bg-[var(--shell-border)] flex-shrink-0"
                    >
                      {artifact.isExpanded ? (
                        <AnimatedToggle isOpen={true} direction="vertical" size={14} />
                                              ) : (
                        <AnimatedToggle isOpen={false} direction="vertical" size={14} />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Card Content */}
                <AnimatePresence>
                  {artifact.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden shell-border-t"
                    >
                      <div className="p-3">
                        {artifact.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>
    );
  }
);

ArtifactStack.displayName = 'ArtifactStack';