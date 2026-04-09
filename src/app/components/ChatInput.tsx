import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Paperclip, Send, Pause, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, placeholder = 'Ask anything or give a command...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const quickSuggestions = [
    "Show today's pipeline",
    "Schedule follow-up",
    "Generate quote",
    "Find customer history",
    "Update deal status",
    "Create new contact",
    "Send proposal",
    "Review this week's revenue",
    "Schedule team meeting",
    "Export sales report",
    "Track competitor activity",
    "Set up automation",
  ];

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || isDragging) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const maxScroll = (scrollRef.current?.scrollWidth || 0) - (scrollRef.current?.clientWidth || 0);
        const newPosition = prev + 0.5;
        return newPosition >= maxScroll ? 0 : newPosition;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, isDragging]);

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

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
          <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!message.trim()}
            className={`
              rounded-full flex-shrink-0 transition-all
              ${
                message.trim()
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Quick Suggestions Carousel */}
        <div className="mt-3 flex items-center gap-2">
          <div 
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-hidden flex-1 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {/* Duplicate suggestions for endless effect */}
            {[...quickSuggestions, ...quickSuggestions].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0"
              >
                {suggestion}
              </button>
            ))}
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
    </div>
  );
}