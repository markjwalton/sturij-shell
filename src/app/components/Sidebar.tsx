import { MessageSquare, TrendingUp, FileText, Calendar, Brain } from 'lucide-react';
import { SidebarToggle } from './icons/CollapseIcons';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { motion } from 'motion/react';

interface NavItem {
  icon: typeof MessageSquare;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  activeView: string;
  onNavigate?: (view: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ activeView, onNavigate, isCollapsed = false, onToggle }: SidebarProps) {
  const navItems: NavItem[] = [
    { icon: MessageSquare, label: 'Canvas', active: activeView === 'Canvas' },
    { icon: TrendingUp, label: 'Pipeline', active: activeView === 'Pipeline' },
    { icon: FileText, label: 'Quotes', active: activeView === 'Quotes' },
    { icon: Calendar, label: 'Calendar', active: activeView === 'Calendar' },
    { icon: Brain, label: 'Knowledge', active: activeView === 'Knowledge' },
  ];

  return (
    <aside
      className="shell-panel-depth flex shrink-0 transition-[width] duration-300 ease-in-out"
      style={{ width: isCollapsed ? '64px' : '240px' }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* Collapse Toggle */}
      <nav className="flex-1 p-2 overflow-hidden">
        <div className={`flex flex-col mb-1 ${isCollapsed ? 'items-center' : 'items-stretch'}`}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggle}
                  className="w-12 h-12 flex items-center justify-center rounded-lg border-none cursor-pointer transition-all shell-accent-text"
                >
                  <SidebarToggle isOpen={false} size={28} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onToggle}
              className="w-12 h-12 flex items-center justify-center rounded-lg border-none cursor-pointer transition-all shell-accent-text"
            >
              <SidebarToggle isOpen={true} size={28} />
            </button>
          )}
        </div>

      {/* Navigation */}
        <div className={`flex flex-col gap-1 ${isCollapsed ? 'items-center' : 'items-stretch'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;

            if (isCollapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onNavigate?.(item.label)}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg border-none cursor-pointer transition-all ${
                        item.active
                          ? 'shell-nav-active shell-nav-active-text'
                          : 'shell-icon hover:bg-[var(--shell-border)]'
                      }`}
                    >
                      <Icon className="w-7 h-7" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <button
                key={item.label}
                onClick={() => onNavigate?.(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border-none cursor-pointer text-left text-sm transition-all ${
                  item.active
                    ? 'shell-nav-active shell-nav-active-text font-medium'
                    : 'shell-icon font-normal hover:bg-[var(--shell-border)]'
                }`}
              >
                <Icon className="w-7 h-7 flex-shrink-0" strokeWidth={1.5} />
                <motion.span
                  initial={false}
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap text-base"
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </nav>
      </div>
      <div className="shell-accent-rule-v" />
    </aside>
  );
}
