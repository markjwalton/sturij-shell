import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, Check, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';

// swatch removed
// swatch removed
// swatch removed
// swatch removed
// swatch removed
// swatch removed
// swatch removed
// swatch removed
// swatch removed
// swatch removed

export interface ColourSwatch {
  label: string;
  value: string;
  image: string;
  hue: number; // 0-360
}

export const COLOUR_SWATCHES: ColourSwatch[] = [
  { label: 'Ivory', value: 'Ivory', image: swatch1, hue: 60 },
  { label: 'Sunflower', value: 'Sunflower', image: swatch2, hue: 50 },
  { label: 'Sand', value: 'Sand', image: swatch3, hue: 38 },
  { label: 'Pearl', value: 'Pearl', image: swatch4, hue: 55 },
  { label: 'Camel', value: 'Camel', image: swatch5, hue: 30 },
  { label: 'Mocha', value: 'Mocha', image: swatch6, hue: 20 },
  { label: 'Wheat', value: 'Wheat', image: swatch7, hue: 42 },
  { label: 'Linen', value: 'Linen', image: swatch8, hue: 48 },
  { label: 'Cream', value: 'Cream', image: swatch9, hue: 57 },
  { label: 'Tangerine', value: 'Tangerine', image: swatch10, hue: 15 },
];

interface ColourSwatchTickerProps {
  question: string;
  swatches?: ColourSwatch[];
  onAnswer: (value: string | string[]) => void;
  onHueRangeChange?: (hueMin: number, hueMax: number, isFiltering: boolean) => void;
  onAddCandidate?: (swatch: ColourSwatch) => void;
  selectedCandidates?: ColourSwatch[];
}

function isHueInRange(hue: number, min: number, max: number): boolean {
  if (min <= max) {
    return hue >= min && hue <= max;
  }
  // Wrapping range (e.g. 340 → 20)
  return hue >= min || hue <= max;
}

export function ColourSwatchTicker({ question, swatches = COLOUR_SWATCHES, onAnswer, onHueRangeChange, onAddCandidate, selectedCandidates }: ColourSwatchTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [hueMin, setHueMin] = useState(0);
  const [hueMax, setHueMax] = useState(360);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [, forceRender] = useState(0);
  const sliderBarRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<'min' | 'max' | null>(null);

  // Notify parent of hue range changes
  useEffect(() => {
    onHueRangeChange?.(hueMin, hueMax, showSlider && !(hueMin === 0 && hueMax === 360));
  }, [hueMin, hueMax, showSlider, onHueRangeChange]);

  // Filter swatches by hue range
  const filteredSwatches = useMemo(() => {
    if (!showSlider || (hueMin === 0 && hueMax === 360)) return swatches;
    const filtered = swatches.filter(s => isHueInRange(s.hue, hueMin, hueMax));
    return filtered.sort((a, b) => a.hue - b.hue);
  }, [swatches, hueMin, hueMax, showSlider]);

  const displaySwatches = filteredSwatches.length > 0 ? filteredSwatches : swatches;
  const duplicated = [...displaySwatches, ...displaySwatches];

  const animate = useCallback(() => {
    if (!trackRef.current) return;
    const singleSetWidth = trackRef.current.scrollWidth / 2;
    if (singleSetWidth === 0) return;

    offsetRef.current -= 0.4;
    if (Math.abs(offsetRef.current) >= singleSetWidth) {
      offsetRef.current = 0;
    }
    trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPaused, animate]);

  useEffect(() => {
    offsetRef.current = 0;
  }, [filteredSwatches.length]);

  useEffect(() => {
    forceRender((n) => n + 1);
  }, []);

  const handleSelect = (swatch: ColourSwatch) => {
    // If we have an onAddCandidate, add to shortlist instead of immediately answering
    if (onAddCandidate) {
      // Check if already selected
      const alreadySelected = selectedCandidates?.some(s => s.value === swatch.value);
      if (!alreadySelected) {
        onAddCandidate(swatch);
      }
      return;
    }
    // Fallback: original single-select behavior
    setSelected(swatch.value);
    setIsPaused(true);
    setTimeout(() => {
      onAnswer(swatch.value);
    }, 600);
  };

  // Dual-thumb drag handlers
  const getHueFromPointer = useCallback((clientX: number) => {
    if (!sliderBarRef.current) return 0;
    const rect = sliderBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * 360);
  }, []);

  const handlePointerDown = useCallback((thumb: 'min' | 'max') => (e: React.PointerEvent) => {
    e.preventDefault();
    draggingRef.current = thumb;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const hue = getHueFromPointer(e.clientX);
    if (draggingRef.current === 'min') {
      setHueMin(Math.min(hue, hueMax - 5));
    } else {
      setHueMax(Math.max(hue, hueMin + 5));
    }
  }, [getHueFromPointer, hueMin, hueMax]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  const minPct = (hueMin / 360) * 100;
  const maxPct = (hueMax / 360) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-2"
    >
      {/* Header with filter toggle */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">{question}</p>
        <button
          onClick={() => {
            const next = !showSlider;
            setShowSlider(next);
            if (!next) {
              setHueMin(0);
              setHueMax(360);
            }
          }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] transition-all ${
            showSlider
              ? 'bg-teal-600/15 text-teal-500 border border-teal-500/30'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          Filter
        </button>
      </div>

      {/* Dual-thumb hue range slider */}
      <AnimatePresence>
        {showSlider && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-1 py-3">
              {/* Rainbow bar with two thumbs */}
              <div
                ref={sliderBarRef}
                className="relative h-3 rounded-full cursor-pointer select-none"
                style={{
                  background: 'linear-gradient(to right, hsl(0,70%,60%), hsl(30,70%,60%), hsl(60,70%,60%), hsl(90,70%,60%), hsl(120,70%,60%), hsl(150,70%,60%), hsl(180,70%,60%), hsl(210,70%,60%), hsl(240,70%,60%), hsl(270,70%,60%), hsl(300,70%,60%), hsl(330,70%,60%), hsl(360,70%,60%))',
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Dimmed regions outside selection */}
                <div
                  className="absolute inset-y-0 left-0 rounded-l-full bg-black/50 pointer-events-none"
                  style={{ width: `${minPct}%` }}
                />
                <div
                  className="absolute inset-y-0 right-0 rounded-r-full bg-black/50 pointer-events-none"
                  style={{ width: `${100 - maxPct}%` }}
                />

                {/* Active range highlight border */}
                <div
                  className="absolute inset-y-[-2px] border-2 border-white/80 dark:border-white/60 rounded-full pointer-events-none"
                  style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
                />

                {/* Min thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-teal-500 shadow-lg cursor-grab active:cursor-grabbing z-10 hover:scale-110 transition-transform"
                  style={{ left: `${minPct}%` }}
                  onPointerDown={handlePointerDown('min')}
                />

                {/* Max thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-teal-500 shadow-lg cursor-grab active:cursor-grabbing z-10 hover:scale-110 transition-transform"
                  style={{ left: `${maxPct}%` }}
                  onPointerDown={handlePointerDown('max')}
                />
              </div>

              {/* Labels */}
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[9px] text-gray-400 dark:text-gray-500 tabular-nums">
                  {hueMin}°
                </span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 tabular-nums">
                  {displaySwatches.length}/{swatches.length} swatches
                </span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 tabular-nums">
                  {hueMax}°
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticker */}
      <div className="flex items-center gap-2" style={{ maxWidth: '100%' }}>
        {/* Masked viewport */}
        <div
          className="relative flex-1 min-w-0"
          style={{
            overflow: 'hidden',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          {/* Sliding track */}
          <div
            ref={trackRef}
            className="flex items-center gap-3 w-max py-1"
            style={{ willChange: 'transform' }}
          >
            {duplicated.map((swatch, index) => {
              const isSelected = selected === swatch.value;
              const isCandidate = selectedCandidates?.some(s => s.value === swatch.value);
              return (
                <button
                  key={`${swatch.value}-${index}`}
                  onClick={() => handleSelect(swatch)}
                  className="flex flex-col items-center gap-1 flex-shrink-0 group"
                >
                  <div className={`relative rounded-full overflow-hidden border-2 transition-all duration-200 ${
                    isSelected || isCandidate
                      ? 'border-teal-500 shadow-lg shadow-teal-500/30 w-14 h-14'
                      : 'border-gray-200 dark:border-gray-600 group-hover:border-teal-400 dark:group-hover:border-teal-400 w-12 h-12 group-hover:w-16 group-hover:h-16 group-hover:shadow-xl group-hover:shadow-teal-500/20'
                  }`}>
                    <img
                      src={swatch.image}
                      alt={swatch.label}
                      className="w-full h-full object-cover"
                    />
                    {(isSelected || isCandidate) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span className={`text-[10px] whitespace-nowrap transition-colors ${
                    isSelected || isCandidate
                      ? 'text-teal-500'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`}>
                    {swatch.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pause/Play Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          className="h-7 w-7 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Pause className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}