import { MobileAppShell } from './components/MobileAppShell';
import { NestingToolArtifact, mockSheets } from './components/NestingToolArtifact';
import { Home, Briefcase, Package, Layers, Download, Share, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function MobileNestingTool() {
  const [isLandscape, setIsLandscape] = useState(true);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [artifactScale, setArtifactScale] = useState(100);

  const handlePrevSheet = () => {
    if (currentSheetIndex > 0) {
      setCurrentSheetIndex(currentSheetIndex - 1);
    }
  };

  const handleNextSheet = () => {
    if (currentSheetIndex < mockSheets.length - 1) {
      setCurrentSheetIndex(currentSheetIndex + 1);
    }
  };

  const navigationItems = [
    {
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      onClick: () => console.log('Navigate to Home'),
    },
    {
      label: 'Jobs',
      icon: <Briefcase className="w-5 h-5" />,
      onClick: () => console.log('Navigate to Jobs'),
    },
    {
      label: 'Materials',
      icon: <Package className="w-5 h-5" />,
      onClick: () => console.log('Navigate to Materials'),
    },
    {
      label: 'Nesting Tool',
      icon: <Layers className="w-5 h-5" />,
      onClick: () => console.log('Navigate to Nesting Tool'),
    },
  ];

  const actionItems = [
    {
      label: 'Export Sheet Data',
      icon: <Download className="w-5 h-5" />,
      onClick: () => console.log('Export data'),
    },
    {
      label: 'Optimize Layout',
      icon: <RefreshCw className="w-5 h-5" />,
      onClick: () => console.log('Optimize'),
    },
    {
      label: 'Share Job',
      icon: <Share className="w-5 h-5" />,
      onClick: () => console.log('Share'),
    },
  ];

  const artifactInfo = {
    title: 'Nesting Tool',
    dimensions: isLandscape ? '3070 × 2800 mm' : '2800 × 3070 mm',
    stats: [
      { label: 'Total Sheets', value: '6' },
      { label: 'Panels Cut', value: '42' },
      { label: 'Material Used', value: '87%' },
      { label: 'Offcuts', value: '8' },
    ],
  };

  const currentSheetData = mockSheets[currentSheetIndex];

  return (
    <MobileAppShell 
      title="Sturij Intelligence"
      navigationItems={navigationItems}
      actionItems={actionItems}
      isLandscape={isLandscape}
      onToggleOrientation={setIsLandscape}
      artifactInfo={artifactInfo}
      currentSheetIndex={currentSheetIndex}
      totalSheets={mockSheets.length}
      currentSheetData={currentSheetData}
      onPrevSheet={handlePrevSheet}
      onNextSheet={handleNextSheet}
      artifactScale={artifactScale}
    >
      <NestingToolArtifact isLandscape={isLandscape} currentSheetIndex={currentSheetIndex} onPrevSheet={handlePrevSheet} onNextSheet={handleNextSheet} onScaleChange={(s) => setArtifactScale(Math.round(s * 100))} />
    </MobileAppShell>
  );
}