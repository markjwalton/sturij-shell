import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Check, Pause, Play } from 'lucide-react';

type QuestionType = 'multiple-choice' | 'radio' | 'text-input';

interface QuestionOption {
  label: string;
  value: string;
}

interface ChatQuestionProps {
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  placeholder?: string;
  onSubmit: (answer: string | string[]) => void;
}

export function ChatQuestion({ type, question, options = [], placeholder, onSubmit }: ChatQuestionProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textValue, setTextValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Auto-scroll effect for multiple-choice
  useEffect(() => {
    if (type !== 'multiple-choice' || isPaused || isDragging || submitted) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const maxScroll = (scrollRef.current?.scrollWidth || 0) - (scrollRef.current?.clientWidth || 0);
        const newPosition = prev + 0.5;
        return newPosition >= maxScroll ? 0 : newPosition;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [type, isPaused, isDragging, submitted]);

  // Apply scroll position
  useEffect(() => {
    if (scrollRef.current && !isDragging) {
      scrollRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition, isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const delta = dragStartX.current - e.clientX;
    scrollRef.current.scrollLeft = dragStartScroll.current + delta;
  };

  const handleDragEnd = () => {
    if (isDragging && scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
    setIsDragging(false);
  };

  const handleMultipleChoiceClick = (value: string) => {
    if (submitted) return;
    setSubmitted(true);
    setSelectedValues([value]);
    setTimeout(() => onSubmit(value), 300);
  };

  const handleRadioChange = (value: string) => {
    if (submitted) return;
    setSelectedValues([value]);
  };

  const handleRadioSubmit = () => {
    if (selectedValues.length === 0 || submitted) return;
    setSubmitted(true);
    setTimeout(() => onSubmit(selectedValues[0]), 300);
  };

  const handleTextSubmit = () => {
    if (!textValue.trim() || submitted) return;
    setSubmitted(true);
    setTimeout(() => onSubmit(textValue), 300);
  };

  if (type === 'multiple-choice') {
    return (
      <div className="space-y-3 mt-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{question}</p>
        <div className="flex items-center gap-2 max-w-full">
          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-hidden flex-1 cursor-grab active:cursor-grabbing select-none min-w-0"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {/* Duplicate options for endless effect */}
            {[...options, ...options].map((option, idx) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={idx}
                  onClick={() => handleMultipleChoiceClick(option.value)}
                  disabled={submitted}
                  className={`
                    px-4 py-2 rounded-full text-sm whitespace-nowrap flex-shrink-0 transition-all
                    ${isSelected && submitted
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20'
                    }
                    ${submitted ? 'cursor-default opacity-60' : ''}
                  `}
                >
                  {isSelected && submitted && <Check className="w-4 h-4 inline mr-2" />}
                  {option.label}
                </button>
              );
            })}
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
      </div>
    );
  }

  if (type === 'radio') {
    return (
      <div className="space-y-3 mt-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{question}</p>
        <div className="space-y-2">
          {options.map((option, idx) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <motion.label
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                  ${isSelected
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-teal-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                  ${submitted ? 'cursor-default opacity-60' : ''}
                `}
              >
                <input
                  type="radio"
                  name="radio-question"
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  disabled={submitted}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
              </motion.label>
            );
          })}
        </div>
        {selectedValues.length > 0 && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleRadioSubmit}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-full mt-3"
            >
              Submit
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  if (type === 'text-input') {
    return (
      <div className="space-y-3 mt-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{question}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder={placeholder || 'Type your answer...'}
            disabled={submitted}
            className={`
              flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              ${submitted ? 'opacity-60 cursor-default' : ''}
            `}
          />
          <Button
            onClick={handleTextSubmit}
            disabled={!textValue.trim() || submitted}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6"
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }

  return null;
}