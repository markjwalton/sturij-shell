import { MessageSquare, TrendingUp, FileText, Calendar, Brain } from 'lucide-react';
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
}

export function Sidebar({ activeView, onNavigate, isCollapsed = false }: SidebarProps) {
  const navItems: NavItem[] = [
    { icon: MessageSquare, label: 'Canvas', active: activeView === 'Canvas' },
    { icon: TrendingUp, label: 'Pipeline', active: activeView === 'Pipeline' },
    { icon: FileText, label: 'Quotes', active: activeView === 'Quotes' },
    { icon: Calendar, label: 'Calendar', active: activeView === 'Calendar' },
    { icon: Brain, label: 'Knowledge', active: activeView === 'Knowledge' },
  ];

  return (
    <aside
      className="border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 flex-shrink-0 transition-all duration-300"
      style={{ width: isCollapsed ? '64px' : '240px' }}
    >
      {/* Navigation */}
      <nav className="flex-1 p-2 pt-6 w-full overflow-hidden">
        <div className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : 'space-y-1 px-2'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (isCollapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onNavigate?.(item.label)}
                      className={`
                        w-12 h-12 flex items-center justify-center rounded-lg transition-all
                        ${
                          item.active
                            ? 'text-white bg-teal-600 shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
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
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all
                  ${
                    item.active
                      ? 'text-white bg-teal-600 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <motion.span
                  initial={false}
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
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