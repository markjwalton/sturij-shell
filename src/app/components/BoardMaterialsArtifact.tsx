import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Paintbrush, DoorOpen, Layers, Grid3X3, GripHorizontal, Check, ChevronDown, Home } from 'lucide-react';
import { DesignPlayground } from './DesignPlayground';
import type { ColourSwatch } from './ColourSwatchTicker';

export interface WardrobeConfig {
  roomType?: string;
  wallWidth?: string;
  doorStyle?: string;
  fittings?: string[];
  doorColour?: string;
  externalPanelColour?: string;
  internalCarcassColour?: string;
  handleStyle?: string;
  wallColour?: string;
  // Candidate swatches for the design playground
  doorColourCandidates?: ColourSwatch[];
  externalPanelColourCandidates?: ColourSwatch[];
  internalCarcassColourCandidates?: ColourSwatch[];
}

const COLOUR_MAP: Record<string, string> = {
  Ivory: '#FFFFF0',
  Sunflower: '#FFDA03',
  Sand: '#C2B280',
  Pearl: '#F0EAD6',
  Camel: '#C19A6B',
  Mocha: '#967969',
  Wheat: '#F5DEB3',
  Linen: '#FAF0E6',
  Cream: '#FFFDD0',
  Tangerine: '#FF9966',
};

const DOOR_STYLE_DESCRIPTIONS: Record<string, string> = {
  'Slab (flat panel)': 'Clean, modern flat panel with no frame detail',
  'Shaker (recessed centre panel)': 'Classic recessed centre with perimeter frame',
  'J-Pull (integrated handle groove)': 'Handleless design with routed finger pull',
  'Glass (aluminium frame with glass panel)': 'Aluminium frame encasing glass insert',
};

const WALL_COLOURS = [
  { label: 'Warm White', value: 'warm-white', hex: '#F5F0E8', image: 'https://images.unsplash.com/photo-1750412572142-2fe98237fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVkJTIwd2FsbCUyMHdhcm0lMjB3aGl0ZXxlbnwxfHx8fDE3NzQ0Mzg4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { label: 'Cream', value: 'cream', hex: '#F5E6C8', image: 'https://images.unsplash.com/photo-1697561608795-8a384d1f4790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVkJTIwd2FsbCUyMGNyZWFtJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NDM4ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { label: 'Sage Green', value: 'sage-green', hex: '#B2BFA8', image: 'https://images.unsplash.com/photo-1767467961045-60e4294e0c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVkJTIwd2FsbCUyMHNhZ2UlMjBncmVlbiUyMGludGVyaW9yfGVufDF8fHx8MTc3NDQzODg5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { label: 'Duck Egg', value: 'duck-egg', hex: '#B5D4CB', image: 'https://images.unsplash.com/photo-1604487095575-8218eb67a4bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVkJTIwd2FsbCUyMGR1Y2slMjBlZ2clMjBibHVlfGVufDF8fHx8MTc3NDQzODg5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { label: 'Blush Pink', value: 'blush-pink', hex: '#E8C4C4', image: 'https://images.unsplash.com/photo-1633177807791-36c30da65847?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVkJTIwd2FsbCUyMGR1c3R5JTIwcGluayUyMGJsdXNofGVufDF8fHx8MTc3NDQzODg5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { label: 'Mushroom', value: 'mushroom', hex: '#B8A99A', image: 'https://images.unsplash.com/photo-1665947427023-c7706c655ea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVkJTIwd2FsbCUyMG11c2hyb29tJTIwdGF1cGV8ZW58MXx8fHwxNzc0NDM4ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { label: 'Navy', value: 'navy', hex: '#2C3E5A', image: 'https://images.unsplash.com/photo-1637270866876-86f0b1acfe7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVkJTIwd2FsbCUyMG5hdnklMjBibHVlJTIwZGFya3xlbnwxfHx8fDE3NzQ0Mzg4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { label: 'Terracotta', value: 'terracotta', hex: '#C4745A', image: 'https://images.unsplash.com/photo-1676677839898-c20f16e3e445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVkJTIwd2FsbCUyMHRlcnJhY290dGElMjBjbGF5fGVufDF8fHx8MTc3NDQzODg5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { label: 'Charcoal', value: 'charcoal', hex: '#4A4A4A', image: 'https://images.unsplash.com/photo-1700820520020-916d6ffb399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2hhcmNvYWwlMjBjb25jcmV0ZSUyMHdhbGx8ZW58MXx8fHwxNzc0NDM4ODk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
];

interface BoardMaterialsArtifactProps {
  config: WardrobeConfig;
  onRemoveCandidate?: (slotKey: string, value: string) => void;
}

type SlotKey = 'doorColour' | 'external' | 'internal';

function MaterialSlot({
  label,
  icon,
  value,
  colourName,
  isActive,
  delay,
  candidates,
  slotKey,
  openPlayground,
  isPlaygroundOpen,
}: {
  label: string;
  icon: React.ReactNode;
  value?: string;
  colourName?: string;
  isActive: boolean;
  delay: number;
  candidates?: ColourSwatch[];
  slotKey?: SlotKey;
  openPlayground?: (key: SlotKey) => void;
  isPlaygroundOpen?: boolean;
}) {
  const bgColour = colourName ? COLOUR_MAP[colourName] || '#6B7280' : undefined;
  const hasCandidates = candidates && candidates.length > 0;
  const isFinalized = value && (!candidates || candidates.length <= 1);
  const isClickable = hasCandidates && !isFinalized && slotKey && openPlayground;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`relative rounded-xl border overflow-hidden transition-all ${
        isPlaygroundOpen
          ? 'border-teal-500/60 shadow-md shadow-teal-500/10'
          : isActive
          ? 'border-teal-500/50 shadow-md shadow-teal-500/10'
          : value
          ? 'border-gray-200 dark:border-gray-700'
          : 'border-dashed border-gray-300 dark:border-gray-600'
      } ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={() => {
        if (isClickable) openPlayground(slotKey);
      }}
    >
      {/* Finalized colour preview band */}
      {isFinalized && bgColour && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-16 w-full origin-left"
          style={{ backgroundColor: bgColour }}
        />
      )}

      {/* Candidate swatches row (small circles) */}
      {hasCandidates && !isFinalized && (
        <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 flex items-center px-3 gap-1.5 overflow-hidden">
          {candidates.map((s) => (
            <motion.div
              key={s.value}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0"
            >
              <img src={s.image} alt={s.label} className="w-full h-full object-cover" />
            </motion.div>
          ))}
          {candidates.length > 1 && (
            <div className="ml-auto flex-shrink-0">
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isPlaygroundOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!bgColour && !value && !hasCandidates && (
        <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-600" />
        </div>
      )}

      {/* Non-colour value (e.g. handle style) */}
      {!bgColour && value && !hasCandidates && (
        <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
        </div>
      )}

      <div className="p-3 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 dark:text-gray-500">{icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-xs text-gray-800 dark:text-gray-200 truncate">
              {isFinalized && value ? value : hasCandidates ? (
                <span className="text-teal-500">{candidates.length} option{candidates.length !== 1 ? 's' : ''} shortlisted</span>
              ) : value || (
                <span className="text-gray-400 dark:text-gray-500 italic">Awaiting selection…</span>
              )}
            </p>
          </div>
          {isFinalized && value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 rounded-full bg-teal-500/15 flex items-center justify-center"
            >
              <Check className="w-2.5 h-2.5 text-teal-500" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Active pulse ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl border-2 border-teal-500/40 pointer-events-none"
          >
            <motion.div
              animate={{ opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-xl border border-teal-400/30"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function BoardMaterialsArtifact({ config, onRemoveCandidate }: BoardMaterialsArtifactProps) {
  const [openPlaygroundKey, setOpenPlaygroundKey] = useState<SlotKey | null>(null);
  const [selectedWallColour, setSelectedWallColour] = useState<string | null>(null);
  const [showWallPicker, setShowWallPicker] = useState(false);

  const wallColour = WALL_COLOURS.find(w => w.value === selectedWallColour);
  const isDarkWall = wallColour && ['navy', 'charcoal', 'terracotta'].includes(wallColour.value);

  const activeSlot = !config.doorStyle
    ? 'door'
    : !config.doorColour
    ? 'doorColour'
    : !config.externalPanelColour
    ? 'external'
    : !config.internalCarcassColour
    ? 'internal'
    : !config.handleStyle
    ? 'handle'
    : null;

  // Auto-open playground when candidates are added to the active colour slot
  useEffect(() => {
    if (activeSlot === 'doorColour' && (config.doorColourCandidates?.length || 0) > 1) {
      setOpenPlaygroundKey('doorColour');
    } else if (activeSlot === 'external' && (config.externalPanelColourCandidates?.length || 0) > 1) {
      setOpenPlaygroundKey('external');
    } else if (activeSlot === 'internal' && (config.internalCarcassColourCandidates?.length || 0) > 1) {
      setOpenPlaygroundKey('internal');
    }
  }, [activeSlot, config.doorColourCandidates?.length, config.externalPanelColourCandidates?.length, config.internalCarcassColourCandidates?.length]);

  const completedCount = [
    config.doorStyle,
    config.doorColour,
    config.externalPanelColour,
    config.internalCarcassColour,
    config.handleStyle,
  ].filter(Boolean).length;

  const togglePlayground = (key: SlotKey) => {
    setOpenPlaygroundKey(prev => prev === key ? null : key);
  };

  const getCandidates = (key: SlotKey): ColourSwatch[] => {
    switch (key) {
      case 'doorColour': return config.doorColourCandidates || [];
      case 'external': return config.externalPanelColourCandidates || [];
      case 'internal': return config.internalCarcassColourCandidates || [];
    }
  };

  const handleRemoveSwatch = (key: SlotKey, value: string) => {
    onRemoveCandidate?.(key, value);
  };

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.roomType && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {config.roomType} • {config.wallWidth ? `${config.wallWidth}mm` : '—'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Wall colour button */}
          <button
            onClick={() => setShowWallPicker(!showWallPicker)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] transition-all border ${
              showWallPicker
                ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {wallColour ? (
              <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" style={{ backgroundColor: wallColour.hex }} />
            ) : (
              <Home className="w-3 h-3" />
            )}
            <span>Wall</span>
          </button>
          <div className="flex items-center gap-1.5">
            <div className="text-[10px] text-gray-400 dark:text-gray-500">{completedCount}/5</div>
            <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / 5) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wall Colour Picker */}
      <AnimatePresence>
        {showWallPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
              <div className="flex items-center gap-2 mb-2.5">
                <Home className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Set Room Wall Colour</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {WALL_COLOURS.map((colour) => {
                  const isSelected = selectedWallColour === colour.value;
                  return (
                    <motion.button
                      key={colour.value}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedWallColour(isSelected ? null : colour.value);
                      }}
                      className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-teal-500 shadow-md shadow-teal-500/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      title={colour.label}
                    >
                      <div className="w-full h-full" style={{ backgroundColor: colour.hex }} />
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 bg-teal-500/30 flex items-center justify-center"
                        >
                          <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {wallColour && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center"
                >
                  {wallColour.label}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wall colour background wrapper for Door Style + Colour Grid */}
      <motion.div
        className="rounded-xl p-3 -mx-1 transition-all duration-500 space-y-4"
        animate={{
          backgroundColor: wallColour ? wallColour.hex : 'rgba(0, 0, 0, 0)',
        }}
        style={{
          backgroundImage: wallColour ? `linear-gradient(135deg, ${wallColour.hex}dd, ${wallColour.hex})` : undefined,
        }}
      >
        {/* Door Style */}
        <div>
          <MaterialSlot
            label="Door Style"
            icon={<DoorOpen className="w-3.5 h-3.5" />}
            value={config.doorStyle}
            isActive={activeSlot === 'door'}
            delay={0}
          />
          {config.doorStyle && DOOR_STYLE_DESCRIPTIONS[config.doorStyle] && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1"
            >
              {DOOR_STYLE_DESCRIPTIONS[config.doorStyle]}
            </motion.p>
          )}
        </div>

        {/* Colour grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0">
            <MaterialSlot
              label="Door Colour"
              icon={<Paintbrush className="w-3.5 h-3.5" />}
              value={config.doorColour}
              colourName={config.doorColour}
              isActive={activeSlot === 'doorColour'}
              delay={0.05}
              candidates={config.doorColourCandidates}
              slotKey="doorColour"
              openPlayground={togglePlayground}
              isPlaygroundOpen={openPlaygroundKey === 'doorColour'}
            />
            <AnimatePresence>
              {openPlaygroundKey === 'doorColour' && (config.doorColourCandidates?.length || 0) > 1 && (
                <DesignPlayground
                  swatches={config.doorColourCandidates || []}
                  onRemoveSwatch={(v) => handleRemoveSwatch('doorColour', v)}
                  onOrderSample={(s) => console.log('Order samples:', s)}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-0">
            <MaterialSlot
              label="External Panels"
              icon={<Layers className="w-3.5 h-3.5" />}
              value={config.externalPanelColour}
              colourName={config.externalPanelColour}
              isActive={activeSlot === 'external'}
              delay={0.1}
              candidates={config.externalPanelColourCandidates}
              slotKey="external"
              openPlayground={togglePlayground}
              isPlaygroundOpen={openPlaygroundKey === 'external'}
            />
            <AnimatePresence>
              {openPlaygroundKey === 'external' && (config.externalPanelColourCandidates?.length || 0) > 1 && (
                <DesignPlayground
                  swatches={config.externalPanelColourCandidates || []}
                  onRemoveSwatch={(v) => handleRemoveSwatch('external', v)}
                  onOrderSample={(s) => console.log('Order samples:', s)}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-0">
            <MaterialSlot
              label="Internal Carcass"
              icon={<Grid3X3 className="w-3.5 h-3.5" />}
              value={config.internalCarcassColour}
              colourName={config.internalCarcassColour}
              isActive={activeSlot === 'internal'}
              delay={0.15}
              candidates={config.internalCarcassColourCandidates}
              slotKey="internal"
              openPlayground={togglePlayground}
              isPlaygroundOpen={openPlaygroundKey === 'internal'}
            />
            <AnimatePresence>
              {openPlaygroundKey === 'internal' && (config.internalCarcassColourCandidates?.length || 0) > 1 && (
                <DesignPlayground
                  swatches={config.internalCarcassColourCandidates || []}
                  onRemoveSwatch={(v) => handleRemoveSwatch('internal', v)}
                  onOrderSample={(s) => console.log('Order samples:', s)}
                />
              )}
            </AnimatePresence>
          </div>

          <MaterialSlot
            label="Handle Style"
            icon={<GripHorizontal className="w-3.5 h-3.5" />}
            value={config.handleStyle}
            isActive={activeSlot === 'handle'}
            delay={0.2}
          />
        </div>
      </motion.div>

      {/* Fittings summary */}
      {config.fittings && config.fittings.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-2 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Internal Fittings</p>
          <div className="flex flex-wrap gap-1">
            {config.fittings.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-300"
              >
                <Check className="w-2.5 h-2.5 text-teal-500" />
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}