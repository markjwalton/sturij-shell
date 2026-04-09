import { useState, ReactNode } from 'react';
import { X, MessageCircle, Home, Briefcase, Package, Settings, LogOut, Zap, Grid, Moon, Sun, Edit3, Navigation, Download, Share, RefreshCw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { UserMessage } from './UserMessage';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
const brandLogo = '';
const watermarkLogo = '';
import { cloneElement, isValidElement } from 'react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
}

interface MobileAppShellProps {
  children: ReactNode;
  navigationItems?: Array<{ label: string; icon: ReactNode; onClick: () => void }>;
  actionItems?: Array<{ label: string; icon: ReactNode; onClick: () => void }>;
  title?: string;
  userInitials?: string;
  isLandscape?: boolean;
  onToggleOrientation?: (isLandscape: boolean) => void;
  artifactInfo?: {
    title: string;
    dimensions?: string;
    stats?: Array<{ label: string; value: string }>;
  };
  currentSheetIndex?: number;
  totalSheets?: number;
  currentSheetData?: {
    sheetNumber: number;
    panelsCut: number;
    totalPanels: number;
  };
  onPrevSheet?: () => void;
  onNextSheet?: () => void;
  artifactScale?: number;
  onArtifactScaleChange?: (scale: number) => void;
}

export function MobileAppShell({ 
  children, 
  navigationItems = [],
  actionItems = [],
  title = "Sturij Intelligence",
  userInitials = "MW",
  isLandscape: externalIsLandscape,
  onToggleOrientation,
  artifactInfo,
  currentSheetIndex,
  totalSheets,
  currentSheetData,
  onPrevSheet,
  onNextSheet,
  artifactScale,
  onArtifactScaleChange
}: MobileAppShellProps) {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isTopDrawerOpen, setIsTopDrawerOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScaleControlOpen, setIsScaleControlOpen] = useState(false);
  const [artifactRotation, setArtifactRotation] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome! I can help you optimize your panel layouts and manage your projects.',
      timestamp: '09:15',
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages([...messages, newMessage]);
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you want to know about "${content}". Let me help you with that...`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden font-mono">
      {/* Textured Background Layer */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: isDarkMode ? '#0a1628' : 'rgba(184, 180, 150, 0.5)',
          backgroundImage: isDarkMode ? 'none' : `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Full-Screen Artifact - The Hero */}
      <div 
        className="absolute inset-0 overflow-hidden touch-none transition-transform duration-300 ease-out"
        style={{ 
          transform: `scale(${artifactScale || 0.65}) rotate(${artifactRotation}deg)`,
          transformOrigin: 'center center'
        }}
      >
        {isValidElement(children) ? cloneElement(children, { parentScale: artifactScale || 0.65, parentRotation: artifactRotation } as any) : children}
      </div>

      {/* Centered Watermark - Subtle Branding */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none select-none"
        style={{ width: '300px', height: '300px' }}
      >
        <img 
          src={watermarkLogo} 
          alt="" 
          className="w-full h-full object-contain opacity-[0.03] dark:opacity-[0.05]"
          draggable={false}
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-16 backdrop-blur-xl bg-black/80 dark:bg-black/80 border-b border-gray-700/50 dark:border-gray-600/50 shadow-sm">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Menu + Title */}
          <div className="flex items-center gap-3">
            <img 
              src={brandLogo} 
              alt="Sturij Intelligence" 
              className="h-8 object-contain"
            />
          </div>

          {/* Settings Cog & Avatar */}
          <div className="flex items-center gap-2">
            {/* Settings Cog - Thin Stroke Glow */}
            <button
              onClick={() => setIsScaleControlOpen(!isScaleControlOpen)}
              className="relative w-8 h-8 flex items-center justify-center group"
              aria-label="Scale control"
            >
              <Settings 
                className="w-5 h-5 stroke-[1.5] text-transparent stroke-teal-500 dark:stroke-teal-400 transition-all duration-300"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(20, 184, 166, 0.5)) drop-shadow(0 0 8px rgba(20, 184, 166, 0.3))',
                  fill: 'none'
                }}
              />
            </button>

            {/* Avatar */}
            <button
              onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
              className="relative"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold shadow-md hover:scale-105 transition-transform">
                {userInitials}
              </div>
            </button>
          </div>

          {/* Avatar Dropdown Menu */}
          {isAvatarMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsAvatarMenuOpen(false)}
              />
              <div className="absolute right-4 top-12 w-56 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-[80]">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Mark Wilson</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">mark@example.com</div>
                </div>

                {/* Theme Toggle */}
                <div className="py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                  <button 
                    onClick={() => {
                      toggleDarkMode();
                      setIsAvatarMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors text-left"
                  >
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </button>
                </div>

                {/* User Functions */}
                <div className="py-2">
                  <button 
                    onClick={() => {
                      if (onToggleOrientation) {
                        onToggleOrientation(!externalIsLandscape);
                      }
                      setIsAvatarMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-gray-100">Rotate View</span>
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors text-left">
                    <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-gray-100">Settings</span>
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors text-left">
                    <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-600 dark:text-red-400">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Drawer Toggle - Pull down indicator */}
      <button
        onClick={() => setIsTopDrawerOpen(!isTopDrawerOpen)}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] px-6 py-1.5 rounded-b-xl backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-x border-b border-teal-400/40 dark:border-teal-500/40 shadow-lg hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all"
        style={{
          borderTopWidth: '0',
          borderLeftWidth: '1px',
          borderRightWidth: '1px', 
          borderBottomWidth: '2px'
        }}
        aria-label="Toggle info drawer"
      >
        {isTopDrawerOpen ? (
          <ChevronUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        )}
      </button>

      {/* Scale Control Panel - Slides down when active */}
      <div 
        className={`fixed top-16 left-1/2 -translate-x-1/2 z-[65] transition-all duration-300 ${
          isScaleControlOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        onMouseLeave={() => setIsScaleControlOpen(false)}
        onTouchEnd={() => setTimeout(() => setIsScaleControlOpen(false), 3000)}
      >
        <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 w-72">
          <div className="space-y-4">
            {/* Scale Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Scale</span>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400">{Math.round((artifactScale || 0.65) * 100)}%</span>
              </div>
              
              {/* Scale Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={artifactScale || 0.65}
                  onChange={(e) => {
                    const newScale = parseFloat(e.target.value);
                    onArtifactScaleChange?.(newScale);
                  }}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  style={{
                    background: `linear-gradient(to right, rgb(20 184 166) 0%, rgb(20 184 166) ${((artifactScale || 0.65) - 0.5) * 100}%, rgb(229 231 235) ${((artifactScale || 0.65) - 0.5) * 100}%, rgb(229 231 235) 100%)`
                  }}
                />
              </div>

              {/* Scale Quick Presets */}
              <div className="flex gap-2">
                <button
                  onClick={() => onArtifactScaleChange?.(0.5)}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  50%
                </button>
                <button
                  onClick={() => onArtifactScaleChange?.(1)}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  100%
                </button>
                <button
                  onClick={() => onArtifactScaleChange?.(1.5)}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  150%
                </button>
                <button
                  onClick={() => onArtifactScaleChange?.(2)}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  200%
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50"></div>

            {/* Rotation Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Rotation</span>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400">{artifactRotation}°</span>
              </div>
              
              {/* Rotation Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={artifactRotation}
                  onChange={(e) => setArtifactRotation(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Rotation Quick Presets */}
              <div className="flex gap-2">
                <button
                  onClick={() => setArtifactRotation(-90)}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  -90°
                </button>
                <button
                  onClick={() => setArtifactRotation(0)}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  0°
                </button>
                <button
                  onClick={() => setArtifactRotation(90)}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  90°
                </button>
                <button
                  onClick={() => setArtifactRotation(180)}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  180°
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Drawer - Info & Stats Only */}
      {isTopDrawerOpen && (
        <div className="fixed top-16 left-0 right-0 z-[55] backdrop-blur-2xl bg-white/10 dark:bg-gray-900/10 border-b border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <div className="px-6 py-4 max-w-2xl mx-auto">
            {/* Artifact Info */}
            {artifactInfo && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {artifactInfo.title}
                  </h3>
                  {artifactInfo.dimensions && (
                    <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                      {artifactInfo.dimensions}
                    </span>
                  )}
                </div>
                
                {/* Stats Grid */}
                {artifactInfo.stats && artifactInfo.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {artifactInfo.stats.map((stat, index) => (
                      <div key={index} className="p-3 rounded-lg backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Side Drawer Tab - Left: Navigation (Blue) - Vertical */}
      <button
        onClick={() => setIsNavOpen(!isNavOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 py-6 px-1.5 rounded-r-xl backdrop-blur-lg bg-blue-500/20 dark:bg-blue-600/20 border-y border-r border-blue-300/30 dark:border-blue-400/30 shadow-lg hover:bg-blue-500/30 dark:hover:bg-blue-600/30 transition-all"
        aria-label="Toggle navigation"
      >
        {isNavOpen ? (
          <ChevronLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        )}
      </button>

      {/* Side Drawer Tab - Right: Actions (Purple) - Vertical */}
      <button
        onClick={() => setIsActionsOpen(!isActionsOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 py-6 px-1.5 rounded-l-xl backdrop-blur-lg bg-purple-500/20 dark:bg-purple-600/20 border-y border-l border-purple-300/30 dark:border-purple-400/30 shadow-lg hover:bg-purple-500/30 dark:hover:bg-purple-600/30 transition-all"
        aria-label="Toggle actions"
      >
        {isActionsOpen ? (
          <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        )}
      </button>

      {/* Bottom Drawer Tab - Center: Chat (Teal) */}
      <button
        onClick={() => setIsChatExpanded(!isChatExpanded)}
        className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-t-xl backdrop-blur-lg bg-teal-500/20 dark:bg-teal-600/20 border-x border-t border-teal-300/30 dark:border-teal-400/30 shadow-lg hover:bg-teal-500/30 dark:hover:bg-teal-600/30 transition-all flex items-center gap-2"
        aria-label="Toggle chat"
      >
        {isChatExpanded ? (
          <ChevronDown className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        )}
        {messages.length > 0 && (
          <span className="min-w-[18px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
            {messages.length}
          </span>
        )}
      </button>

      {/* Navigation Drawer - Left Side */}
      <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
        <SheetContent 
          side="left" 
          className="w-[80px] backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-r border-gray-200/20 dark:border-gray-700/20 top-16 bottom-14"
          style={{ height: 'calc(100vh - 120px)' }}
          overlayClassName="bg-transparent"
          showClose={false}
        >
          <div className="mt-6 space-y-3 flex flex-col items-center">
            {navigationItems.length > 0 ? (
              navigationItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        item.onClick();
                        setIsNavOpen(false);
                      }}
                      className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-teal-50/70 dark:hover:bg-teal-900/30 transition-colors text-teal-600 dark:text-teal-400"
                    >
                      {item.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ))
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-teal-50/70 dark:hover:bg-teal-900/30 transition-colors text-teal-600 dark:text-teal-400">
                      <Home className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Home</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-teal-50/70 dark:hover:bg-teal-900/30 transition-colors text-teal-600 dark:text-teal-400">
                      <Briefcase className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Jobs</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-teal-50/70 dark:hover:bg-teal-900/30 transition-colors text-teal-600 dark:text-teal-400">
                      <Package className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Materials</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-teal-50/70 dark:hover:bg-teal-900/30 transition-colors text-teal-600 dark:text-teal-400">
                      <Grid className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Artifacts</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Actions Drawer - Right Side */}
      <Sheet open={isActionsOpen} onOpenChange={setIsActionsOpen}>
        <SheetContent 
          side="right" 
          className="w-[80px] backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-l border-gray-200/20 dark:border-gray-700/20 top-16 bottom-14"
          style={{ height: 'calc(100vh - 120px)' }}
          overlayClassName="bg-transparent"
          showClose={false}
        >
          <div className="mt-6 space-y-3 flex flex-col items-center">
            {actionItems.length > 0 ? (
              actionItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        item.onClick();
                        setIsActionsOpen(false);
                      }}
                      className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-purple-50/70 dark:hover:bg-purple-900/30 transition-colors text-purple-600 dark:text-purple-400"
                    >
                      {item.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">{item.label}</TooltipContent>
                </Tooltip>
              ))
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-purple-50/70 dark:hover:bg-purple-900/30 transition-colors text-purple-600 dark:text-purple-400">
                      <Download className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Export Sheet Data</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-purple-50/70 dark:hover:bg-purple-900/30 transition-colors text-purple-600 dark:text-purple-400">
                      <RefreshCw className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Optimize Layout</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-purple-50/70 dark:hover:bg-purple-900/30 transition-colors text-purple-600 dark:text-purple-400">
                      <Share className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Share Job</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Expanded Chat Panel - Slides up from bottom */}
      {isChatExpanded && (
        <div
          className="fixed left-0 right-0 z-50 backdrop-blur-2xl bg-white/10 dark:bg-gray-900/10 border-t border-gray-200/50 dark:border-gray-800/50 shadow-2xl"
          style={{ bottom: '56px', height: '45vh', maxHeight: '50vh' }}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">AI Assistant</div>
                <div className="text-[9px] text-teal-600 dark:text-teal-400">Online</div>
              </div>
            </div>
            <button 
              onClick={() => setIsChatExpanded(false)}
              className="p-1.5 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex flex-col" style={{ height: 'calc(100% - 46px)' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {messages.map((message) =>
                message.type === 'user' ? (
                  <UserMessage
                    key={message.id}
                    message={message.content}
                    timestamp={message.timestamp}
                    userInitials={userInitials}
                  />
                ) : (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    timestamp={message.timestamp}
                  />
                )
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200/50 dark:border-gray-800/50 p-2">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      )}

      {/* Carousel Bar - Fixed at top below header and drawer toggle */}
      {currentSheetData && (
        <div 
          className="fixed top-[108px] left-1/2 z-50"
          style={{
            transform: 'translateX(-50%)',
          }}
        >
          <div className="backdrop-blur-xl bg-black/80 dark:bg-black/80 rounded-xl border border-gray-700/30 dark:border-gray-600/30 shadow-lg px-6 py-2">
            <div className="flex items-center gap-6">
              {/* Job Number - Stylish Badge */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-lg bg-teal-500/20 dark:bg-teal-400/20 border border-teal-500/30 dark:border-teal-400/30">
                  <span className="text-sm font-bold text-teal-400 dark:text-teal-300 tracking-wide">R001</span>
                </div>
                <div className="text-xs text-gray-300 dark:text-gray-400">
                  <span className="text-teal-400 dark:text-teal-400 font-semibold">{currentSheetData.panelsCut}/{currentSheetData.totalPanels}</span> cut
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-px h-6 bg-gray-600/50 dark:bg-gray-600/50"></div>
              
              {/* Sheet Navigation - Compact */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onPrevSheet}
                  disabled={currentSheetIndex === 0}
                  className="p-1.5 rounded-lg backdrop-blur-sm bg-gray-800/60 dark:bg-gray-800/60 border border-gray-700/40 dark:border-gray-600/40 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700/60 dark:hover:bg-gray-700/60 transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                
                {/* Current Sheet Number Badge */}
                <div className="px-2.5 py-0.5 rounded-lg bg-gray-100/90 dark:bg-gray-100/90">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-900">{(currentSheetIndex ?? 0) + 1}/{totalSheets}</span>
                </div>
                
                <button
                  onClick={onNextSheet}
                  disabled={currentSheetIndex === totalSheets! - 1}
                  className="p-1.5 rounded-lg backdrop-blur-sm bg-gray-800/60 dark:bg-gray-800/60 border border-gray-700/40 dark:border-gray-600/40 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700/60 dark:hover:bg-gray-700/60 transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-600/50 dark:bg-gray-600/50"></div>

              {/* Scale Badge */}
              <div className="px-2.5 py-0.5 rounded-lg bg-gray-800/60 border border-gray-700/40">
                <span className="text-xs font-mono text-gray-300">{artifactScale ?? 100}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-14 backdrop-blur-xl bg-black/80 dark:bg-black/80 border-t border-gray-700/50 dark:border-gray-600/50 shadow-sm">
      </div>
    </div>
  );
}