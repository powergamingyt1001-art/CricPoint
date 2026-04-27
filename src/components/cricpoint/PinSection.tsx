'use client';

import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';

export default function PinSection({ matches }: { matches: MatchBasic[] }) {
  const { pinnedMatchId, pinMatch, selectMatch } = useCricPointStore();
  const liveMatches = matches.filter(m => m.isLive);
  const pinnedMatch = pinnedMatchId ? matches.find(m => m.id === pinnedMatchId) : null;
  const displayMatch = pinnedMatch || liveMatches[0];

  if (!displayMatch) {
    return (
      <div className="px-6 py-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No live matches to pin</p>
        </div>
      </div>
    );
  }

  const isInningsStarted = displayMatch.team1Score && displayMatch.team1Score !== '' && displayMatch.team1Score !== '-';
  const isToss = !isInningsStarted && displayMatch.status;

  return (
    <div className="px-6">
      {/* Floating Pill Widget - like the screenshot */}
      <motion.button
        onClick={() => selectMatch(displayMatch.id, displayMatch)}
        className="w-full relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden active:scale-[0.98] transition-transform"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        layout
      >
        {/* Top bar with Toss/Live badge */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
          <div className="flex items-center gap-2">
            {displayMatch.isLive && isInningsStarted ? (
              <span className="flex items-center gap-1 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
            ) : (
              <span className="bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                TOSS
              </span>
            )}
            <span className="text-[9px] text-gray-400 font-medium">{displayMatch.matchType}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-green-500" />
            {pinnedMatchId && (
              <button
                onClick={(e) => { e.stopPropagation(); pinMatch(null); }}
                className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Score / Toss Info */}
        <div className="px-3 pb-2.5">
          <div className="flex items-center justify-between mb-1.5">
            {/* Team 1 */}
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-base">{displayMatch.team1Flag}</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{displayMatch.team1Short}</span>
            </div>
            {/* Score */}
            <div className="text-center px-2">
              {isInningsStarted ? (
                <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                  {displayMatch.team1Score}
                </span>
              ) : (
                <span className="text-xs text-gray-400">0/0 (0)</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Team 2 */}
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-base">{displayMatch.team2Flag}</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{displayMatch.team2Short}</span>
            </div>
            {/* Score */}
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

          {/* Toss / Status line */}
          {isToss && (
            <p className="text-[10px] text-red-500 font-medium mt-1.5 text-center">
              {displayMatch.team1} chose to bat
            </p>
          )}

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

      {/* Pin other matches */}
      {!pinnedMatchId && liveMatches.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {liveMatches.slice(1).map(m => (
            <button
              key={m.id}
              onClick={() => pinMatch(m.id)}
              className="flex-shrink-0 flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 border border-gray-100 dark:border-gray-700 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MapPin className="w-3 h-3 text-green-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{m.team1Short} vs {m.team2Short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
