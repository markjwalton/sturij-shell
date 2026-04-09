import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, GripVertical, Minimize2, Maximize2, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
}

export interface ArtifactStackHandle {
  expandAll: () => void;
  collapseAll: () => void;
  toggleCollapse: () => void;
}

export const ArtifactStack = forwardRef<ArtifactStackHandle, ArtifactStackProps>(
  ({ artifacts: initialArtifacts, onReorder, isCollapsed = false }, ref) => {
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
          className="border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col"
        >
          {/* Collapsed Artifact Navigation */}
          <div className="flex-1 overflow-y-auto p-2 pt-6">
            <div className="space-y-2 flex flex-col items-center">
              {artifacts.map((artifact) => (
                <Tooltip key={artifact.id}>
                  <TooltipTrigger asChild>
                    <button
                      className="w-12 h-12 flex items-center justify-center rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      {artifact.icon || <Layers className="w-5 h-5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div className="text-xs">
                      <div className="font-semibold">{artifact.title}</div>
                      {artifact.badge && (
                        <div className="text-gray-400 mt-0.5">{artifact.badge}</div>
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
        className="border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col relative"
      >
        {/* Stacked Artifact Cards */}
        <div className="flex-1 overflow-y-auto p-4 pt-6">
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
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md ${
                  draggedCard === artifact.id ? 'opacity-50 scale-95' : 'opacity-100'
                }`}
              >
                {/* Card Header */}
                <div className="p-3 flex items-center gap-3 cursor-move hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    {artifact.icon}
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{artifact.title}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {artifact.badge && (
                      <Badge 
                        className={`text-xs ${artifact.badgeColor || 'bg-blue-100 text-blue-700'}`}
                      >
                        {artifact.badge}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleCardExpansion(artifact.id)}
                      className="h-7 w-7 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
                    >
                      {artifact.isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
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
                      className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
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