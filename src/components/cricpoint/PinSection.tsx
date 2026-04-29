'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Radio } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';

export default function PinSection({ matches }: { matches: MatchBasic[] }) {
  const { matchPinned, togglePin, selectMatch, pinnedMatchId } = useCricPointStore();
  const pinnedMatch = pinnedMatchId ? matches.find(m => m.id === pinnedMatchId) : null;
  const displayMatch = pinnedMatch || matches.filter(m => m.isLive)[0];

  if (!displayMatch) return null;

  const isInningsStarted = displayMatch.team1Score && displayMatch.team1Score !== '' && displayMatch.team1Score !== '-';

  return (
    <AnimatePresence>
      {matchPinned && (
        <motion.div
          className="sticky top-[58px] z-20 px-5 py-1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={() => selectMatch(displayMatch.id, displayMatch)}
            className="w-full relative bg-white dark:bg-gray-800 rounded-full shadow-md border border-green-500 dark:border-green-400 overflow-hidden active:scale-[0.98] transition-transform"
            layout
          >
            {/* Compact pill layout */}
            <div className="flex items-center justify-between px-3 py-1.5">
              {/* Left: Live badge + Team1 */}
              <div className="flex items-center gap-2">
                {displayMatch.isLive && isInningsStarted ? (
                  <span className="flex items-center gap-0.5 bg-red-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="bg-green-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">TOSS</span>
                )}
                <span className="text-sm">{displayMatch.team1Flag}</span>
                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">{displayMatch.team1Short}</span>
              </div>

              {/* Center: Score */}
              <div className="flex items-center gap-1.5">
                {isInningsStarted && (
                  <span className="text-[11px] font-black text-gray-900 dark:text-gray-100">
                    {displayMatch.team1Score}
                  </span>
                )}
              </div>

              {/* Right: Team2 + Pin */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{displayMatch.team2Short}</span>
                <span className="text-sm">{displayMatch.team2Flag}</span>
                {displayMatch.team2Score && displayMatch.team2Score !== '' && displayMatch.team2Score !== '-' && (
                  <span className="text-[11px] font-black text-gray-700 dark:text-gray-300">
                    {displayMatch.team2Score}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); togglePin(displayMatch.id); }}
                  className="p-0.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
