import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables on the container so both glow divs can use them
      container.style.setProperty('--x', `${x}px`);
      container.style.setProperty('--y', `${y}px`);
      container.style.setProperty('--glow-opacity', '1');
    };

    const handleMouseLeave = () => {
      container.style.setProperty('--glow-opacity', '0');
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{
        '--x': '50%',
        '--y': '50%',
        '--glow-opacity': '0',
      } as React.CSSProperties}
    >
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Mouse-following glow — single layer, works for both themes */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: 'var(--glow-opacity)',
          background: `radial-gradient(600px circle at var(--x) var(--y), 
            rgba(74, 222, 128, 0.06), 
            rgba(59, 130, 246, 0.04) 30%, 
            rgba(147, 51, 234, 0.025) 55%, 
            transparent 70%)`,
          willChange: 'opacity',
        }}
      />
    </div>
  );
}