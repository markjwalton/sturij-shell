import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { UserMessage } from './components/UserMessage';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ArtifactStack, ArtifactStackHandle } from './components/ArtifactStack';
import { TooltipProvider } from './components/ui/tooltip';
import { useIsMobileOrTablet } from './hooks/useMediaQuery';
import { MobileAppShell } from './components/MobileAppShell';
// lucide icons removed — artifacts are empty shells
import logoWatermark from '../assets/logo-white.png';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
}

export default function App() {
  const [activeView, setActiveView] = useState('Canvas');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to Sturij Intelligence. How can I help you today?',
      timestamp: '09:00',
    },
  ]);

  const isMobileOrTablet = useIsMobileOrTablet();
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const artifactStackRef = useRef<ArtifactStackHandle>(null);

  const artifacts = [
    { id: '1', title: '', badge: undefined, icon: undefined, content: null, isExpanded: false },
    { id: '2', title: '', badge: undefined, icon: undefined, content: null, isExpanded: false },
    { id: '3', title: '', badge: undefined, icon: undefined, content: null, isExpanded: false },
  ];

  const handleSendMessage = (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages(prev => [...prev, userMsg]);
  };

  if (isMobileOrTablet) {
    return <MobileAppShell title="Sturij Intelligence" userInitials="MW" />;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-dvh shell-bg shell-text">
        <Header
          userName="Mark"
          userInitials="MW"
          artifactViewMode="stack"
          onToggleArtifactView={() => {}}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed(v => !v)}
          isPanelCollapsed={isPanelCollapsed}
          onTogglePanelCollapse={() => setIsPanelCollapsed(v => !v)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeView={activeView}
            onNavigate={setActiveView}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(v => !v)}
          />

          <main className="flex-1 flex flex-col relative overflow-hidden shell-hero-glow">
            <img 
              src={logoWatermark} 
              alt="" 
              aria-hidden="true"
              className="shell-watermark"
            />
            <AnimatedBackground />

            <div className="flex-1 overflow-y-auto relative z-[2]">
              <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="space-y-6">
                  {messages.map((message) =>
                    message.type === 'user' ? (
                      <UserMessage
                        key={message.id}
                        message={message.content}
                        timestamp={message.timestamp}
                        userInitials="MW"
                      />
                    ) : (
                      <ChatMessage
                        key={message.id}
                        message={message.content}
                        timestamp={message.timestamp}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

          </main>
        </div>

        {/* Right artifact panel */}
        <ArtifactStack
          ref={artifactStackRef}
          artifacts={artifacts}
          isCollapsed={isPanelCollapsed}
          onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
        />

        <div className="border-t shrink-0">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </TooltipProvider>
  );
}
