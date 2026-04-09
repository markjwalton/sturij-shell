// Custom collapse/expand icons — thin stroke, rounded caps
// Matches the panel control aesthetic from the design references
// AnimatedChevron handles directional rotation via Framer Motion

import { motion } from 'motion/react';

interface IconProps {
  className?: string;
  size?: number;
}

interface AnimatedToggleProps {
  isOpen: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  size?: number;
}

// Single animated chevron that rotates based on open/closed state
// direction='horizontal' → left (closed) / right (open) — for sidebar
// direction='vertical'   → down (closed) / up (open)    — for drawers/panels
export function AnimatedToggle({ isOpen, direction = 'vertical', className, size = 16 }: AnimatedToggleProps) {
  const rotation = direction === 'horizontal'
    ? isOpen ? 0 : 180     // right=0, left=180
    : isOpen ? 180 : 0;    // down=0, up=180

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      animate={{ rotate: rotation }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {direction === 'horizontal' ? (
        <>
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="13" y1="4" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="4" y1="3" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}
    </motion.svg>
  );
}

// Sidebar collapse left (chevron left + lines)
export function SidebarCollapseLeft({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="4" x2="3" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Sidebar expand right (chevron right + lines)
export function SidebarExpandRight({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="13" y1="4" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Panel collapse (chevron down + horizontal bars)
export function PanelCollapseDown({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="3" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Panel expand (chevron up + horizontal bars)
export function PanelExpandUp({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Drawer open from top (chevron down, opens downward)
export function DrawerOpenDown({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="3" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Drawer close to top (chevron up, closes upward)
export function DrawerCloseUp({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="3" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Drawer open from bottom (chevron up, opens upward)
export function DrawerOpenUp({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Drawer close to bottom (chevron down, closes downward)
export function DrawerCloseDown({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
