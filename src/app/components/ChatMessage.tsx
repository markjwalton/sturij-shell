import { ColourSwatchTicker } from './ColourSwatchTicker';
import type { ColourSwatch } from './ColourSwatchTicker';
import { useState, useCallback } from 'react';
import { QuestionTicker } from './QuestionTicker';
import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface QuestionOption {
  label: string;
  value: string;
}

interface ChatMessageProps {
  message: string;
  timestamp: string;
  actions?: Array<{ label: string; primary?: boolean; onClick?: () => void }>;
  showSomethingElse?: boolean;
  onSomethingElse?: () => void;
  isFaded?: boolean;
  embeddedQuestion?: {
    type: 'multiple-choice' | 'checkbox' | 'radio' | 'text-input' | 'colour-swatch';
    question: string;
    options?: QuestionOption[];
    placeholder?: string;
  };
  onAnswer?: (value: string | string[]) => void;
  onAddCandidate?: (swatch: ColourSwatch) => void;
  selectedCandidates?: ColourSwatch[];
}

export function ChatMessage({ message, timestamp, actions, showSomethingElse, onSomethingElse, isFaded = false, embeddedQuestion, onAnswer, onAddCandidate, selectedCandidates }: ChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [hueGradient, setHueGradient] = useState<{ min: number; max: number; active: boolean }>({ min: 0, max: 360, active: false });
  
  // Show ticker if there's an embedded question with options
  const showTicker = embeddedQuestion && embeddedQuestion.type === 'multiple-choice' && embeddedQuestion.options && embeddedQuestion.options.length > 0;
  const showTextInput = embeddedQuestion && embeddedQuestion.type === 'text-input';
  const showCheckboxes = embeddedQuestion && (embeddedQuestion.type === 'checkbox' || embeddedQuestion.type === 'radio') && embeddedQuestion.options && embeddedQuestion.options.length > 0 && !answered;
  const showColourSwatch = embeddedQuestion && embeddedQuestion.type === 'colour-swatch';

  const handleHueRangeChange = useCallback((hueMin: number, hueMax: number, isFiltering: boolean) => {
    setHueGradient({ min: hueMin, max: hueMax, active: isFiltering });
  }, []);

  // Build gradient style for bubble when colour filtering is active
  const bubbleGradientStyle = (showColourSwatch && hueGradient.active)
    ? {
        background: `linear-gradient(135deg, hsl(${hueGradient.min}, 40%, 25%) 0%, hsl(${Math.round((hueGradient.min + hueGradient.max) / 2)}, 35%, 22%) 50%, hsl(${hueGradient.max}, 40%, 25%) 100%)`,
        borderColor: `hsl(${hueGradient.min}, 30%, 35%)`,
      }
    : undefined;

  const handleOptionToggle = (value: string) => {
    if (embeddedQuestion?.type === 'radio') {
      // Radio: single select, submit immediately
      setSelectedOptions([value]);
      setAnswered(true);
      onAnswer?.(value);
    } else {
      // Multiple choice: toggle
      setSelectedOptions(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  const handleSubmitSelection = () => {
    if (selectedOptions.length > 0 && onAnswer) {
      setAnswered(true);
      onAnswer(selectedOptions.length === 1 ? selectedOptions[0] : selectedOptions);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-4 mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          opacity: isFaded && !isHovered ? 0.3 : 1 
        }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-xl transition-all"
      >
        <Sparkles className="w-5 h-5 text-white" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isFaded && !isHovered ? 0.3 : 1, 
            scale: 1 
          }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-4 border border-gray-200 dark:border-gray-700 shadow-sm"
          style={bubbleGradientStyle}
        >
          <div 
            className="text-gray-900 dark:text-gray-100 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: message }}
          />

          {/* Embedded Checkbox/Radio Options inside bubble */}
          {showCheckboxes && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-4 space-y-2"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{embeddedQuestion.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {embeddedQuestion.options!.map((option) => {
                  const isSelected = selectedOptions.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionToggle(option.value)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                        isSelected
                          ? 'bg-teal-600/15 dark:bg-teal-500/15 border-teal-500 dark:border-teal-400 text-teal-700 dark:text-teal-300'
                          : 'bg-gray-100/60 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-600/50'
                      } border`}
                    >
                      <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                        embeddedQuestion.type === 'radio' ? 'rounded-full' : 'rounded'
                      } ${
                        isSelected
                          ? 'bg-teal-600 dark:bg-teal-500 border-teal-600 dark:border-teal-500'
                          : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
              {embeddedQuestion.type === 'checkbox' && selectedOptions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pt-2"
                >
                  <button
                    onClick={handleSubmitSelection}
                    className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm transition-colors"
                  >
                    Confirm Selection
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Answered state */}
          {answered && embeddedQuestion?.options && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedOptions.map(val => (
                <span key={val} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-600/15 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs">
                  <Check className="w-3 h-3" />
                  {val}
                </span>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-2">
            <span className="font-medium">Sturij AI</span>
            <span>•</span>
            <span>{timestamp}</span>
          </div>
        </motion.div>
        
        {/* Question Ticker below the bubble for multiple-choice */}
        {showTicker && onAnswer && (
          <div className="mb-4 overflow-hidden">
            <QuestionTicker
              question={embeddedQuestion!.question}
              options={embeddedQuestion!.options}
              onAnswer={onAnswer}
            />
          </div>
        )}

        {/* Colour Swatch Ticker below the bubble */}
        {showColourSwatch && onAnswer && (
          <div className="mb-4 overflow-hidden">
            <ColourSwatchTicker
              question={embeddedQuestion!.question}
              onAnswer={onAnswer}
              onHueRangeChange={handleHueRangeChange}
              onAddCandidate={onAddCandidate}
              selectedCandidates={selectedCandidates}
            />

            {/* Shortlist status bar */}
            {onAddCandidate && selectedCandidates && selectedCandidates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  {/* Mini swatch previews */}
                  <div className="flex -space-x-1.5">
                    {selectedCandidates.slice(0, 5).map((s) => (
                      <div
                        key={s.value}
                        className="w-5 h-5 rounded-full border-2 border-gray-800 overflow-hidden"
                      >
                        <img src={s.image} alt={s.label} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {selectedCandidates.length > 5 && (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center">
                        <span className="text-[8px] text-gray-300">+{selectedCandidates.length - 5}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {selectedCandidates.length} shortlisted
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const labels = selectedCandidates.map(s => s.label).join(', ');
                    onAnswer(labels);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-white text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-500/20"
                >
                  Confirm Shortlist
                </motion.button>
              </motion.div>
            )}
          </div>
        )}

        {/* Text Input Question */}
        {showTextInput && onAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mb-4"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{embeddedQuestion.question}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (textInputValue.trim()) {
                  onAnswer(textInputValue.trim());
                  setTextInputValue('');
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                placeholder={embeddedQuestion.placeholder || 'Type your answer...'}
                className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={!textInputValue.trim()}
                className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm transition-colors"
              >
                Submit
              </button>
            </form>
          </motion.div>
        )}

        {/* Action Buttons */}
        {actions && actions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            {actions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={action.onClick}
                  className={
                    action.primary
                      ? 'bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-md hover:shadow-lg transition-all'
                      : 'rounded-full border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all text-gray-900 dark:text-gray-100'
                  }
                  variant={action.primary ? 'default' : 'outline'}
                >
                  {action.label}
                </Button>
              </motion.div>
            ))}
            
            {/* "Something else..." option */}
            {showSomethingElse && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + actions.length * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onSomethingElse}
                  className="rounded-full border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 italic"
                  variant="outline"
                >
                  ...or something else?
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}