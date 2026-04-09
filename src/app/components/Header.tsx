import { Bell, Search, Moon, Sun, User, CreditCard, FileText, LogOut, Shield, Palette, Zap, Database, Key, Mail, Users, BarChart3, Code, Plug, Webhook, LayoutGrid, Layers, ChevronUp, ChevronDown, Minimize2, Maximize2, PanelLeftClose, PanelLeft, X, AlertCircle, Clock, CheckCircle, ArrowRight, Settings, ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { AnimatedToggle } from './icons/CollapseIcons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { useEffect, useState, useRef } from 'react';

interface HeaderProps {
  userName: string;
  userInitials: string;
  artifactViewMode: 'carousel' | 'stack';
  onToggleArtifactView: () => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  isPanelCollapsed?: boolean;
  onTogglePanelCollapse?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export function Header({ userName, userInitials, artifactViewMode, onToggleArtifactView, onExpandAll, onCollapseAll, isPanelCollapsed, onTogglePanelCollapse, isSidebarCollapsed, onToggleSidebarCollapse }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'critical' as const,
      title: 'Payment Failed',
      message: 'Monthly subscription payment could not be processed',
      time: '2 min ago',
      link: '/billing',
      linkText: 'Update Payment'
    },
    {
      id: 2,
      type: 'action' as const,
      title: 'Pending Approval',
      message: 'New team member request from Sarah Mitchell',
      time: '15 min ago',
      link: '/team',
      linkText: 'Review Request'
    },
    {
      id: 3,
      type: 'critical' as const,
      title: 'Server Alert',
      message: 'API response time exceeded threshold',
      time: '1 hour ago',
      link: '/settings/developer',
      linkText: 'View Logs'
    },
    {
      id: 4,
      type: 'action' as const,
      title: 'Quote Expiring Soon',
      message: 'Corrigan Construction quote expires in 2 days',
      time: '3 hours ago',
      link: '/quotes',
      linkText: 'View Quote'
    },
    {
      id: 5,
      type: 'info' as const,
      title: 'Backup Complete',
      message: 'Automated database backup finished successfully',
      time: '5 hours ago',
      link: '/settings/data',
      linkText: 'View Details'
    },
    {
      id: 6,
      type: 'info' as const,
      title: 'New Feature Available',
      message: 'AI Skills now supports custom training models',
      time: '1 day ago',
      link: '/settings/ai',
      linkText: 'Learn More'
    }
  ]);

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (currentNotificationIndex >= notifications.length - 1) {
      setCurrentNotificationIndex(Math.max(0, notifications.length - 2));
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStart);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (dragOffset > threshold && currentNotificationIndex > 0) {
      setCurrentNotificationIndex(currentNotificationIndex - 1);
    } else if (dragOffset < -threshold && currentNotificationIndex < notifications.length - 1) {
      setCurrentNotificationIndex(currentNotificationIndex + 1);
    }
    
    setDragOffset(0);
  };

  const goToNotification = (index: number) => {
    setCurrentNotificationIndex(index);
  };

  // Reset notification index when opening dropdown
  useEffect(() => {
    if (showNotifications) {
      setCurrentNotificationIndex(0);
      setDragOffset(0);
    }
  }, [showNotifications]);

  useEffect(() => {
    // Always start in dark (navy) mode
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('theme-green');
    setIsDarkMode(true);
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches || document.documentElement.classList.contains('dark'));

    const handleChange = (e: MediaQueryListEvent) => {
      if (!document.documentElement.classList.contains('dark')) {
        setIsDarkMode(e.matches);
      }
    };

    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isGreen = html.classList.contains('theme-green');
    if (isGreen) {
      html.classList.remove('theme-green');
      html.classList.add('dark');
      setIsDarkMode(true);
    } else {
      html.classList.remove('dark');
      html.classList.add('theme-green');
      setIsDarkMode(false);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 relative z-[110] w-full shell-surface shell-border-b">
      {/* Sidebar Toggle + Logo */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebarCollapse}
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
            >
              <AnimatedToggle isOpen={!isSidebarCollapsed} direction="horizontal" size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</TooltipContent>
        </Tooltip>
        
        <div className="text-3xl font-bold shell-text">
          sturij
        </div>
      </div>
      
      {/* Navigation - Aligned with content below */}
      <div className="absolute left-[280px] flex items-center gap-4">
        <button className="px-4 py-2 text-gray-900 dark:text-white/90 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
          Canvas
        </button>
        <button className="px-4 py-2 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors">
          Hub
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Search - Collapsible */}
        {showSearch ? (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              ref={searchRef}
              placeholder="Search anything..."
              className="pl-9 bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500 focus-visible:ring-gray-300 focus-visible:border-gray-400"
              onBlur={() => setShowSearch(false)}
            />
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearch(true)}
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-white/80" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-white/10">
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-white/80" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-white/80" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</TooltipContent>
        </Tooltip>

        <div ref={notificationsMenuRef} className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-white/80" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          
          {showNotifications && (
            <div className="fixed right-4 top-16 w-[420px] rounded-xl shadow-2xl z-[200] overflow-hidden shell-surface shell-border">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Notifications</h3>
                  {notifications.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{notifications.length} new</span>
                  )}
                </div>
              </div>
              
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <>
                  {/* Carousel Container */}
                  <div 
                    className="relative h-[400px] overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                  >
                    <div 
                      className="flex transition-transform duration-300 ease-out h-full"
                      style={{
                        transform: `translateX(calc(-${currentNotificationIndex * 100}% + ${dragOffset}px))`,
                        transition: isDragging ? 'none' : 'transform 300ms ease-out'
                      }}
                    >
                      {notifications.map((notification) => {
                        const IconComponent = notification.type === 'critical' ? AlertCircle : notification.type === 'action' ? Clock : CheckCircle;
                        const glowColor = notification.type === 'critical' 
                          ? 'shadow-red-500/50 dark:shadow-red-500/30' 
                          : notification.type === 'action' 
                          ? 'shadow-amber-500/50 dark:shadow-amber-500/30' 
                          : 'shadow-green-500/50 dark:shadow-green-500/30';
                        const bgColor = notification.type === 'critical'
                          ? 'bg-red-500 dark:bg-red-600'
                          : notification.type === 'action'
                          ? 'bg-amber-500 dark:bg-amber-600'
                          : 'bg-green-500 dark:bg-green-600';
                        const borderColor = notification.type === 'critical'
                          ? 'border-red-200 dark:border-red-800/50'
                          : notification.type === 'action'
                          ? 'border-amber-200 dark:border-amber-800/50'
                          : 'border-green-200 dark:border-green-800/50';
                        
                        return (
                          <div 
                            key={notification.id} 
                            className="min-w-full h-full p-6 flex items-center justify-center"
                          >
                            <div className={`w-full max-w-sm p-6 rounded-2xl border-2 ${borderColor} bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all group relative shadow-xl`}>
                              {/* Glow effect */}
                              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${glowColor} shadow-2xl`}></div>
                              
                              <div className="relative flex flex-col items-center text-center gap-4">
                                {/* Icon with glow */}
                                <div className={`relative p-4 rounded-2xl ${bgColor} text-white shadow-2xl ${glowColor}`}>
                                  <IconComponent className="w-8 h-8" />
                                </div>
                                
                                {/* Content */}
                                <div className="w-full">
                                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {notification.message}
                                  </p>
                                  <div className="flex flex-col gap-3">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); window.location.href = notification.link; }}
                                      className="w-full px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-medium transition-colors shadow-lg"
                                    >
                                      {notification.linkText}
                                    </button>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                      {notification.time}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Dismiss button */}
                                <button
                                  onClick={() => dismissNotification(notification.id)}
                                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-50 hover:opacity-100"
                                >
                                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200 dark:border-gray-800">
                    {notifications.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToNotification(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentNotificationIndex 
                            ? 'w-8 bg-teal-600 dark:bg-teal-500' 
                            : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Settings Mega Dropdown */}
        <div ref={settingsMenuRef} className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-white/80" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
          
          {showSettingsMenu && (
            <div className="fixed right-4 top-16 w-[680px] rounded-xl shadow-2xl z-[200] overflow-hidden shell-surface shell-border">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">System Settings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your workspace and tools</p>
              </div>
              
              <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800">
                {/* Core Settings */}
                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Profile Settings</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your account details and preferences</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Security & Privacy</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2FA, passwords, and access control</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Team Management</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Invite members, roles, and permissions</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Appearance</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Themes, colors, and display options</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                      <Database className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Data Management</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Import, export, and backup your data</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">AI Skills & Training</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Configure AI behavior and custom skills</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Plug className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Integrations</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Connect third-party apps and services</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                      <Key className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">API Keys</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage developer access tokens</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                      <Webhook className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Webhooks</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Set up real-time event notifications</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Notifications</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email, SMS, and in-app alerts</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Analytics & Reports</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Track usage, insights, and metrics</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                      <Code className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Developer Tools</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">API docs, sandbox, and debugging</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div ref={userMenuRef} className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-8 h-8 bg-teal-600 text-white font-medium flex items-center justify-center cursor-pointer">
              {userInitials}
            </Avatar>
          </button>

          {showUserMenu && (
            <div className="fixed right-4 top-16 w-56 rounded-xl shadow-xl z-[200] overflow-hidden shell-surface shell-border">
              <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                <p className="font-medium text-gray-900 dark:text-white">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">user@sturij.ai</p>
              </div>
              
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                  <Settings className="w-4 h-4" />
                  Preferences
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                  <FileText className="w-4 h-4" />
                  Documents
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                  <CreditCard className="w-4 h-4" />
                  Billing
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Artifact Controls - Icon Only with Tooltips */}
        <div className="flex items-center gap-1 ml-2">
          {artifactViewMode === 'stack' && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onExpandAll}
                    className="h-8 w-8 text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Expand All</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onCollapseAll}
                    className="h-8 w-8 text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Collapse All</TooltipContent>
              </Tooltip>
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onToggleArtifactView}
                className="h-8 w-8 text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              >
                {artifactViewMode === 'carousel' ? (
                  <Layers className="w-4 h-4" />
                ) : (
                  <LayoutGrid className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{artifactViewMode === 'carousel' ? 'Stack View' : 'Carousel View'}</TooltipContent>
          </Tooltip>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={onTogglePanelCollapse}
            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-white/15"
            title={isPanelCollapsed ? 'Expand Panel' : 'Collapse Panel'}
          >
            <AnimatedToggle isOpen={!isPanelCollapsed} direction="vertical" size={18} className="shell-text-muted" />
          </Button>
        </div>
      </div>
    </header>
  );
}