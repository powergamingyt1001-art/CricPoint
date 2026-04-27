'use client';

import { motion } from 'framer-motion';
import { MapPin, Radio, X, Move } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';
import { useState } from 'react';

export default function PinSection({ matches }: { matches: MatchBasic[] }) {
  const { pinnedMatchId, pinMatch, selectMatch } = useCricPointStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const pinnedMatch = matches.find(m => m.id === pinnedMatchId);
  const liveMatches = matches.filter(m => m.isLive);

  // If no pinned match but there are live matches, show first live match
  const displayMatch = pinnedMatch || liveMatches[0];

  if (!displayMatch) {
    return (
      <div className="px-4 py-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No live matches to pin</p>
          <p className="text-xs text-gray-400 mt-1">Pin a live match to see score here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <motion.div
        className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        layout
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/10">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Pinned Match</span>
          </div>
          <div className="flex items-center gap-2">
            {displayMatch.isLive && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-300">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                LIVE
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <Move className="w-3 h-3 text-white/50" />
            </button>
            {pinnedMatchId && (
              <button
                onClick={() => pinMatch(null)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-3 h-3 text-white/50" />
              </button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div
            className="px-4 py-3 cursor-pointer"
            onClick={() => selectMatch(displayMatch.id, displayMatch)}
          >
            {/* Match type */}
            <p className="text-[10px] text-white/60 mb-2">{displayMatch.matchType} • {displayMatch.venue}</p>

            {/* Teams & Scores */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{displayMatch.team1Flag}</span>
                  <span className="text-sm font-bold text-white">{displayMatch.team1Short}</span>
                  {displayMatch.battingTeam === displayMatch.team1Short && (
                    <span className="text-[8px] font-bold text-green-300 bg-green-900/40 px-1.5 py-0.5 rounded">BAT</span>
                  )}
                </div>
                <span className="text-sm font-bold text-white">{displayMatch.team1Score || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{displayMatch.team2Flag}</span>
                  <span className="text-sm font-bold text-white/80">{displayMatch.team2Short}</span>
                  {displayMatch.battingTeam === displayMatch.team2Short && (
                    <span className="text-[8px] font-bold text-green-300 bg-green-900/40 px-1.5 py-0.5 rounded">BAT</span>
                  )}
                </div>
                <span className="text-sm font-bold text-white/80">{displayMatch.team2Score || '-'}</span>
              </div>
            </div>

            {/* Current over */}
            {displayMatch.isLive && displayMatch.currentOver && (
              <div className="mt-3 pt-2 border-t border-white/10">
                <span className="text-[10px] text-white/50 mb-1 block">This Over</span>
                <div className="flex gap-1.5">
                  {displayMatch.currentOver.split(' ').map((ball, i) => {
                    const run = parseInt(ball);
                    let bg = 'bg-white/20';
                    let text = 'text-white';
                    if (run === 4) { bg = 'bg-yellow-400'; text = 'text-yellow-900'; }
                    else if (run === 6) { bg = 'bg-green-400'; text = 'text-green-900'; }
                    else if (run === 0) { bg = 'bg-white/10'; text = 'text-white/50'; }

                    return (
                      <span
                        key={i}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${bg} ${text}`}
                      >
                        {ball}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status */}
            {!displayMatch.isLive && (
              <p className="mt-2 text-[11px] text-yellow-300 font-medium">{displayMatch.status}</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Pin suggestion for other live matches */}
      {!pinnedMatchId && liveMatches.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {liveMatches.slice(1).map(m => (
            <button
              key={m.id}
              onClick={() => pinMatch(m.id)}
              className="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 border border-gray-100 dark:border-gray-700 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
