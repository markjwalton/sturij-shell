import { Download, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function FloorPlanArtifact() {
  return (
    <div className="space-y-4">
      {/* Room Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Room Type</div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Bedroom</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Wall Width</div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">2400mm</div>
        </div>
      </div>

      {/* Wall Dimensions - Collapsible Accordions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Wall Dimensions</div>
        <Accordion type="single" collapsible className="w-full">
          {/* Wall A */}
          <AccordionItem value="wall-a" className="border-gray-300 dark:border-gray-600">
            <AccordionTrigger className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2 hover:no-underline">
              Wall A
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-sm text-gray-900 dark:text-gray-100 pb-2">3000mm</div>
            </AccordionContent>
          </AccordionItem>

          {/* Wall B */}
          <AccordionItem value="wall-b" className="border-gray-300 dark:border-gray-600">
            <AccordionTrigger className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2 hover:no-underline">
              Wall B
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-900 dark:text-gray-100">1000mm</div>
                <div className="pl-3 border-l-2 border-teal-500 space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Window B:</div>
                  <div className="text-xs text-gray-900 dark:text-gray-100 space-y-0.5">
                    <div>H: 1000mm</div>
                    <div>W: 1000mm</div>
                    <div>FF: 900mm</div>
                  </div>
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100">1000mm</div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Wall C */}
          <AccordionItem value="wall-c" className="border-gray-300 dark:border-gray-600">
            <AccordionTrigger className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2 hover:no-underline">
              Wall C
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-900 dark:text-gray-100">1000mm</div>
                <div className="pl-3 border-l-2 border-teal-500 space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Door C:</div>
                  <div className="text-xs text-gray-900 dark:text-gray-100 space-y-0.5">
                    <div>W: 800mm</div>
                    <div>H: 2040mm</div>
                    <div>H: Left</div>
                    <div>O: In</div>
                  </div>
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100">1200mm</div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Wall D */}
          <AccordionItem value="wall-d" className="border-gray-300 dark:border-gray-600 border-b-0">
            <AccordionTrigger className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2 hover:no-underline">
              Wall D
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-sm text-gray-900 dark:text-gray-100 pb-2">3000mm</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Floor Plan Visualization - Just the grid, no wood textures or units */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative aspect-[4/3] bg-white dark:bg-gray-950 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-inner">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(156 163 175) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(156 163 175) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Dimension Line */}
          <div className="absolute left-10 bottom-2 right-8 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <div className="h-px flex-1 bg-gray-400 dark:bg-gray-500" />
              <span className="text-[10px] font-mono font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950 px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600">
                2400mm
              </span>
              <div className="h-px flex-1 bg-gray-400 dark:bg-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          className="flex-1 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white"
          onClick={() => console.log('Download floor plan')}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Floorplan
        </Button>
        <Button 
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => console.log('Send to chat')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Send to Chat
        </Button>
      </div>
    </div>
  );
}
