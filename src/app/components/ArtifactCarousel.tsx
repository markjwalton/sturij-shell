import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { ChevronLeft, ChevronRight, GripVertical, ChevronDown, ChevronUp, Minimize2, Maximize2, Layers } from 'lucide-react';
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

interface ArtifactCarouselProps {
  artifacts: ArtifactCard[];
  onReorder?: (artifacts: ArtifactCard[]) => void;
  isCollapsed?: boolean;
}

export interface ArtifactCarouselHandle {
  toggleCollapse: () => void;
}

export const ArtifactCarousel = forwardRef<ArtifactCarouselHandle, ArtifactCarouselProps>(
  ({ artifacts: initialArtifacts, onReorder, isCollapsed = false }, ref) => {
    const [artifacts, setArtifacts] = useState(initialArtifacts);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [draggedCard, setDraggedCard] = useState<string | null>(null);

    // Sync content from parent while preserving local state
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

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      toggleCollapse: () => {}, // No longer needed - controlled by parent
    }));

    const navigateCarousel = (direction: 'prev' | 'next') => {
      setCurrentIndex(prev => {
        if (direction === 'next') {
          return (prev + 1) % artifacts.length;
        } else {
          return prev === 0 ? artifacts.length - 1 : prev - 1;
        }
      });
    };

    // Handle mouse-based carousel drag
    const handleCarouselDragStart = (e: React.MouseEvent) => {
      setIsDragging(true);
      dragStartX.current = e.clientX;
    };

    const handleCarouselDragMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - dragStartX.current;
      dragX.set(delta);
    };

    const handleCarouselDragEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      const threshold = 100;
      const delta = dragX.get();
      
      if (delta > threshold) {
        navigateCarousel('prev');
      } else if (delta < -threshold) {
        navigateCarousel('next');
      }
      
      animate(dragX, 0, { duration: 0.3 });
    };

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

    useEffect(() => {
      const handleGlobalMouseUp = () => {
        if (isDragging) {
          handleCarouselDragEnd();
        }
      };

      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging]);

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
              {artifacts.map((artifact, idx) => (
                <Tooltip key={artifact.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                        idx === currentIndex
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 shadow-sm border border-teal-200 dark:border-teal-800'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
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

    const visibleArtifact = artifacts[currentIndex];

    return (
      <motion.aside
        initial={false}
        animate={{ width: 420 }}
        transition={{ duration: 0.3 }}
        className="border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col relative"
      >
        {/* Carousel Navigation */}
        <div className="flex items-center justify-between px-4 py-3 mt-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateCarousel('prev')}
            className="h-8 w-8 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/30"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            {artifacts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-teal-600 w-6' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2'
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateCarousel('next')}
            className="h-8 w-8 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/30"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Artifact Cards Container with Drag Support */}
        <div 
          className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
          ref={carouselRef}
          onMouseDown={handleCarouselDragStart}
          onMouseMove={handleCarouselDragMove}
          onMouseUp={handleCarouselDragEnd}
          onMouseLeave={handleCarouselDragEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ x: isDragging ? dragX : 0 }}
              className="h-full overflow-y-auto p-4"
            >
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, visibleArtifact.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, visibleArtifact.id)}
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md ${
                  draggedCard === visibleArtifact.id ? 'opacity-50 scale-95' : 'opacity-100'
                }`}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 cursor-move hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {visibleArtifact.icon}
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{visibleArtifact.title}</h3>
                    </div>
                    {visibleArtifact.badge && (
                      <Badge 
                        className={`mt-1 text-xs ${visibleArtifact.badgeColor || 'bg-blue-100 text-blue-700'}`}
                      >
                        {visibleArtifact.badge}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleCardExpansion(visibleArtifact.id)}
                    className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {visibleArtifact.isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Card Content */}
                <AnimatePresence>
                  {visibleArtifact.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4">
                        {visibleArtifact.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick Access Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {isDragging ? '← Drag to navigate →' : 'Drag cards to reorder • Swipe to navigate'}
          </div>
        </div>
      </motion.aside>
    );
  }
);

ArtifactCarousel.displayName = 'ArtifactCarousel';