// Custom collapse/expand icons — thin stroke, rounded caps
// Matches the panel control aesthetic from the design references

interface IconProps {
  className?: string;
  size?: number;
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
