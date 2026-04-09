import { Search, Sun, Moon, User, CreditCard, FileText, LogOut, Shield, Palette, Zap, Database, Key, Mail, Users, BarChart3, Code, Plug, Webhook, X, AlertCircle, Clock, CheckCircle, Settings } from 'lucide-react';
import logoWhite from '../../assets/logo-full-white.png';
import logoIcon from '../../assets/logo-white.png';
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
  const [showSearch, setShowSearch] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
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
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.length;

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
    <><header className="h-16 flex items-center justify-between px-6 relative z-[110] w-full shell-surface">
      {/* Sidebar Toggle + Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center h-full">
          {isSidebarCollapsed ? (
            <img src={logoIcon} alt="Sturij" className="h-12 w-12" />
          ) : (
            <img src={logoWhite} alt="Sturij" className="h-12 w-auto" />
          )}
        </div>
      </div>
      
      {/* Navigation - Aligned with content below */}
      <div className="absolute left-[280px] flex items-center gap-4">
        <button className="px-4 py-2 shell-text font-medium transition-colors">
          Canvas
        </button>
        <button className="px-4 py-2 shell-icon transition-colors shell-icon-btn">
          Hub
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Search - Collapsible */}
        {showSearch ? (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 shell-icon" />
            <Input
              ref={searchRef}
              placeholder="Search anything..."
              className="pl-9 shell-search-input focus-visible:ring-[var(--shell-accent-faint)] focus-visible:border-[var(--shell-text-muted)]"
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
                className="h-10 w-10 shell-icon-btn"
              >
                <Search className="w-7 h-7" strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>
        )}
        
        {/* Settings Mega Dropdown */}
        <div ref={settingsMenuRef} className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="h-10 w-10 shell-icon-btn"
              >
                <Settings className="w-7 h-7" strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
          
          {showSettingsMenu && (
            <div className="fixed right-4 top-16 w-[680px] rounded-xl shadow-2xl z-[200] overflow-hidden shell-surface shell-border">
              <div className="p-6 shell-border-b">
                <h3 className="font-semibold text-lg shell-text">System Settings</h3>
                <p className="text-sm shell-text-muted mt-1">Configure your workspace and tools</p>
              </div>
              
              <div className="grid grid-cols-2 gap-px shell-bg">
                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <User className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Profile Settings</h4>
                      <p className="text-xs shell-text-muted">Manage your account details and preferences</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Shield className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Security & Privacy</h4>
                      <p className="text-xs shell-text-muted">2FA, passwords, and access control</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Users className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Team Management</h4>
                      <p className="text-xs shell-text-muted">Invite members, roles, and permissions</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Palette className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Appearance</h4>
                      <p className="text-xs shell-text-muted">Themes, colors, and display options</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Database className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Data Management</h4>
                      <p className="text-xs shell-text-muted">Import, export, and backup your data</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Zap className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">AI Skills & Training</h4>
                      <p className="text-xs shell-text-muted">Configure AI behavior and custom skills</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Plug className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Integrations</h4>
                      <p className="text-xs shell-text-muted">Connect third-party apps and services</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Key className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">API Keys</h4>
                      <p className="text-xs shell-text-muted">Manage developer access tokens</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Webhook className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Webhooks</h4>
                      <p className="text-xs shell-text-muted">Set up real-time event notifications</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Mail className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Notifications</h4>
                      <p className="text-xs shell-text-muted">Email, SMS, and in-app alerts</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <BarChart3 className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Analytics & Reports</h4>
                      <p className="text-xs shell-text-muted">Track usage, insights, and metrics</p>
                    </div>
                  </div>
                </button>

                <button className="p-4 shell-bg hover:bg-[var(--shell-border)] transition-colors text-left group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shell-surface shell-border group-hover:shell-accent-text transition-all">
                      <Code className="w-5 h-5 shell-icon" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium shell-text mb-1">Developer Tools</h4>
                      <p className="text-xs shell-text-muted">API docs, sandbox, and debugging</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Dropdown — far right */}
        <div ref={userMenuRef} className="relative ml-auto">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="relative flex items-center hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-10 h-10 shell-avatar font-medium text-sm tracking-wide flex items-center justify-center cursor-pointer">
              {userInitials}
            </Avatar>
            {/* Unread notification dot */}
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full shell-notification-pulse"></span>
            )}
          </button>

          {showUserMenu && (
            <div className="fixed right-4 top-16 w-72 rounded-xl shadow-xl z-[200] overflow-hidden shell-surface shell-border">
              <div className="p-3 shell-border-b">
                <p className="font-medium shell-text">{userName}</p>
                <p className="text-xs shell-text-muted mt-0.5">user@sturij.ai</p>
              </div>

              {/* Notifications section */}
              {notifications.length > 0 && (
                <div className="shell-border-b">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold shell-text-muted uppercase tracking-wider">Notifications</span>
                    <span className="text-xs shell-accent-text font-medium">{unreadCount} new</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {notifications.slice(0, 3).map((n) => {
                      const IconComponent = n.type === 'critical' ? AlertCircle : n.type === 'action' ? Clock : CheckCircle;
                      const iconColor = n.type === 'critical' ? 'text-red-500' : n.type === 'action' ? 'text-amber-500' : 'text-green-500';
                      return (
                        <div key={n.id} className="px-4 py-2 flex items-start gap-2 shell-menu-item transition-colors">
                          <IconComponent className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium shell-text truncate">{n.title}</p>
                            <p className="text-xs shell-text-muted">{n.time}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }} className="p-1 rounded hover:bg-[var(--shell-border)]">
                            <X className="w-3 h-3 shell-icon" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {notifications.length > 3 && (
                    <button className="w-full px-4 py-2 text-xs text-center shell-accent-text shell-menu-item transition-colors">
                      View all {notifications.length} notifications
                    </button>
                  )}
                </div>
              )}

              {/* Theme toggle */}
              <div className="shell-border-b py-1">
                <button 
                  onClick={toggleDarkMode}
                  className="w-full px-4 py-2 text-left text-sm shell-text shell-menu-item flex items-center gap-3 transition-colors"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDarkMode ? 'Switch to Green' : 'Switch to Navy'}
                </button>
              </div>
              
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm shell-text shell-menu-item flex items-center gap-3 transition-colors">
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm shell-text shell-menu-item flex items-center gap-3 transition-colors">
                  <Settings className="w-4 h-4" />
                  Preferences
                </button>
                <button className="w-full px-4 py-2 text-left text-sm shell-text shell-menu-item flex items-center gap-3 transition-colors">
                  <FileText className="w-4 h-4" />
                  Documents
                </button>
                <button className="w-full px-4 py-2 text-left text-sm shell-text shell-menu-item flex items-center gap-3 transition-colors">
                  <CreditCard className="w-4 h-4" />
                  Billing
                </button>
              </div>

              <div className="shell-border-t py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-red-500 shell-menu-item flex items-center gap-3 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
    <div className="shell-accent-rule" />
    </>
  );
}
