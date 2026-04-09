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
import { LayoutDashboard, TrendingUp, Brain, Users } from 'lucide-react';

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
    {
      id: 'pipeline',
      title: 'Pipeline',
      badge: 'Live',
      badgeColor: 'bg-teal-900/40 text-teal-300',
      icon: <TrendingUp className="w-4 h-4 text-teal-400" />,
      isExpanded: true,
      content: (
        <div className="space-y-2 text-sm text-gray-400 p-2">
          <div className="flex justify-between"><span>New leads</span><span className="text-white font-medium">2</span></div>
          <div className="flex justify-between"><span>In quote</span><span className="text-white font-medium">1</span></div>
          <div className="flex justify-between"><span>Customers</span><span className="text-white font-medium">634</span></div>
        </div>
      ),
    },
    {
      id: 'knowledge',
      title: 'Knowledge',
      badge: 'AI',
      badgeColor: 'bg-purple-900/40 text-purple-300',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      isExpanded: false,
      content: (
        <div className="text-sm text-gray-400 p-2">
          <p>8 entities · 16 docs · 83 chunks</p>
        </div>
      ),
    },
    {
      id: 'operations',
      title: 'Operations',
      badge: 'Real-time',
      badgeColor: 'bg-blue-900/40 text-blue-300',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      isExpanded: false,
      content: (
        <div className="text-sm text-gray-400 p-2">
          <p>436 contacts · 97 in Engage</p>
        </div>
      ),
    },
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
      <div className="flex flex-col h-screen" style={{ background: 'var(--shell-background)', color: 'var(--shell-text-primary)' }}>
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
          />

          <main className="flex-1 flex flex-col relative overflow-hidden" style={{ background: 'var(--shell-background)' }}>
            <AnimatedBackground />

            <div className="flex-1 overflow-y-auto relative z-10">
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

            <div className="border-t">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </main>

          {/* Right artifact panel */}
          <ArtifactStack
            ref={artifactStackRef}
            artifacts={artifacts}
            isCollapsed={isPanelCollapsed}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
