import React, { useState } from "react";
import {
  MessageSquare, Bot, User, Play, Pause, Check, Send,
  Sun, Moon, ChevronRight, LayoutDashboard, Settings,
  Bell, Search, Plus, MoreHorizontal, Palette, Layers,
  Sparkles, ArrowRight, X, Home, Users, BarChart3,
  FileText, Calendar, Star, Heart, Zap, Eye
} from "lucide-react";

// ─── BRAND COLOURS ───
const TEAL = "#14B8A6";
const DARK_BG = "#0F0F14";
const DARK_SURFACE = "#1A1A24";
const DARK_BORDER = "#2A2A3A";
const LIGHT_BG = "#FAFAFA";
const LIGHT_SURFACE = "#FFFFFF";

// ─── SECTION WRAPPER ───
function Section({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 mb-6 ${dark ? "bg-[#0F0F14] text-white" : "bg-white text-gray-900 border border-gray-200"}`}>
      <h3 className="mb-4 pb-2 border-b" style={{ borderColor: dark ? DARK_BORDER : "#E5E7EB", color: dark ? "#A1A1AA" : "#6B7280", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── SIDEBAR NAV ───
function SidebarNav() {
  const [active, setActive] = useState(0);
  const items = [
    { icon: Home, label: "Home" },
    { icon: MessageSquare, label: "Chat" },
    { icon: Users, label: "Contacts" },
    { icon: BarChart3, label: "Analytics" },
    { icon: FileText, label: "Documents" },
    { icon: Calendar, label: "Calendar" },
    { icon: Settings, label: "Settings" },
  ];
  return (
    <div className="w-[220px] rounded-xl overflow-hidden" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}` }}>
      {/* Brand */}
      <div className="px-4 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${DARK_BORDER}` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: TEAL }}>
          <Sparkles size={16} color="white" />
        </div>
        <div>
          <div className="text-white" style={{ fontSize: 13 }}>Sturij</div>
          <div style={{ fontSize: 10, color: "#71717A" }}>Intelligence</div>
        </div>
      </div>
      {/* Nav Items */}
      <div className="p-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-colors"
            style={{
              background: active === i ? "rgba(20,184,166,0.12)" : "transparent",
              color: active === i ? TEAL : "#A1A1AA",
              fontSize: 13,
            }}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT BUBBLES ───
function ChatBubbles() {
  return (
    <div className="flex flex-col gap-4">
      {/* AI message - left aligned */}
      <div className="flex gap-3 items-start max-w-[380px]">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: TEAL }}>
          <Bot size={16} color="white" />
        </div>
        <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}`, color: "#E4E4E7", fontSize: 13 }}>
          Hi! I'm your Sturij assistant. I can help you manage contacts, create surveys, and generate artifacts. What would you like to do?
        </div>
      </div>
      {/* User message - left aligned, avatar right */}
      <div className="flex gap-3 items-start max-w-[380px] flex-row-reverse self-end">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-700">
          <User size={16} color="white" />
        </div>
        <div className="rounded-2xl rounded-tr-sm px-4 py-3" style={{ background: "#27272A", color: "#E4E4E7", fontSize: 13 }}>
          Show me the board materials for Project Alpha
        </div>
      </div>
      {/* AI response with artifact indicator */}
      <div className="flex gap-3 items-start max-w-[380px]">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: TEAL }}>
          <Bot size={16} color="white" />
        </div>
        <div>
          <div className="rounded-2xl rounded-tl-sm px-4 py-3 mb-2" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}`, color: "#E4E4E7", fontSize: 13 }}>
            Here are the board materials for Project Alpha. I've opened the artifact panel for you.
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(20,184,166,0.08)", border: `1px solid rgba(20,184,166,0.2)`, fontSize: 12, color: TEAL }}>
            <Layers size={14} />
            <span>Board Materials — Project Alpha</span>
            <ArrowRight size={12} className="ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MULTIPLE CHOICE TICKER ───
function MultipleChoiceTicker() {
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(1);
  const options = ["Modern Minimalist", "Industrial Chic", "Scandinavian", "Art Deco", "Rustic Farmhouse", "Mid-Century"];
  return (
    <div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 mb-2" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}`, color: "#E4E4E7", fontSize: 13 }}>
        What design style best matches your vision?
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPaused(!paused)} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(20,184,166,0.15)", color: TEAL }}>
          {paused ? <Play size={12} /> : <Pause size={12} />}
        </button>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="shrink-0 px-4 py-2 rounded-full transition-all"
              style={{
                fontSize: 12,
                background: selected === i ? TEAL : DARK_SURFACE,
                color: selected === i ? "white" : "#A1A1AA",
                border: `1px solid ${selected === i ? TEAL : DARK_BORDER}`,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CHECKBOX QUESTION ───
function CheckboxQuestion() {
  const [checked, setChecked] = useState([true, false, true, false]);
  const options = ["Kitchen Renovation", "Bathroom Update", "Living Room", "Outdoor Space"];
  const toggle = (i: number) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
  return (
    <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}`, fontSize: 13 }}>
      <div className="mb-3" style={{ color: "#E4E4E7" }}>Which areas are you planning to renovate?</div>
      <div className="flex flex-col gap-2 mb-3">
        {options.map((opt, i) => (
          <button key={i} onClick={() => toggle(i)} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors" style={{ background: checked[i] ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.03)" }}>
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors" style={{ background: checked[i] ? TEAL : "transparent", border: `1.5px solid ${checked[i] ? TEAL : "#52525B"}` }}>
              {checked[i] && <Check size={12} color="white" />}
            </div>
            <span style={{ color: checked[i] ? "#E4E4E7" : "#A1A1AA", fontSize: 13 }}>{opt}</span>
          </button>
        ))}
      </div>
      <button className="w-full py-2 rounded-lg" style={{ background: TEAL, color: "white", fontSize: 13 }}>
        Confirm Selection
      </button>
    </div>
  );
}

// ─── TEXT INPUT QUESTION ───
function TextInputQuestion() {
  return (
    <div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 mb-2" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}`, color: "#E4E4E7", fontSize: 13 }}>
        What's the approximate budget for this project?
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your answer..."
          className="flex-1 px-4 py-2.5 rounded-xl outline-none"
          style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}`, color: "#E4E4E7", fontSize: 13 }}
        />
        <button className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: TEAL }}>
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
}

// ─── COLOUR SWATCH TICKER ───
function ColourSwatchTicker() {
  const [selected, setSelected] = useState<number | null>(2);
  const [paused, setPaused] = useState(false);
  const swatches = [
    { name: "Midnight", hex: "#1E293B" },
    { name: "Sage", hex: "#6B8F71" },
    { name: "Terracotta", hex: "#C2714F" },
    { name: "Cream", hex: "#F5F0E8" },
    { name: "Dusty Rose", hex: "#C9A9A6" },
    { name: "Ocean", hex: "#2D6A8F" },
    { name: "Charcoal", hex: "#3F3F46" },
    { name: "Olive", hex: "#808B5A" },
  ];
  return (
    <div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 mb-2" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}`, color: "#E4E4E7", fontSize: 13 }}>
        Pick a wall colour that appeals to you:
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPaused(!paused)} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(20,184,166,0.15)", color: TEAL }}>
          {paused ? <Play size={12} /> : <Pause size={12} />}
        </button>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {swatches.map((s, i) => (
            <button key={i} onClick={() => setSelected(i)} className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-12 h-12 rounded-full relative flex items-center justify-center transition-all" style={{
                background: s.hex,
                border: selected === i ? `3px solid ${TEAL}` : "3px solid transparent",
                boxShadow: selected === i ? `0 0 0 1px ${TEAL}` : "none",
              }}>
                {selected === i && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(20,184,166,0.9)" }}>
                    <Check size={12} color="white" />
                  </div>
                )}
              </div>
              <span style={{ fontSize: 10, color: selected === i ? TEAL : "#71717A" }}>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WALL COLOUR PICKER (ARTIFACT) ───
function WallColourPicker() {
  const [selected, setSelected] = useState(3);
  const paints = [
    { name: "Cotton White", hex: "#F5F0E8" },
    { name: "Dove Grey", hex: "#B8B5AD" },
    { name: "Sage Green", hex: "#8FAE7E" },
    { name: "Dusty Blue", hex: "#7FA8C9" },
    { name: "Warm Taupe", hex: "#A89B8C" },
    { name: "Blush Pink", hex: "#D4A5A5" },
    { name: "Charcoal", hex: "#4A4A52" },
    { name: "Terracotta", hex: "#C2714F" },
    { name: "Navy", hex: "#2C3E6B" },
  ];
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${DARK_BORDER}` }}>
        <div className="flex items-center gap-2">
          <Palette size={14} style={{ color: TEAL }} />
          <span style={{ color: "#E4E4E7", fontSize: 13 }}>Wall Colour</span>
        </div>
        <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: "#71717A" }}><X size={14} /></button>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {paints.map((p, i) => (
            <button key={i} onClick={() => setSelected(i)} className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-full transition-all" style={{
                background: p.hex,
                border: selected === i ? `3px solid ${TEAL}` : "3px solid transparent",
                boxShadow: selected === i ? `0 0 8px rgba(20,184,166,0.4)` : "none",
              }} />
              <span style={{ fontSize: 10, color: selected === i ? TEAL : "#71717A" }}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ARTIFACT CARD ───
function ArtifactCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${DARK_BORDER}` }}>
        <div className="flex items-center gap-2">
          <Layers size={14} style={{ color: TEAL }} />
          <span style={{ color: "#E4E4E7", fontSize: 13 }}>Board Materials</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2.5 py-1 rounded-md flex items-center gap-1.5" style={{ background: "rgba(20,184,166,0.1)", color: TEAL, fontSize: 11 }}>
            <Palette size={12} /> Wall
          </button>
          <button className="w-7 h-7 rounded-md flex items-center justify-center" style={{ color: "#71717A" }}>
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {["Flooring Options", "Cabinet Finishes", "Countertop Materials"].map((item, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${DARK_BORDER}` }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded" style={{ background: ["#8B7355", "#D4C5B0", "#9CA3AF"][i] }} />
              <span style={{ color: "#E4E4E7", fontSize: 13 }}>{item}</span>
            </div>
            <ChevronRight size={14} style={{ color: "#52525B" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUTTONS ───
function Buttons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="px-4 py-2 rounded-lg flex items-center gap-2" style={{ background: TEAL, color: "white", fontSize: 13 }}>
        <Plus size={14} /> New Chat
      </button>
      <button className="px-4 py-2 rounded-lg flex items-center gap-2" style={{ background: DARK_SURFACE, color: "#E4E4E7", border: `1px solid ${DARK_BORDER}`, fontSize: 13 }}>
        <Search size={14} /> Search
      </button>
      <button className="px-4 py-2 rounded-lg flex items-center gap-2" style={{ background: "rgba(20,184,166,0.1)", color: TEAL, border: `1px solid rgba(20,184,166,0.2)`, fontSize: 13 }}>
        <Sparkles size={14} /> Generate
      </button>
      <button className="px-4 py-2 rounded-lg" style={{ background: "#DC2626", color: "white", fontSize: 13 }}>
        Delete
      </button>
      <button className="px-4 py-2 rounded-lg" style={{ background: "transparent", color: "#A1A1AA", fontSize: 13 }}>
        Cancel
      </button>
    </div>
  );
}

// ─── ICON SET ───
function IconSet() {
  const icons = [
    { Icon: MessageSquare, label: "Chat" },
    { Icon: Bot, label: "AI" },
    { Icon: User, label: "User" },
    { Icon: Layers, label: "Artifact" },
    { Icon: Palette, label: "Colour" },
    { Icon: Sparkles, label: "Generate" },
    { Icon: LayoutDashboard, label: "Dashboard" },
    { Icon: Settings, label: "Settings" },
    { Icon: Bell, label: "Notify" },
    { Icon: Search, label: "Search" },
    { Icon: Plus, label: "Add" },
    { Icon: Send, label: "Send" },
    { Icon: Star, label: "Star" },
    { Icon: Heart, label: "Fave" },
    { Icon: Zap, label: "Quick" },
    { Icon: Eye, label: "View" },
    { Icon: BarChart3, label: "Stats" },
    { Icon: FileText, label: "Doc" },
  ];
  return (
    <div className="grid grid-cols-9 gap-3">
      {icons.map(({ Icon, label }, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${DARK_BORDER}` }}>
            <Icon size={18} style={{ color: "#A1A1AA" }} />
          </div>
          <span style={{ fontSize: 9, color: "#71717A" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── TOGGLE ───
function DarkLightToggle() {
  const [dark, setDark] = useState(true);
  return (
    <div className="flex items-center gap-3">
      <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${DARK_BORDER}` }}>
        <button onClick={() => setDark(false)} className="px-3 py-2 flex items-center gap-2" style={{ background: !dark ? TEAL : DARK_SURFACE, color: !dark ? "white" : "#71717A", fontSize: 12 }}>
          <Sun size={14} /> Light
        </button>
        <button onClick={() => setDark(true)} className="px-3 py-2 flex items-center gap-2" style={{ background: dark ? TEAL : DARK_SURFACE, color: dark ? "white" : "#71717A", fontSize: 12 }}>
          <Moon size={14} /> Dark
        </button>
      </div>
    </div>
  );
}

// ─── DESIGN PLAYGROUND BADGE ───
function DesignPlayground() {
  const swatches = [
    { hex: "#6B8F71", name: "Sage", shortlisted: true },
    { hex: "#C2714F", name: "Terracotta", shortlisted: true },
    { hex: "#7FA8C9", name: "Dusty Blue", shortlisted: false },
    { hex: "#F5F0E8", name: "Cotton", shortlisted: true },
  ];
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: DARK_SURFACE, border: `1px solid ${DARK_BORDER}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${DARK_BORDER}` }}>
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: TEAL }} />
          <span style={{ color: "#E4E4E7", fontSize: 13 }}>Design Playground</span>
        </div>
        <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(20,184,166,0.15)", color: TEAL, fontSize: 10 }}>
          3 shortlisted
        </span>
      </div>
      <div className="p-4 flex gap-4">
        {swatches.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-xl relative" style={{ background: s.hex, border: s.shortlisted ? `2px solid ${TEAL}` : "2px solid transparent" }}>
              {s.shortlisted && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: TEAL }}>
                  <Check size={10} color="white" />
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, color: s.shortlisted ? "#E4E4E7" : "#52525B" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GLOW EFFECT DEMO ───
function GlowEffect() {
  return (
    <div className="relative rounded-xl overflow-hidden h-[100px]" style={{ background: DARK_BG }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: `radial-gradient(circle, ${TEAL}, transparent)` }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center" style={{ color: "#71717A", fontSize: 11 }}>
        Mouse-following glow effect
      </div>
    </div>
  );
}

// ─── MAIN SHOWCASE ───
export function UIShowcase() {
  return (
    <div className="min-h-screen p-8" style={{ background: "#09090B" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: TEAL }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h1 className="text-white" style={{ fontSize: 22 }}>Sturij Intelligence</h1>
            <p style={{ color: "#71717A", fontSize: 13 }}>Component Reference Sheet</p>
          </div>
        </div>

        {/* Colour Palette */}
        <Section title="Brand Colours" dark>
          <div className="flex gap-4 flex-wrap">
            {[
              { hex: TEAL, name: "Primary Teal", token: "#14B8A6" },
              { hex: DARK_BG, name: "Background", token: "#0F0F14" },
              { hex: DARK_SURFACE, name: "Surface", token: "#1A1A24" },
              { hex: DARK_BORDER, name: "Border", token: "#2A2A3A" },
              { hex: "#E4E4E7", name: "Text Primary", token: "#E4E4E7" },
              { hex: "#A1A1AA", name: "Text Secondary", token: "#A1A1AA" },
              { hex: "#71717A", name: "Text Muted", token: "#71717A" },
              { hex: "#27272A", name: "User Bubble", token: "#27272A" },
              { hex: "#DC2626", name: "Destructive", token: "#DC2626" },
            ].map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-xl" style={{ background: c.hex, border: `1px solid ${DARK_BORDER}` }} />
                <span style={{ fontSize: 10, color: "#A1A1AA" }}>{c.name}</span>
                <span style={{ fontSize: 9, color: "#52525B", fontFamily: "monospace" }}>{c.token}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Sidebar */}
        <Section title="Sidebar Navigation" dark>
          <SidebarNav />
        </Section>

        {/* Chat Bubbles */}
        <Section title="Chat Messages — AI + User" dark>
          <ChatBubbles />
        </Section>

        {/* Question Types */}
        <Section title="Question: Multiple Choice Ticker" dark>
          <div className="max-w-[420px]">
            <MultipleChoiceTicker />
          </div>
        </Section>

        <Section title="Question: Checkbox (In-Bubble)" dark>
          <div className="max-w-[320px]">
            <CheckboxQuestion />
          </div>
        </Section>

        <Section title="Question: Text Input" dark>
          <div className="max-w-[380px]">
            <TextInputQuestion />
          </div>
        </Section>

        <Section title="Question: Colour Swatch Ticker" dark>
          <div className="max-w-[450px]">
            <ColourSwatchTicker />
          </div>
        </Section>

        {/* Artifacts */}
        <div className="grid grid-cols-2 gap-6">
          <Section title="Artifact: Board Materials" dark>
            <ArtifactCard />
          </Section>
          <Section title="Artifact: Wall Colour Picker" dark>
            <WallColourPicker />
          </Section>
        </div>

        <Section title="Design Playground" dark>
          <DesignPlayground />
        </Section>

        {/* Controls */}
        <Section title="Buttons" dark>
          <Buttons />
        </Section>

        <Section title="Dark / Light Toggle" dark>
          <DarkLightToggle />
        </Section>

        <Section title="Icon Set (Lucide)" dark>
          <IconSet />
        </Section>

        <Section title="Glow Effect (Google Stitch-style)" dark>
          <GlowEffect />
        </Section>
      </div>
    </div>
  );
}
