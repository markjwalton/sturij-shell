import { motion } from 'motion/react';
import { CheckCircle2, Clock, Users, Brain, Zap, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface PipelineStage {
  name: string;
  count: number;
  color: string;
}

interface ArtifactPanelProps {
  pipelineStages: PipelineStage[];
  onOpenFullPipeline?: () => void;
}

export function ArtifactPanel({ pipelineStages, onOpenFullPipeline }: ArtifactPanelProps) {
  return (
    <aside className="w-[380px] border-l border-gray-200 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600" />
            Active Artifact
          </h2>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-medium">
            <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5 animate-pulse"></span>
            LIVE DATA
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Pipeline Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              Pipeline Overview
            </div>
            <Badge variant="outline" className="text-xs">Live</Badge>
          </div>
          <h3 className="font-semibold text-lg mb-6">Today's Snapshot</h3>

          <div className="space-y-3">
            {pipelineStages.map((stage, idx) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 rounded-full ${stage.color} text-white flex items-center justify-center font-semibold shadow-sm group-hover:shadow-md transition-shadow`}
                >
                  {stage.count}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{stage.name}</div>
                  <div className="text-xs text-gray-500">
                    {stage.count} {stage.count === 1 ? 'contact' : 'contacts'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={onOpenFullPipeline}
            className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all"
          >
            Open Full Pipeline
          </Button>
        </motion.div>

        {/* Operations Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-teal-600" />
            Operations Context
          </h3>

          <div className="space-y-4">
            {/* Knowledge Layer */}
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">Knowledge Layer</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  8 entity facts · 16 docs · 83 chunks
                </div>
              </div>
            </div>

            {/* Active Pipeline */}
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">Active Pipeline</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  97 in Engage · 1 in Quote
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">436 Contacts</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  297 suppliers · 176 groups
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Skills Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <span className="font-semibold text-teal-900">AI Learning Active:</span>
              <p className="mt-1">System is observing patterns and building entity relationships.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
