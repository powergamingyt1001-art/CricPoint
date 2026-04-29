'use client';

import { motion } from 'framer-motion';
import { Volume2, Info, Zap } from 'lucide-react';

interface CommentaryEntry {
  over?: string | number;
  ball?: number;
  text: string;
  highlight?: boolean;
  runs?: number;
  type?: string;
}

interface CommentarySectionProps {
  commentary: { commentary: CommentaryEntry[] } | null;
  loading: boolean;
}

export default function CommentarySection({ commentary, loading }: CommentarySectionProps) {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!commentary || !commentary.commentary || commentary.commentary.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Commentary not available</p>
        <p className="text-[10px] mt-1">Detailed ball-by-ball commentary requires premium API access</p>
      </div>
    );
  }

  const entries = commentary.commentary;

  return (
    <div className="p-4 space-y-1">
      {entries.map((entry, idx) => {
        const isStatus = entry.type === 'status';
        const isInfo = entry.type === 'info';
        const isScore = entry.type === 'score';
        const runs = entry.runs || 0;

        return (
          <motion.div
            key={`${idx}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
          >
            <div className={`flex gap-2 py-2.5 px-3 rounded-lg ${
              isStatus
                ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30'
                : isInfo
                ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30'
                : isScore
                ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}>
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${
                isStatus
                  ? 'bg-green-500 text-white'
                  : isInfo
                  ? 'bg-blue-500 text-white'
                  : isScore
                  ? 'bg-amber-500 text-white'
                  : runs === 4
                  ? 'bg-yellow-400 text-yellow-900'
                  : runs === 6
                  ? 'bg-green-500 text-white'
                  : runs === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {isStatus ? <Zap className="w-3 h-3" /> :
                 isInfo ? <Info className="w-3 h-3" /> :
                 runs}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${
                  isStatus ? 'font-semibold text-green-700 dark:text-green-400' :
                  isInfo ? 'font-medium text-blue-700 dark:text-blue-400' :
                  isScore ? 'font-bold text-amber-700 dark:text-amber-400' :
                  'text-gray-700 dark:text-gray-300'
                }`}>
                  {entry.text}
                </p>
                {entry.over && !isStatus && !isInfo && (
                  <span className="text-[9px] text-gray-400">Over: {entry.over}</span>
                )}
              </div>

              {isStatus && (
                <Volume2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-1" />
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Info note */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <p className="text-[10px] text-gray-400">📡 Live scores updated every 30 seconds</p>
      </div>
    </div>
  );
}
