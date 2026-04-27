'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Radio } from 'lucide-react';
import type { MatchBasic } from '@/store/cricpoint-store';

export default function MatchSlider({ matches, onSelectMatch }: { matches: MatchBasic[]; onSelectMatch: (m: MatchBasic) => void }) {
  const liveMatches = matches.filter(m => m.isLive);
  const otherMatches = matches.filter(m => !m.isLive);
  const allMatches = [...liveMatches, ...otherMatches];

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          {liveMatches.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          )}
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Matches</h2>
        </div>
        <span className="text-xs text-gray-400">{allMatches.length} matches</span>
      </div>

      {/* Horizontal Slider */}
      <div className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide snap-x snap-mandatory">
        {allMatches.map((match, idx) => (
          <motion.div
            key={match.id}
            className="flex-shrink-0 w-72 snap-start"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <button
              onClick={() => onSelectMatch(match)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              {/* Match type & status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  {match.matchType}
                </span>
                {match.isLive ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                    <Radio className="w-2.5 h-2.5" />
                    LIVE
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {match.status.length > 25 ? match.status.substring(0, 25) + '...' : match.status}
                  </span>
                )}
              </div>

              {/* Teams */}
              <div className="space-y-2">
                {/* Team 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.team1Flag}</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {match.team1Short}
                    </span>
                    {match.battingTeam === match.team1Short && match.isLive && (
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                        BAT
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {match.team1Score || '-'}
                  </span>
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.team2Flag}</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {match.team2Short}
                    </span>
                    {match.battingTeam === match.team2Short && match.isLive && (
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                        BAT
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {match.team2Score || '-'}
                  </span>
                </div>
              </div>

              {/* Current over balls (if live) */}
              {match.isLive && match.currentOver && (
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400 mb-1 block">This Over</span>
                  <div className="flex gap-1.5">
                    {match.currentOver.split(' ').map((ball, i) => {
                      const run = parseInt(ball);
                      let bgColor = 'bg-gray-100 dark:bg-gray-700';
                      let textColor = 'text-gray-600 dark:text-gray-400';
                      if (run === 4) { bgColor = 'bg-yellow-400'; textColor = 'text-yellow-900'; }
                      else if (run === 6) { bgColor = 'bg-green-500'; textColor = 'text-white'; }
                      else if (run === 0) { bgColor = 'bg-gray-300 dark:bg-gray-600'; textColor = 'text-gray-700 dark:text-gray-300'; }

                      return (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${bgColor} ${textColor}`}
                        >
                          {ball}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tap to view */}
              <div className="mt-2 flex items-center justify-end">
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
