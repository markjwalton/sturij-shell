import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, ChevronDown, ChevronUp, ShoppingBag, Trash2 } from 'lucide-react';
import type { ColourSwatch } from './ColourSwatchTicker';

interface DesignPlaygroundProps {
  swatches: ColourSwatch[];
  onRemoveSwatch: (value: string) => void;
  onOrderSample: (swatches: ColourSwatch[]) => void;
}

export function DesignPlayground({ swatches, onRemoveSwatch, onOrderSample }: DesignPlaygroundProps) {
  const [expandedSwatch, setExpandedSwatch] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);
  const [deletedSwatches, setDeletedSwatches] = useState<ColourSwatch[]>([]);

  const handleDelete = (swatch: ColourSwatch) => {
    if (swatches.length <= 1) return; // Can't delete the last one
    setDeletedSwatches(prev => [...prev, swatch]);
    if (expandedSwatch === swatch.value) setExpandedSwatch(null);
    onRemoveSwatch(swatch.value);
  };

  const handleRestoreSwatch = (swatch: ColourSwatch) => {
    setDeletedSwatches(prev => prev.filter(s => s.value !== swatch.value));
    // Could add back — but for now just remove from deleted
  };

  const expanded = swatches.find(s => s.value === expandedSwatch);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
        {/* Canvas area */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {expanded ? (
              /* Expanded single swatch fills canvas */
              <motion.div
                key={`expanded-${expanded.value}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <img
                  src={expanded.image}
                  alt={expanded.label}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 left-3 text-white text-xs drop-shadow-md">
                  {expanded.label}
                </div>
                <button
                  onClick={() => setExpandedSwatch(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </motion.div>
            ) : (
              /* Grid of swatches */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3"
              >
                <div className="flex flex-wrap gap-2">
                  {swatches.map((swatch) => (
                    <motion.div
                      key={swatch.value}
                      layout
                      className="group relative"
                    >
                      <button
                        onClick={() => setExpandedSwatch(swatch.value)}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 hover:border-teal-500 transition-all hover:shadow-md"
                      >
                        <img
                          src={swatch.image}
                          alt={swatch.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Maximize2 className="w-3.5 h-3.5 text-white drop-shadow-md" />
                        </div>
                      </button>
                      {/* Delete button — only if more than 1 */}
                      {swatches.length > 1 && (
                        <button
                          onClick={() => handleDelete(swatch)}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                        >
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      )}
                      <p className="text-[8px] text-gray-500 dark:text-gray-400 text-center mt-0.5 truncate w-16">
                        {swatch.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Deleted swatches / Order Sample section */}
        {deletedSwatches.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowSamples(!showSamples)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Removed ({deletedSwatches.length})
                </span>
              </div>
              {showSamples ? (
                <ChevronUp className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {showSamples && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {deletedSwatches.map((swatch) => (
                        <div
                          key={swatch.value}
                          className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 opacity-60"
                        >
                          <img
                            src={swatch.image}
                            alt={swatch.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => onOrderSample(deletedSwatches)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-[10px] transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Order Samples
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
