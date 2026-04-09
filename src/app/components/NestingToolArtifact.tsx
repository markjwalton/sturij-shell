import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
const woodTexture = '';

interface Panel {
  id: string;
  type: string;
  dimensions: string;
  status: 'pending' | 'cut' | 'problem' | 'offcut';
  position: { row: number; col: number; rowSpan: number; colSpan: number };
}

interface NestingToolArtifactProps {
  isLandscape?: boolean;
  parentScale?: number;
  parentRotation?: number;
  onSheetChange?: (currentIndex: number, totalSheets: number) => void;
  currentSheetIndex?: number;
  onPrevSheet?: () => void;
  onNextSheet?: () => void;
  onScaleChange?: (scale: number) => void;
}

const mockSheets = [
  {
    sheetNumber: 1,
    totalSheets: 5,
    panelsCut: 2,
    totalPanels: 8,
    yield: 59.4,
    offcuts: 1,
    panels: [
      { id: '1', type: 'Carcass Top', dimensions: '580×742', status: 'pending' as const, position: { row: 0, col: 0, rowSpan: 1, colSpan: 1 } },
      { id: '2', type: 'Carcass Top', dimensions: '580×742', status: 'cut' as const, position: { row: 0, col: 1, rowSpan: 1, colSpan: 1 } },
      { id: '3', type: 'Carcass Top', dimensions: '580×742', status: 'cut' as const, position: { row: 0, col: 2, rowSpan: 1, colSpan: 1 } },
      { id: '4', type: 'Carcass Top', dimensions: '580×742', status: 'pending' as const, position: { row: 0, col: 3, rowSpan: 1, colSpan: 1 } },
      { id: '5', type: 'Carcass Top', dimensions: '580×742', status: 'pending' as const, position: { row: 1, col: 0, rowSpan: 1, colSpan: 1 } },
      { id: '6', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 1, col: 1, rowSpan: 1, colSpan: 1 } },
      { id: '7', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 1, col: 2, rowSpan: 1, colSpan: 1 } },
      { id: '8', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 1, col: 3, rowSpan: 1, colSpan: 1 } },
    ],
  },
  {
    sheetNumber: 2,
    totalSheets: 5,
    panelsCut: 0,
    totalPanels: 8,
    yield: 62.1,
    offcuts: 2,
    panels: [
      { id: '9', type: 'Carcass Top', dimensions: '580×742', status: 'pending' as const, position: { row: 0, col: 0, rowSpan: 1, colSpan: 1 } },
      { id: '10', type: 'Carcass Top', dimensions: '580×742', status: 'pending' as const, position: { row: 0, col: 1, rowSpan: 1, colSpan: 1 } },
      { id: '11', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 0, col: 2, rowSpan: 1, colSpan: 1 } },
      { id: '12', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 0, col: 3, rowSpan: 1, colSpan: 1 } },
      { id: '13', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 1, col: 0, rowSpan: 1, colSpan: 1 } },
      { id: '14', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 1, col: 1, rowSpan: 1, colSpan: 1 } },
      { id: '15', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 1, col: 2, rowSpan: 1, colSpan: 1 } },
      { id: '16', type: 'Carcass Base', dimensions: '580×742', status: 'pending' as const, position: { row: 1, col: 3, rowSpan: 1, colSpan: 1 } },
    ],
  },
];

export { mockSheets };

export function NestingToolArtifact({ isLandscape, parentScale = 1, parentRotation = 0, onSheetChange, currentSheetIndex = 0, onPrevSheet, onNextSheet, onScaleChange }: NestingToolArtifactProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSheet = mockSheets[currentSheetIndex];

  const handlePrevSheet = () => {
    onPrevSheet?.();
  };

  const handleNextSheet = () => {
    onNextSheet?.();
  };

  const handleTogglePanelStatus = (panelId: string) => {
    console.log('Toggle panel:', panelId);
  };

  // Handle touch events for pinch-to-zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialDistance = 0;
    let initialScale = 1;

    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = getDistance(e.touches);
        initialScale = scale;
      } else if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const newScale = Math.max(0.5, Math.min(3, initialScale * (currentDistance / initialDistance)));
        setScale(newScale);
      } else if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    // Mouse wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prev => {
        const next = Math.max(0.5, Math.min(3, prev * delta));
        onScaleChange?.(next);
        return next;
      });
    };

    // Mouse drag
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [scale, position, isDragging, dragStart]);

  const getStatusColor = (status: Panel['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-teal-500 dark:bg-teal-600';
      case 'cut':
        return 'bg-gray-400 dark:bg-gray-600';
      case 'problem':
        return 'bg-amber-500 dark:bg-amber-600';
      case 'offcut':
        return 'bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden font-mono relative">

      {/* Zoomable/Pannable Canvas - Full Screen */}
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden z-10"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          {/* Board Container - Proportionate to actual size */}
          <div 
            className="relative shadow-2xl z-20"
            style={{
              width: isLandscape !== false ? '900px' : '820px',
              height: isLandscape !== false ? '820px' : '900px',
              backgroundImage: `url(${woodTexture})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Grid overlay for panels - positioned absolutely */}
            <div className="absolute inset-0 grid grid-cols-4 gap-1 p-1 z-30">
              {currentSheet.panels.map((panel) => {
                const isHovered = false;
                return (
                  <button
                    key={panel.id}
                    onClick={() => handleTogglePanelStatus(panel.id)}
                    className="relative overflow-hidden group z-40"
                    style={{
                      gridRow: `${panel.position.row + 1} / span ${panel.position.rowSpan}`,
                      gridColumn: `${panel.position.col + 1} / span ${panel.position.colSpan}`,
                      backgroundImage: `url(${woodTexture})`,
                      backgroundSize: isLandscape !== false ? '900px 820px' : '820px 900px',
                      backgroundPosition: `calc(-${panel.position.col * 25}% - ${panel.position.col * 0.25}px) calc(-${panel.position.row * 50}% - ${panel.position.row * 0.5}px)`,
                    }}
                  >
                    {/* Status overlay */}
                    <div 
                      className={`absolute inset-0 transition-all duration-200 group-hover:opacity-60 ${ 
                        panel.status === 'cut' 
                          ? 'bg-gray-900/40' 
                          : panel.status === 'problem' 
                          ? 'bg-amber-500/50' 
                          : 'bg-teal-500/30'
                      }`}
                    />
                    
                    {/* Hover effect - brighter border */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/60 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-200" />
                    
                    {/* Cut checkmark */}
                    {panel.status === 'cut' && (
                      <svg
                        className="absolute top-3 right-3 w-8 h-8 text-white drop-shadow-lg z-10"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    
                    {/* Panel info */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pointer-events-none">
                      <div className="text-center px-3">
                        <div className="text-base font-bold">{panel.type}</div>
                        <div className="text-sm mt-1 font-medium">{panel.dimensions}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom indicator - removed, now shown in job bar */}
    </div>
  );
}