import { MessageSquare, TrendingUp, FileText, Calendar, Brain } from 'lucide-react';
import { AnimatedToggle } from './icons/CollapseIcons';
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
      style={{
        width: isCollapsed ? '64px' : '240px',
        background: 'var(--shell-surface)',
        borderRight: '1px solid var(--shell-border)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-center py-3">
        <button
          onClick={onToggle}
          className="w-full flex justify-center shell-icon shell-icon-btn py-3 border-none cursor-pointer bg-transparent"
        >
          <AnimatedToggle isOpen={!isCollapsed} direction="horizontal" size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 8px 8px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: isCollapsed ? 'center' : 'stretch' }}>
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
                    ? 'shell-nav-active shell-nav-active-text font-semibold'
                    : 'shell-icon font-normal hover:bg-[var(--shell-border)]'
                }`}
              >
                <Icon className="w-7 h-7 flex-shrink-0" strokeWidth={1.5} />
                <motion.span
                  initial={false}
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
