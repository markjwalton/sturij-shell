import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { UserMessage } from './components/UserMessage';
import { AnimatedBackground } from './components/AnimatedBackground';
import { TooltipProvider } from './components/ui/tooltip';
import { useIsMobileOrTablet } from './hooks/useMediaQuery';
import { MobileAppShell } from './components/MobileAppShell';

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
      <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
        <Header
          userName="Mark"
          userInitials="MW"
          artifactViewMode="stack"
          onToggleArtifactView={() => {}}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed(v => !v)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeView={activeView}
            onNavigate={setActiveView}
            isCollapsed={isSidebarCollapsed}
          />

          <main className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-gray-950">
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

            <div className="border-t border-gray-200 dark:border-gray-800">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
