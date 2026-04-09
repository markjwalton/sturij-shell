import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CanvasHeader } from './components/CanvasHeader';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { UserMessage } from './components/UserMessage';
import { ArtifactCarousel, ArtifactCarouselHandle } from './components/ArtifactCarousel';
import { ArtifactStack, ArtifactStackHandle } from './components/ArtifactStack';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Button } from './components/ui/button';
import { LayoutDashboard, TrendingUp, Brain, Users, CheckCircle2, FileText, Clock, Calendar, Paintbrush, Smartphone } from 'lucide-react';
import { TooltipProvider } from './components/ui/tooltip';
import { FloorPlanArtifact } from './components/FloorPlanArtifact';
import { QuestionTicker } from './components/QuestionTicker';
import { BoardMaterialsArtifact, WardrobeConfig } from './components/BoardMaterialsArtifact';
import type { ColourSwatch } from './components/ColourSwatchTicker';
import { UIShowcase } from './components/ui-showcase';
import MobileNestingTool from './mobile-nesting-tool';
import { useIsMobileOrTablet } from './hooks/useMediaQuery';

interface QuestionOption {
  label: string;
  value: string;
}

interface EmbeddedQuestion {
  type: 'multiple-choice' | 'checkbox' | 'radio' | 'text-input' | 'colour-swatch';
  question: string;
  options?: QuestionOption[];
  placeholder?: string;
}

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
  actions?: Array<{ label: string; primary?: boolean }>;
  showSomethingElse?: boolean;
  embeddedQuestion?: EmbeddedQuestion;
}

export default function App() {
  const [showShowcase, setShowShowcase] = useState(false);
  const [showMobileView, setShowMobileView] = useState(false);
  const [activeView, setActiveView] = useState('Canvas');
  const [artifactViewMode, setArtifactViewMode] = useState<'carousel' | 'stack'>('stack');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const artifactCarouselRef = useRef<ArtifactCarouselHandle>(null);
  const artifactStackRef = useRef<ArtifactStackHandle>(null);
  const [currentQuestion, setCurrentQuestion] = useState<EmbeddedQuestion | null>(null);
  const [wardrobeConfig, setWardrobeConfig] = useState<WardrobeConfig>({});

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to your Wardrobe Planner! Let\'s design your perfect wardrobe. First, tell me about the room.',
      timestamp: '09:15',
      embeddedQuestion: {
        type: 'multiple-choice',
        question: 'What type of room is this?',
        options: [
          { label: 'Bedroom', value: 'Bedroom' },
          { label: 'Dressing room', value: 'Dressing room' },
          { label: 'Home office', value: 'Home office' },
          { label: 'Living room', value: 'Living room' },
          { label: 'Hallway', value: 'Hallway' },
          { label: 'Utility', value: 'Utility' },
          { label: 'Guest room', value: 'Guest room' },
          { label: 'Kids room', value: 'Kids room' },
          { label: 'Walk-in closet', value: 'Walk-in closet' },
          { label: 'Garage', value: 'Garage' },
        ],
      },
    },
  ]);

  // Determine current colour slot from active question
  const getActiveColourSlot = (): string | null => {
    const latestQ = [...messages].reverse().find(m => m.type === 'ai' && m.embeddedQuestion);
    const q = latestQ?.embeddedQuestion?.question;
    if (q === 'Choose a door colour:') return 'doorColour';
    if (q === 'Choose an external panel colour:') return 'external';
    if (q === 'Choose an internal carcass colour:') return 'internal';
    return null;
  };

  const activeColourSlot = getActiveColourSlot();

  const getActiveCandidates = (): ColourSwatch[] => {
    if (activeColourSlot === 'doorColour') return wardrobeConfig.doorColourCandidates || [];
    if (activeColourSlot === 'external') return wardrobeConfig.externalPanelColourCandidates || [];
    if (activeColourSlot === 'internal') return wardrobeConfig.internalCarcassColourCandidates || [];
    return [];
  };

  const handleAddCandidate = (swatch: ColourSwatch) => {
    const slot = activeColourSlot;
    if (!slot) return;
    setWardrobeConfig(prev => {
      const key = slot === 'doorColour' ? 'doorColourCandidates' as const
        : slot === 'external' ? 'externalPanelColourCandidates' as const
        : 'internalCarcassColourCandidates' as const;
      const existing = prev[key] || [];
      if (existing.some((s: ColourSwatch) => s.value === swatch.value)) return prev;
      return { ...prev, [key]: [...existing, swatch] };
    });
  };

  const handleQuestionAnswer = (answer: string | string[]) => {
    const answerText = Array.isArray(answer) ? answer.join(', ') : answer;
    const userAnswerMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: answerText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    const latestQuestionMsg = [...messages].reverse().find(m => m.type === 'ai' && m.embeddedQuestion);
    const answeredQuestion = latestQuestionMsg?.embeddedQuestion;

    setMessages(prev => [...prev, userAnswerMsg]);
    setCurrentQuestion(null);

    if (answeredQuestion?.question === 'What type of room is this?') {
      setWardrobeConfig(prev => ({ ...prev, roomType: answerText }));
    } else if (answeredQuestion?.question === 'What is the wall width in mm?') {
      setWardrobeConfig(prev => ({ ...prev, wallWidth: answerText }));
    } else if (answeredQuestion?.question === 'Select a door style:') {
      setWardrobeConfig(prev => ({ ...prev, doorStyle: answerText }));
    } else if (answeredQuestion?.question === 'Select all fittings you need:') {
      setWardrobeConfig(prev => ({ ...prev, fittings: Array.isArray(answer) ? answer : [answerText] }));
    } else if (answeredQuestion?.question === 'Choose a door colour:') {
      setWardrobeConfig(prev => ({ ...prev, doorColour: answerText }));
    } else if (answeredQuestion?.question === 'Choose an external panel colour:') {
      setWardrobeConfig(prev => ({ ...prev, externalPanelColour: answerText }));
    } else if (answeredQuestion?.question === 'Choose an internal carcass colour:') {
      setWardrobeConfig(prev => ({ ...prev, internalCarcassColour: answerText }));
    } else if (answeredQuestion?.question === 'Select a handle style:') {
      setWardrobeConfig(prev => ({ ...prev, handleStyle: answerText }));
    }

    setTimeout(() => {
      let nextQuestion: Message;
      const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      if (answeredQuestion?.question === 'What type of room is this?') {
        nextQuestion = { id: (Date.now() + 1).toString(), type: 'ai', content: `Perfect, a ${answerText}! Now let's get the dimensions.`, timestamp: ts, embeddedQuestion: { type: 'text-input', question: 'What is the wall width in mm?', placeholder: 'e.g. 2400' } };
      } else if (answeredQuestion?.question === 'What is the wall width in mm?') {
        nextQuestion = { id: (Date.now() + 1).toString(), type: 'ai', content: `${answerText}mm noted. Now, choose your door style:`, timestamp: ts, embeddedQuestion: { type: 'radio', question: 'Select a door style:', options: [{ label: 'Slab (flat panel)', value: 'Slab (flat panel)' }, { label: 'Shaker (recessed centre panel)', value: 'Shaker (recessed centre panel)' }, { label: 'J-Pull (integrated handle groove)', value: 'J-Pull (integrated handle groove)' }, { label: 'Glass (aluminium frame with glass panel)', value: 'Glass (aluminium frame with glass panel)' }] } };
      } else if (answeredQuestion?.question === 'Select a door style:') {
        nextQuestion = { id: (Date.now() + 1).toString(), type: 'ai', content: `Great choice! Now select which internal fittings you'd like:`, timestamp: ts, embeddedQuestion: { type: 'checkbox', question: 'Select all fittings you need:', options: [{ label: 'Hanging rail', value: 'Hanging rail' }, { label: 'Shelves', value: 'Shelves' }, { label: 'Drawers', value: 'Drawers' }, { label: 'Shoe rack', value: 'Shoe rack' }, { label: 'Mirror', value: 'Mirror' }, { label: 'LED lighting', value: 'LED lighting' }] } };
      } else if (answeredQuestion?.question === 'Select all fittings you need:') {
        nextQuestion = { id: (Date.now() + 1).toString(), type: 'ai', content: `Great selections! Now let's pick colours for your wardrobe doors. Click swatches to shortlist them — you can add multiple:`, timestamp: ts, embeddedQuestion: { type: 'colour-swatch', question: 'Choose a door colour:' } };
      } else if (answeredQuestion?.question === 'Choose a door colour:') {
        nextQuestion = { id: (Date.now() + 1).toString(), type: 'ai', content: `${answerText} doors — lovely! Now choose a colour for the external side panels:`, timestamp: ts, embeddedQuestion: { type: 'colour-swatch', question: 'Choose an external panel colour:' } };
      } else if (answeredQuestion?.question === 'Choose an external panel colour:') {
        nextQuestion = { id: (Date.now() + 1).toString(), type: 'ai', content: `External panels in ${answerText}. Now pick the internal carcass colour:`, timestamp: ts, embeddedQuestion: { type: 'colour-swatch', question: 'Choose an internal carcass colour:' } };
      } else if (answeredQuestion?.question === 'Choose an internal carcass colour:') {
        nextQuestion = { id: (Date.now() + 1).toString(), type: 'ai', content: `Internal carcass in ${answerText}. Finally, select your handle style:`, timestamp: ts, embeddedQuestion: { type: 'radio', question: 'Select a handle style:', options: [{ label: 'Bar handle (brushed chrome)', value: 'Bar handle (brushed chrome)' }, { label: 'Knob (satin nickel)', value: 'Knob (satin nickel)' }, { label: 'Cup pull (antique brass)', value: 'Cup pull (antique brass)' }, { label: 'Edge pull (matt black)', value: 'Edge pull (matt black)' }, { label: 'No handle (push-to-open)', value: 'No handle (push-to-open)' }] } };
      } else {
        nextQuestion = { id: (Date.now() + 1).toString(), type: 'ai', content: `Your board materials specification is complete! Check the <strong>Board Materials</strong> artifact for the full summary.`, timestamp: ts };
      }

      setMessages(prev => [...prev, nextQuestion]);
    }, 1000);
  };

  const handleRemoveCandidate = (slotKey: string, value: string) => {
    setWardrobeConfig(prev => {
      const candKey = slotKey === 'doorColour' ? 'doorColourCandidates' as const
        : slotKey === 'external' ? 'externalPanelColourCandidates' as const
        : 'internalCarcassColourCandidates' as const;
      const colourKey = slotKey === 'doorColour' ? 'doorColour' as const
        : slotKey === 'external' ? 'externalPanelColour' as const
        : 'internalCarcassColour' as const;
      const existing = prev[candKey] || [];
      const updated = existing.filter((s: ColourSwatch) => s.value !== value);
      if (updated.length === 1) {
        const finalValue = updated[0].value;
        setTimeout(() => handleQuestionAnswer(finalValue), 300);
        return { ...prev, [candKey]: updated, [colourKey]: finalValue };
      }
      return { ...prev, [candKey]: updated };
    });
  };

  const artifacts = [
    {
      id: 'board-materials',
      title: 'Board Materials',
      badge: 'Live',
      badgeColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
      icon: <Paintbrush className="w-5 h-5 text-teal-600" />,
      isExpanded: true,
      content: <BoardMaterialsArtifact config={wardrobeConfig} onRemoveCandidate={handleRemoveCandidate} />,
    },
    {
      id: 'floorplan',
      title: 'Floor Plan',
      badge: 'Design',
      badgeColor: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      icon: <LayoutDashboard className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      isExpanded: true,
      content: <FloorPlanArtifact />,
    },
    {
      id: 'pipeline',
      title: 'Pipeline Overview',
      badge: 'Live Data',
      badgeColor: 'bg-green-100 text-green-700',
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
      isExpanded: false,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { name: 'New', count: 2, color: 'bg-blue-600' },
              { name: 'Connect', count: 1, color: 'bg-purple-600' },
              { name: 'Engage', count: 87, color: 'bg-teal-600' },
              { name: 'Quote', count: 1, color: 'bg-orange-500' },
              { name: 'Customer', count: 634, color: 'bg-green-600' },
            ].map((stage) => (
              <div key={stage.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full ${stage.color} text-white flex items-center justify-center font-semibold shadow-sm`}>{stage.count}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{stage.name}</div>
                  <div className="text-xs text-gray-500">{stage.count} {stage.count === 1 ? 'contact' : 'contacts'}</div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Open Full Pipeline</Button>
        </div>
      ),
    },
    {
      id: 'knowledge',
      title: 'Knowledge Layer',
      badge: 'AI Learning',
      badgeColor: 'bg-purple-100 text-purple-700',
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      isExpanded: false,
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div><div className="font-medium text-sm">Entity Facts</div><div className="text-xs text-gray-500 mt-0.5">8 entities tracked</div></div>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div><div className="font-medium text-sm">Documents</div><div className="text-xs text-gray-500 mt-0.5">16 docs · 83 chunks</div></div>
          </div>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-700">AI is learning from interactions and building relationships between entities.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'operations',
      title: 'Operations Context',
      badge: 'Real-time',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      isExpanded: false,
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
            <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div><div className="font-medium text-sm">Active Pipeline</div><div className="text-xs text-gray-500 mt-0.5">97 in Engage · 1 in Quote</div></div>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div><div className="font-medium text-sm">436 Contacts</div><div className="text-xs text-gray-500 mt-0.5">297 suppliers · 176 groups</div></div>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
            <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div><div className="font-medium text-sm">Today's Schedule</div><div className="text-xs text-gray-500 mt-0.5">3 appointments · 2 follow-ups</div></div>
          </div>
        </div>
      ),
    },
    {
      id: 'insights',
      title: 'AI Insights',
      badge: 'Generated',
      badgeColor: 'bg-teal-100 text-teal-700',
      icon: <Brain className="w-5 h-5 text-teal-600" />,
      isExpanded: false,
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-sm font-medium text-teal-900 mb-2">Suggested Actions</p>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2"><span className="text-teal-600">•</span><span>Follow up with 3 contacts in Engage stage</span></li>
              <li className="flex items-start gap-2"><span className="text-teal-600">•</span><span>Review pending quote for approval</span></li>
              <li className="flex items-start gap-2"><span className="text-teal-600">•</span><span>Schedule site visit for Corrigan project</span></li>
            </ul>
          </div>
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm">Apply Suggestions</Button>
        </div>
      ),
    },
  ];

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages([...messages, newMessage]);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you want to know about "${content}". Let me pull that information for you...`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        actions: [{ label: 'View Details', primary: true }, { label: 'More Options', primary: false }],
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleReorderArtifacts = (reorderedArtifacts: typeof artifacts) => {
    console.log('Artifacts reordered:', reorderedArtifacts);
  };

  const toggleArtifactView = () => {
    setArtifactViewMode(prev => prev === 'carousel' ? 'stack' : 'carousel');
  };

  const handleExpandAll = () => {
    if (artifactStackRef.current && artifactViewMode === 'stack') artifactStackRef.current.expandAll?.();
  };

  const handleCollapseAll = () => {
    if (artifactStackRef.current && artifactViewMode === 'stack') artifactStackRef.current.collapseAll?.();
  };

  const handleTogglePanelCollapse = () => setIsPanelCollapsed(!isPanelCollapsed);
  const handleToggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const isMobileOrTablet = useIsMobileOrTablet();

  // Determine if we should show mobile view
  const shouldShowMobileView = isMobileOrTablet || showMobileView;

  return (
    <TooltipProvider>
      {showShowcase ? (
        <div className="relative">
          <button
            onClick={() => setShowShowcase(false)}
            className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white"
            style={{ background: '#14B8A6', fontSize: 13 }}
          >
            ← Back to App
          </button>
          <UIShowcase />
        </div>
      ) : shouldShowMobileView ? (
        <div className="relative">
          {/* Only show desktop toggle button if manually toggled on desktop */}
          {!isMobileOrTablet && (
            <button
              onClick={() => setShowMobileView(false)}
              className="fixed top-2 left-2 z-50 px-3 py-1.5 rounded-lg text-xs bg-gray-900 dark:bg-gray-800 text-white shadow-lg"
            >
              ← Desktop View
            </button>
          )}
          <MobileNestingTool />
        </div>
      ) : (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
        <Header
          userName="Mark"
          userInitials="MW"
          artifactViewMode={artifactViewMode}
          onToggleArtifactView={toggleArtifactView}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          isPanelCollapsed={isPanelCollapsed}
          onTogglePanelCollapse={handleTogglePanelCollapse}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={handleToggleSidebarCollapse}
        />
        <button
          onClick={() => setShowShowcase(true)}
          className="absolute top-2 right-48 z-50 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: '#14B8A6', color: 'white', fontSize: 11 }}
        >
          Component Sheet
        </button>
        <button
          onClick={() => setShowMobileView(true)}
          className="absolute top-2 right-4 z-50 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
          style={{ background: '#14B8A6', color: 'white', fontSize: 11 }}
        >
          <Smartphone className="w-3 h-3" />
          Mobile View
        </button>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeView={activeView} onNavigate={setActiveView} isCollapsed={isSidebarCollapsed} />

          <main className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-gray-950">
            {/* Animated Background with Glow Effects */}
            <AnimatedBackground />
            
            <div className="flex-1 overflow-y-auto relative z-10">
              <div className="max-w-4xl mx-auto px-6 py-12">
                <CanvasHeader />
                <div className="space-y-6">
                  {messages.map((message, index) => {
                    const lastQuestionIndex = [...messages].reverse().findIndex(m => m.type === 'ai' && m.embeddedQuestion);
                    const actualLastQuestionIndex = lastQuestionIndex >= 0 ? messages.length - 1 - lastQuestionIndex : -1;
                    const shouldFade = message.type === 'ai' && message.embeddedQuestion && index < actualLastQuestionIndex;

                    if (message.type === 'ai' && message.embeddedQuestion && index === actualLastQuestionIndex && currentQuestion !== message.embeddedQuestion) {
                      setTimeout(() => setCurrentQuestion(message.embeddedQuestion || null), 0);
                    }

                    return message.type === 'user' ? (
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
                        actions={message.actions}
                        showSomethingElse={message.showSomethingElse}
                        isFaded={shouldFade}
                        embeddedQuestion={message.embeddedQuestion}
                        onAnswer={handleQuestionAnswer}
                        onAddCandidate={message.embeddedQuestion?.type === 'colour-swatch' ? handleAddCandidate : undefined}
                        selectedCandidates={message.embeddedQuestion?.type === 'colour-swatch' ? getActiveCandidates() : undefined}
                        onSomethingElse={() => console.log('User wants to type something else')}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </main>

          {artifactViewMode === 'carousel' ? (
            <ArtifactCarousel ref={artifactCarouselRef} artifacts={artifacts} onReorder={handleReorderArtifacts} isCollapsed={isPanelCollapsed} />
          ) : (
            <ArtifactStack ref={artifactStackRef} artifacts={artifacts} onReorder={handleReorderArtifacts} isCollapsed={isPanelCollapsed} />
          )}
        </div>
      </div>
      )}
    </TooltipProvider>
  );
}