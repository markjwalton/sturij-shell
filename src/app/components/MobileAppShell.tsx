/**
 * MobileAppShell — Sturij Dark Operations UI
 * Paradigm: Dark Operations UI (pl- token namespace)
 *
 * Prototype note: hardcoded hex values below are flagged scaffolding pending
 * tokenisation to pl-* CSS custom properties. See sessionNotes L3.
 * font-mono usage is a prototype exception — see sessionNotes L1.
 * rounded-xl on chips/cards is a design-required prototype exception — sessionNotes P.
 */

import { useState, useRef, useEffect, ReactNode, cloneElement, isValidElement } from 'react';
import {
  Settings, LogOut, Moon, Sun, Sparkles,
  AlignJustify, PenSquare, LayoutGrid, Paperclip, Send,
  ChevronLeft, ChevronRight, X,
  Home, Briefcase, Package, Layers, RefreshCw, Download, Share,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sheet, SheetContent } from './ui/sheet';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
const brandLogo = '';
const watermarkLogo = '';

// ─── Prototype colour constants (pending tokenisation) ────────────────────────
const C = {
  bg:              '#091220',
  surface:         '#0e1828',
  card:            'rgba(13,26,46,0.92)',
  cardBorderIdle:  'rgba(70,236,213,0.13)',
  cardBorderOpen:  'rgba(70,236,213,0.30)',
  teal:            '#46ecd5',
  tealSolid:       '#0d9488',
  tealDim:         'rgba(70,236,213,0.28)',
  tealFaint:       'rgba(70,236,213,0.10)',
  text:            '#d1d5dc',
  muted:           '#99a1af',
  vMuted:          '#6a7282',
  aiBg:            '#1e2939',
  aiBorder:        '#2d3748',
  userBg:          'rgba(70,236,213,0.16)',
  userBorder:      'rgba(70,236,213,0.40)',
  redBg:           'rgba(185,50,60,0.30)',
  redBorder:       'rgba(231,80,100,0.65)',
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

interface WorkflowButtonDef {
  label: string;
  color?: 'default' | 'teal' | 'blue' | 'red';
}
interface WorkflowStepDef {
  number: number;
  title: string;
  buttons: WorkflowButtonDef[];
}

const BUTTON_DETAILS: Record<string, { heading: string; body: string }> = {
  Schedule:    { heading: 'Schedule',        body: "View and select from today's job queue. Tap a scheduled run to load it directly into the nesting workspace." },
  Customer:    { heading: 'Customer',        body: 'Search by customer name or account number. Matching orders and open quotes appear for quick selection.' },
  Number:      { heading: 'Job Number',      body: 'Enter a job or work-order number to pull the exact project, including revision history and linked materials.' },
  Description: { heading: 'Description',     body: 'Full specification text entered at order creation — finish, profile style, grain direction, and any custom notes.' },
  Code:        { heading: 'Material Code',   body: 'Internal SKU mapped to the ERP catalogue. Confirms pricing tier, lead time, and available stock quantity.' },
  Colour:      { heading: 'Colour',          body: "RAL / NCS reference matched to your supplier's board range. Verify against the live colour swatch library." },
  Texture:     { heading: 'Texture',         body: 'Surface texture class — smooth, fine-grain, or embossed. Affects toolpath feed-rate and blade selection.' },
  Thickness:   { heading: 'Thickness',       body: 'Board thickness in mm. Cross-check with cutter clearance settings before nesting to avoid Z-axis collisions.' },
  Grain:       { heading: 'Grain Direction', body: 'Grain lock constraint: None, Vertical, Horizontal, or Match Previous Sheet. Locked grains reduce yield — confirm with customer.' },
  Materials:   { heading: 'Materials',       body: 'Full BOM for this run — board species, edge banding, hardware, and any bespoke components pulled from stock.' },
  Quality:     { heading: 'Quality Check',   body: 'QA flags raised during previous stages: surface defects, dimensional tolerances, and inspection sign-off status.' },
  Status:      { heading: 'Job Status',      body: 'Current workflow state: Pending → Confirmed → In Production → QC → Dispatched. Update triggers ERP and notifies the shop floor.' },
  Start:       { heading: 'Start Run',       body: 'Commits the nesting layout to the machine queue. A pre-start checklist must be completed and signed off before the CNC begins.' },
  Issue:       { heading: 'Raise Issue',     body: 'Log a production issue — wrong material, machine fault, or design discrepancy. Issue is routed to the floor manager immediately.' },
  Block:       { heading: 'Block Job',       body: 'Puts the job on hold and prevents it entering the machine queue. Add a reason; the customer and scheduler are automatically notified.' },
};

const WORKFLOW_STEPS: WorkflowStepDef[] = [
  {
    number: 1,
    title: 'Enter or Select your project',
    buttons: [{ label: 'Schedule' }, { label: 'Customer' }, { label: 'Number' }],
  },
  {
    number: 2,
    title: 'Review the project requirements',
    buttons: [
      { label: 'Description' }, { label: 'Code' }, { label: 'Colour' },
      { label: 'Texture' }, { label: 'Thickness' }, { label: 'Grain' },
    ],
  },
  {
    number: 3,
    title: 'Confirm materials and status',
    buttons: [{ label: 'Materials' }, { label: 'Quality' }, { label: 'Status' }],
  },
  {
    number: 4,
    title: 'Project manufacture readiness',
    buttons: [
      { label: 'Start', color: 'teal' },
      { label: 'Issue', color: 'blue' },
      { label: 'Block', color: 'red' },
    ],
  },
];

const SUGGESTION_CHIPS = [
  '# activity',
  'Set up automation',
  "Show today's pipeline",
  'View schedule',
  'Find customer',
  'Material check',
];

// ─── WorkflowStepCard ─────────────────────────────────────────────────────────
// Chips always visible. Detail panel accordions per chip click (layout animation).

interface ActiveChip { step: number; label: string }

interface WorkflowStepCardProps {
  step: WorkflowStepDef;
  isOpen: boolean;
  onToggle: () => void;
  activeChip: ActiveChip | null;
  onChipClick: (stepNum: number, label: string) => void;
}

function WorkflowStepCard({ step, isOpen, onToggle, activeChip, onChipClick }: WorkflowStepCardProps) {
  const chipBg = (color: string | undefined, isActive: boolean) => {
    if (color === 'red')  return isActive ? 'rgba(185,50,60,0.55)' : C.redBg;
    if (color === 'teal') return isActive ? 'rgba(0,200,180,0.40)' : 'rgba(0,188,168,0.14)';
    if (color === 'blue') return isActive ? 'rgba(81,162,255,0.40)' : 'rgba(81,162,255,0.14)';
    return isActive ? 'rgba(70,236,213,0.22)' : 'rgba(10,22,40,0.85)';
  };
  const chipBorder = (color: string | undefined) => {
    if (color === 'red')  return C.redBorder;
    if (color === 'teal') return 'rgba(0,213,190,0.65)';
    if (color === 'blue') return 'rgba(81,162,255,0.65)';
    return C.tealDim;
  };

  const activeLabel = activeChip?.step === step.number ? activeChip.label : null;
  const detail = activeLabel ? BUTTON_DETAILS[activeLabel] : null;

  return (
    <motion.div
      layout
      className="mb-2 overflow-hidden"
      style={{
        background: isOpen ? C.card : 'rgba(13,26,46,0.70)',
        border: `1px solid ${isOpen ? C.cardBorderOpen : C.cardBorderIdle}`,
        borderRadius: '12px', // prototype exception — pending design system decision
      }}
      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
    >
      {/* Header — tap to open/close */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 pt-3 pb-3 text-left"
      >
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-xs"
          style={{
            background: isOpen ? 'rgba(0,213,190,0.18)' : C.tealFaint,
            border: `1px solid ${isOpen ? 'rgba(70,236,213,0.55)' : 'rgba(70,236,213,0.22)'}`,
            color: C.teal,
          }}
        >
          {step.number}
        </span>
        <span
          className="flex-1 font-mono text-xs tracking-wide leading-tight"
          style={{ color: isOpen ? C.text : C.muted }}
        >
          {step.title}
        </span>
        <span
          className="font-mono text-sm flex-shrink-0"
          style={{ color: isOpen ? C.teal : C.vMuted, opacity: 0.8, lineHeight: 1 }}
        >
          {isOpen ? '×' : '+'}
        </span>
      </button>

      {/* Chips + detail — only when open */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="chips"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.28 }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${C.tealFaint}` }}
          >
            <div className="px-4 pt-3 pb-3">
              {/* Chips row */}
              <div className="flex flex-wrap gap-2">
                {step.buttons.map((btn) => {
                  const isActive = activeLabel === btn.label;
                  return (
                    <motion.button
                      key={btn.label}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      onClick={() => onChipClick(step.number, btn.label)}
                      className="px-3 py-1.5 font-mono text-xs shell-text"
                      style={{
                        background: chipBg(btn.color, isActive),
                        border: `1px solid ${chipBorder(btn.color)}`,
                        borderRadius: '8px', // prototype exception
                        boxShadow: isActive ? `0 0 10px 1px ${chipBorder(btn.color)}44` : 'none',
                      }}
                    >
                      {btn.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Detail panel — layout animated */}
              <motion.div layout>
                <AnimatePresence mode="wait">
                  {detail && (
                    <motion.div
                      key={activeLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                      className="mt-3 px-3 py-2.5"
                      style={{
                        background: 'rgba(0,213,190,0.05)',
                        border: `1px solid ${C.tealFaint}`,
                        borderRadius: '8px', // prototype exception
                      }}
                    >
                      <p className="font-mono text-[10px] tracking-widest mb-1.5" style={{ color: C.teal }}>
                        {detail.heading}
                      </p>
                      <p className="font-mono text-xs leading-relaxed" style={{ color: C.muted }}>
                        {detail.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Message types ─────────────────────────────────────────────────────────────

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
}

// ─── Shell Props ───────────────────────────────────────────────────────────────

interface MobileAppShellProps {
  children: ReactNode;
  navigationItems?: Array<{ label: string; icon: ReactNode; onClick: () => void }>;
  actionItems?: Array<{ label: string; icon: ReactNode; onClick: () => void }>;
  title?: string;
  userInitials?: string;
  isLandscape?: boolean;
  onToggleOrientation?: (v: boolean) => void;
  artifactInfo?: { title: string; dimensions?: string; stats?: Array<{ label: string; value: string }> };
  currentSheetIndex?: number | null;
  totalSheets?: number;
  currentSheetData?: { sheetNumber: number; panelsCut: number; totalPanels: number };
  onPrevSheet?: () => void;
  onNextSheet?: () => void;
  artifactScale?: number;
  onArtifactScaleChange?: (v: number) => void;
}

// ─── MobileAppShell ────────────────────────────────────────────────────────────

export function MobileAppShell({
  children,
  navigationItems = [],
  userInitials = 'MW',
  isLandscape: externalIsLandscape,
  onToggleOrientation,
  currentSheetIndex,
  totalSheets,
  currentSheetData,
  onPrevSheet,
  onNextSheet,
  artifactScale,
  onArtifactScaleChange,
}: MobileAppShellProps) {
  // ── state ──────────────────────────────────────────────────────────────────
  // All steps open by default (matches the design)
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set());
  const [activeChip, setActiveChip] = useState<ActiveChip | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  // Job-loaded state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [artifactRotation, setArtifactRotation] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── handlers ───────────────────────────────────────────────────────────────

  const toggleStep = (n: number) => {
    setOpenSteps(prev => {
      const isCurrentlyOpen = prev.has(n);
      // Close all, then open the tapped one (unless it was already open — close it)
      return isCurrentlyOpen ? new Set() : new Set([n]);
    });
    // Clear active chip whenever the step changes
    if (activeChip?.step !== n) setActiveChip(null);
  };

  const handleChipClick = (stepNum: number, label: string) => {
    setActiveChip(prev =>
      prev?.step === stepNum && prev.label === label ? null : { step: stepNum, label }
    );
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    const ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: text, timestamp: ts }]);
    setInputValue('');
    setTimeout(() => {
      const aiTs = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Search for a project?',
        timestamp: aiTs,
      }]);
    }, 900);
  };

  const handleChipSend = (chip: string) => {
    setInputValue(chip);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const toggleDark = () => {
    setIsDarkMode(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  // ── shared chrome: top bar ─────────────────────────────────────────────────

  const TopBar = (
    <header
      className="relative z-50 flex-shrink-0 flex items-center px-4 bg-black"
      style={{ height: 'var(--pl-footer-h)', borderBottom: `1px solid ${C.tealFaint}` }}
    >
      {/* Brand logo */}
      <img src={brandLogo} alt="Sturij" className="h-7 object-contain" />

      <span className="flex-1" />

      {/* Settings cog */}
      <button
        className="w-9 h-9 flex items-center justify-center mr-1"
        onClick={() => {}}
        aria-label="Settings"
      >
        <Settings
          className="w-5 h-5"
          style={{
            color: C.tealSolid,
            filter: 'drop-shadow(0 0 5px rgba(13,148,136,0.7)) drop-shadow(0 0 10px rgba(13,148,136,0.35))',
            strokeWidth: 1.5,
          }}
        />
      </button>

      {/* Avatar */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        onClick={() => setIsAvatarOpen(v => !v)}
        className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs"
        style={{
          border: `1.5px solid rgba(70,236,213,0.65)`,
          background: C.surface,
          color: C.teal,
        }}
        aria-label="User menu"
      >
        {userInitials}
      </motion.button>
    </header>
  );

  // ── shared chrome: subtitle bar ────────────────────────────────────────────

  const SubtitleBar = (
    <div
      className="relative z-40 flex-shrink-0 flex items-center px-2 bg-black"
      style={{ height: '40px', borderBottom: `1px solid ${C.tealFaint}` }}
    >
      {/* Hamburger — opens left nav drawer */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        onClick={() => setIsNavOpen(true)}
        className="w-9 h-9 flex items-center justify-center flex-shrink-0"
        aria-label="Navigation"
      >
        <AlignJustify className="w-4 h-4" style={{ color: C.muted }} />
      </motion.button>

      {/* Breadcrumb */}
      <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0">
        <span
          className="font-mono text-[11px] tracking-widest truncate"
          style={{ color: C.muted }}
        >
          CNC Nesting Assistant
        </span>
        <span className="font-mono text-[11px] tracking-widest flex-shrink-0" style={{ color: C.teal }}>
          / Operator
        </span>
      </div>

      {/* Edit icon — right action */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        onClick={() => {
          setMessages([]);
          setInputValue('');
        }}
        className="w-9 h-9 flex items-center justify-center flex-shrink-0"
        aria-label="New session"
      >
        <PenSquare className="w-4 h-4" style={{ color: C.muted }} />
      </motion.button>
    </div>
  );

  // ── Avatar menu ────────────────────────────────────────────────────────────

  const AvatarMenu = (
    <AnimatePresence>
      {isAvatarOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsAvatarOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            className="fixed right-3 z-[70] w-56 overflow-hidden"
            style={{
              top: 'calc(var(--pl-footer-h) + 4px)',
              background: C.surface,
              border: `1px solid ${C.tealFaint}`,
              borderRadius: '0', // square corners — Design Constitution §5.1
            }}
          >
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.tealFaint}` }}>
              <p className="font-mono text-xs" style={{ color: C.text }}>Mark Wilson</p>
              <p className="font-mono text-[10px]" style={{ color: C.vMuted }}>mark@example.com</p>
            </div>
            <div className="py-1" style={{ borderBottom: `1px solid ${C.tealFaint}` }}>
              <button
                onClick={() => { toggleDark(); setIsAvatarOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5"
                style={{ color: C.muted }}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="font-mono text-xs">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button
                onClick={() => { onToggleOrientation?.(!externalIsLandscape); setIsAvatarOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5"
                style={{ color: C.muted }}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-mono text-xs">Rotate View</span>
              </button>
            </div>
            <div className="py-1">
              <button className="flex items-center gap-3 w-full px-4 py-2.5" style={{ color: '#ef4444' }}>
                <LogOut className="w-4 h-4" />
                <span className="font-mono text-xs">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ── Nav drawer (left slide-over) ───────────────────────────────────────────

  const NavDrawer = (
    <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
      <SheetContent
        side="left"
        className="w-[64px] border-r p-0"
        style={{
          background: C.surface,
          borderColor: C.tealFaint,
        }}
        showClose={false}
      >
        {/* Close button at top */}
        <div
          className="flex items-center justify-center"
          style={{ height: '44px', borderBottom: `1px solid ${C.tealFaint}` }}
        >
          <button onClick={() => setIsNavOpen(false)} style={{ color: C.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Icon-only nav items with tooltips */}
        <nav className="flex flex-col items-center py-3 gap-1">
          {[
            { icon: <Home className="w-5 h-5" />, label: 'Home' },
            { icon: <Briefcase className="w-5 h-5" />, label: 'Projects' },
            { icon: <Package className="w-5 h-5" />, label: 'Materials' },
            { icon: <Layers className="w-5 h-5" />, label: 'Nesting Tool' },
            ...(navigationItems.length ? navigationItems : []),
          ].map((item, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  onClick={() => { item.onClick?.(); setIsNavOpen(false); }}
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ color: C.tealSolid }}
                  aria-label={item.label}
                >
                  {item.icon}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="font-mono text-xs">{item.label}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // HOME GUIDE LAYOUT  (currentSheetData === undefined)
  // Unified workflow + chat canvas — no floating drawer
  // ══════════════════════════════════════════════════════════════════════════════

  if (!currentSheetData) {
    return (
      <div
        className="relative flex flex-col overflow-hidden font-mono"
        style={{ height: '100dvh', background: C.bg }}
      >
        {/* Watermark */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none flex items-center justify-center">
          <img src={watermarkLogo} alt="" className="w-64 h-64 object-contain opacity-[0.025]" draggable={false} />
        </div>

        {TopBar}
        {SubtitleBar}

        {/* ── Scroll canvas: workflow steps + chat ──── */}
        <div
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto px-3 pt-3 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Workflow steps */}
          {WORKFLOW_STEPS.map(step => (
            <WorkflowStepCard
              key={step.number}
              step={step}
              isOpen={openSteps.has(step.number)}
              onToggle={() => toggleStep(step.number)}
              activeChip={activeChip}
              onChipClick={handleChipClick}
            />
          ))}

          {/* Chat messages — inline below workflow cards */}
          {messages.length > 0 && (
            <div className="mt-3 space-y-2 pb-4">
              {messages.map(msg =>
                msg.type === 'user' ? (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex items-start justify-end gap-2"
                  >
                    <div className="max-w-[80%]">
                      <div
                        className="px-4 py-3 font-mono text-sm"
                        style={{
                          background: C.userBg,
                          border: `1px solid ${C.userBorder}`,
                          color: C.text,
                          borderRadius: '12px 12px 2px 12px', // prototype exception — chat bubble shape
                        }}
                      >
                        {msg.content}
                      </div>
                      <p className="text-right font-mono text-[10px] mt-1" style={{ color: C.vMuted }}>
                        {msg.timestamp}
                      </p>
                    </div>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[10px] mt-0.5"
                      style={{
                        border: `1px solid ${C.tealDim}`,
                        background: C.surface,
                        color: C.teal,
                      }}
                    >
                      {userInitials}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex items-start gap-2"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: C.tealSolid }}
                    >
                      <Sparkles className="w-3.5 h-3.5 shell-text" />
                    </div>
                    <div className="max-w-[80%]">
                      <div
                        className="px-4 py-3 font-mono text-sm"
                        style={{
                          background: C.aiBg,
                          border: `1px solid ${C.aiBorder}`,
                          color: C.text,
                          borderRadius: '12px 12px 12px 2px', // prototype exception — chat bubble shape
                        }}
                      >
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[10px]" style={{ color: C.muted }}>Sturij AI</span>
                        <span style={{ color: C.aiBorder }}>•</span>
                        <span className="font-mono text-[10px]" style={{ color: C.muted }}>{msg.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Spacer so last card clears the bottom bar */}
          <div className="h-4" />
        </div>

        {/* ── Bottom bar: input + suggestion chips ──── */}
        <div
          className="relative z-50 flex-shrink-0 bg-black"
          style={{
            borderTop: `1px solid ${C.tealFaint}`,
            paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
          }}
        >
          {/* Input row */}
          <div
            className="flex items-center gap-2 mx-3 mt-2 mb-1 px-3 py-2"
            style={{
              background: C.surface,
              border: `1px solid ${C.tealDim}`,
              borderRadius: '10px', // prototype exception
            }}
          >
            <Paperclip className="w-4 h-4 flex-shrink-0" style={{ color: C.vMuted }} />
            <input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Enter customer, number or schedule"
              className="flex-1 bg-transparent font-mono text-sm outline-none"
              style={{ color: C.text }}
              // placeholder styling via CSS would need a class — using inline opacity via text color
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: inputValue.trim() ? C.tealSolid : 'rgba(13,148,136,0.25)',
              }}
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5 shell-text" />
            </motion.button>
          </div>

          {/* Suggestion chips row */}
          <div
            className="flex items-center gap-2 px-3 pb-1 pt-0.5 overflow-x-auto hide-scrollbar"
            style={{ scrollbarWidth: 'none' }}
          >
            {SUGGESTION_CHIPS.map(chip => (
              <motion.button
                key={chip}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                onClick={() => handleChipSend(chip)}
                className="flex-shrink-0 px-3 py-1.5 font-mono text-[11px] whitespace-nowrap"
                style={{
                  background: C.card,
                  border: `1px solid ${C.tealFaint}`,
                  color: C.muted,
                  borderRadius: '20px', // prototype exception — pill chips
                }}
              >
                {chip}
              </motion.button>
            ))}
            {/* Grid action */}
            <button
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center ml-auto"
              style={{ color: C.vMuted }}
              aria-label="More options"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {NavDrawer}
        {AvatarMenu}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // JOB-LOADED LAYOUT  (currentSheetData exists — artifact full-screen)
  // Artifact fills the viewport. Chat available as floating bottom panel.
  // ══════════════════════════════════════════════════════════════════════════════

  return (
    <div
      className="relative flex flex-col overflow-hidden font-mono"
      style={{ height: '100dvh', background: C.bg }}
    >
      {/* Watermark */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none flex items-center justify-center">
        <img src={watermarkLogo} alt="" className="w-64 h-64 object-contain opacity-[0.025]" draggable={false} />
      </div>

      {TopBar}

      {/* Subtitle bar — shows job info when loaded */}
      <div
        className="relative z-40 flex-shrink-0 flex items-center px-3 bg-black"
        style={{ height: '40px', borderBottom: `1px solid ${C.tealFaint}` }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          onClick={() => setIsNavOpen(true)}
          className="w-8 h-8 flex items-center justify-center flex-shrink-0 mr-2"
          aria-label="Navigation"
        >
          <AlignJustify className="w-4 h-4" style={{ color: C.muted }} />
        </motion.button>

        {/* Job ref */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="font-mono text-[11px] tracking-widest px-2 py-0.5"
            style={{
              background: 'rgba(13,148,136,0.15)',
              border: `1px solid ${C.tealDim}`,
              color: C.teal,
              borderRadius: '4px',
            }}
          >
            R001
          </span>
          <span className="font-mono text-[11px]" style={{ color: C.muted }}>
            <span style={{ color: C.teal }}>{currentSheetData.panelsCut}/{currentSheetData.totalPanels}</span> cut
          </span>
          <div className="w-px h-3 mx-1" style={{ background: C.tealFaint }} />
          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              onClick={onPrevSheet}
              disabled={currentSheetIndex === 0}
              className="w-6 h-6 flex items-center justify-center"
              style={{ color: C.muted, opacity: currentSheetIndex === 0 ? 0.3 : 1 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <span className="font-mono text-[11px] px-2 py-0.5"
              style={{ background: C.surface, border: `1px solid ${C.tealFaint}`, color: C.text, borderRadius: '4px' }}>
              {(currentSheetIndex ?? 0) + 1}/{totalSheets}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              onClick={onNextSheet}
              disabled={currentSheetIndex === (totalSheets ?? 1) - 1}
              className="w-6 h-6 flex items-center justify-center"
              style={{ color: C.muted, opacity: currentSheetIndex === (totalSheets ?? 1) - 1 ? 0.3 : 1 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          <span className="font-mono text-[11px] ml-1" style={{ color: C.vMuted }}>
            {Math.round((artifactScale ?? 0.65) * 100)}%
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ color: C.muted }}
          aria-label="New session"
        >
          <PenSquare className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Artifact viewport — fills remaining space */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="absolute inset-0">
          {isValidElement(children)
            ? cloneElement(children as React.ReactElement<any>, {
                parentScale: artifactScale ?? 0.65,
                parentRotation: artifactRotation,
              })
            : children}
        </div>

        {/* Floating chat bubble */}
        <AnimatePresence>
          {!isChatOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-4 w-11 h-11 rounded-full flex items-center justify-center z-40"
              style={{ background: C.tealSolid, boxShadow: '0 4px 16px rgba(13,148,136,0.5)' }}
              aria-label="Open chat"
            >
              <Sparkles className="w-5 h-5 shell-text" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat panel — slides up from bottom, within viewport */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 z-50 flex flex-col"
              style={{
                height: '50vh',
                background: 'rgba(7,13,26,0.97)',
                borderTop: `1px solid ${C.tealDim}`,
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
              }}
            >
              {/* Chat header */}
              <div
                className="flex items-center px-4 py-2.5 flex-shrink-0"
                style={{ borderBottom: `1px solid ${C.tealFaint}`, background: 'rgba(0,0,0,0.55)' }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center mr-2.5 flex-shrink-0"
                  style={{ background: C.tealSolid }}
                >
                  <Sparkles className="w-3 h-3 shell-text" />
                </div>
                <span className="font-mono text-xs tracking-widest flex-1" style={{ color: C.text }}>
                  CNC Nesting Assistant
                </span>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5"
                  style={{ color: C.muted }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 hide-scrollbar">
                {messages.map(msg =>
                  msg.type === 'user' ? (
                    <div key={msg.id} className="flex justify-end">
                      <div
                        className="px-3 py-2 font-mono text-xs max-w-[80%]"
                        style={{ background: C.userBg, border: `1px solid ${C.userBorder}`, color: C.text, borderRadius: '10px 10px 2px 10px' }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.tealSolid }}>
                        <Sparkles className="w-3 h-3 shell-text" />
                      </div>
                      <div
                        className="px-3 py-2 font-mono text-xs max-w-[80%]"
                        style={{ background: C.aiBg, border: `1px solid ${C.aiBorder}`, color: C.text, borderRadius: '10px 10px 10px 2px' }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="px-3 pt-1">
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{ background: C.surface, border: `1px solid ${C.tealDim}`, borderRadius: '8px' }}
                >
                  <Paperclip className="w-4 h-4 flex-shrink-0" style={{ color: C.vMuted }} />
                  <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Enter customer, number or schedule"
                    className="flex-1 bg-transparent font-mono text-xs outline-none"
                    style={{ color: C.text }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    onClick={handleSend}
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: inputValue.trim() ? C.tealSolid : 'rgba(13,148,136,0.25)' }}
                  >
                    <Send className="w-3 h-3 shell-text" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {NavDrawer}
      {AvatarMenu}
    </div>
  );
}