import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { Button } from './ui/button';

interface QuestionOption {
  label: string;
  value: string;
}

interface QuestionTickerProps {
  question: string;
  options: QuestionOption[];
  onAnswer: (value: string | string[]) => void;
}

export function QuestionTicker({ question, options, onAnswer }: QuestionTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [, forceRender] = useState(0);

  // Duplicate options so the loop is seamless
  const duplicatedOptions = [...options, ...options];

  const animate = useCallback(() => {
    if (!trackRef.current) return;
    // Half the track width = width of one set of options
    const singleSetWidth = trackRef.current.scrollWidth / 2;
    if (singleSetWidth === 0) return;

    offsetRef.current -= 0.5;
    // Reset seamlessly when we've scrolled past the first set
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

  // Force a re-render once so measurements are available
  useEffect(() => {
    forceRender((n) => n + 1);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex items-center gap-2"
      style={{ maxWidth: '100%' }}
    >
      {/* Masked viewport */}
      <div
        ref={containerRef}
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
          className="flex items-center gap-2 w-max"
          style={{ willChange: 'transform' }}
        >
          {duplicatedOptions.map((option, index) => (
            <button
              key={`${option.value}-${index}`}
              onClick={() => onAnswer(option.value)}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0"
            >
              {option.label}
            </button>
          ))}
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
    </motion.div>
  );
}
