'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Radio } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';

export default function PinSection({ matches }: { matches: MatchBasic[] }) {
  const { matchPinned, togglePin, selectMatch } = useCricPointStore();
  const liveMatches = matches.filter(m => m.isLive);
  const displayMatch = liveMatches[0];

  if (!displayMatch) {
    return (
      <div className="px-6 py-3">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-center">
          <MapPin className="w-6 h-6 text-gray-300 mx-auto mb-1" />
          <p className="text-xs text-gray-400">No live matches to pin</p>
        </div>
      </div>
    );
  }

  const isInningsStarted = displayMatch.team1Score && displayMatch.team1Score !== '' && displayMatch.team1Score !== '-';

  return (
    <AnimatePresence>
      {matchPinned && (
        <motion.div
          className="sticky top-[56px] z-20 px-4 py-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            onClick={() => selectMatch(displayMatch.id, displayMatch)}
            className="w-full relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-green-500 dark:border-green-400 overflow-hidden active:scale-[0.98] transition-transform"
            layout
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-3 pt-2 pb-1 bg-green-600 dark:bg-green-700">
              <div className="flex items-center gap-2">
                {displayMatch.isLive && isInningsStarted ? (
                  <span className="flex items-center gap-1 text-white text-[9px] font-bold">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="text-white text-[9px] font-bold">TOSS</span>
                )}
                <span className="text-[9px] text-white/70 font-medium">{displayMatch.matchType}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-white" />
                <button
                  onClick={(e) => { e.stopPropagation(); togglePin(); }}
                  className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Score Area */}
            <div className="px-3 py-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-base">{displayMatch.team1Flag}</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{displayMatch.team1Short}</span>
                </div>
                <div className="text-center px-2">
                  {isInningsStarted ? (
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                      {displayMatch.team1Score}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400">0/0 (0)</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-base">{displayMatch.team2Flag}</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{displayMatch.team2Short}</span>
                </div>
                <div className="text-center px-2">
                  {displayMatch.team2Score && displayMatch.team2Score !== '' && displayMatch.team2Score !== '-' ? (
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                      {displayMatch.team2Score}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400">Yet to bat</span>
                  )}
                </div>
              </div>

              {/* Current over balls */}
              {displayMatch.isLive && displayMatch.currentOver && isInningsStarted && (
                <div className="mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex gap-1 justify-center">
                    {displayMatch.currentOver.split(' ').map((ball, i) => {
                      const run = parseInt(ball);
                      let bg = 'bg-gray-200 dark:bg-gray-600';
                      let text = 'text-gray-600 dark:text-gray-400';
                      if (run === 4) { bg = 'bg-yellow-400'; text = 'text-yellow-900'; }
                      else if (run === 6) { bg = 'bg-green-500'; text = 'text-white'; }
                      else if (run === 0) { bg = 'bg-gray-300 dark:bg-gray-500'; text = 'text-gray-600 dark:text-gray-400'; }
                      return (
                        <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${bg} ${text}`}>
                          {ball}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
