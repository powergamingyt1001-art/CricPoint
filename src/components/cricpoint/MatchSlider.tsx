'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Radio, Clock, Trophy, MapPin, Globe } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';

export default function MatchSlider({ matches, onSelectMatch }: { matches: MatchBasic[]; onSelectMatch: (m: MatchBasic) => void }) {
  const { matchPinned, setPin } = useCricPointStore();
  // Only show live and upcoming matches in slider
  const liveMatches = matches.filter(m => m.isLive);
  const upcomingMatches = matches.filter(m => !m.isLive && m.status && m.status.toLowerCase().includes('yet'));
  const sliderMatches = [...liveMatches, ...upcomingMatches];

  if (sliderMatches.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-sm text-gray-400">No live or upcoming matches</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 mb-3">
        <div className="flex items-center gap-2">
          {liveMatches.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          )}
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {liveMatches.length > 0 ? 'Live Matches' : 'Upcoming Matches'}
          </h2>
        </div>
        <span className="text-xs text-gray-400">{sliderMatches.length} matches</span>
      </div>

      {/* Horizontal Slider */}
      <div className="flex gap-3 overflow-x-auto pb-3 px-6 scrollbar-hide snap-x snap-mandatory">
        {sliderMatches.map((match, idx) => (
          <motion.div
            key={match.id}
            className="flex-shrink-0 w-80 snap-start"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Match Score Card - Clickable */}
              <button
                onClick={() => onSelectMatch(match)}
                className="w-full text-left p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all duration-200 active:scale-[0.98]"
              >
                {/* Match type & status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                    {match.matchType} · {match.venue}
                  </span>
                  {match.isLive ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                      <Radio className="w-2.5 h-2.5" />
                      LIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                      <Clock className="w-2.5 h-2.5" />
                      UPCOMING
                    </span>
                  )}
                </div>

                {/* Teams with Score - Scoreboard Style */}
                <div className="space-y-3">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{match.team1Flag}</span>
                      <div>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {match.team1Short}
                        </span>
                        {match.battingTeam === match.team1Short && match.isLive && (
                          <span className="ml-1.5 text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                            BAT
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                      {match.team1Score || '-'}
                    </span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{match.team2Flag}</span>
                      <div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {match.team2Short}
                        </span>
                        {match.battingTeam === match.team2Short && match.isLive && (
                          <span className="ml-1.5 text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                            BAT
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-700 dark:text-gray-300">
                      {match.team2Score || 'Yet to bat'}
                    </span>
                  </div>
                </div>

                {/* Current over balls */}
                {match.isLive && match.currentOver && (
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 mb-1.5 block">This Over</span>
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

                {/* Tap indicator */}
                <div className="mt-2 flex items-center justify-end">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </div>
              </button>

              {/* Bottom Section: Points Table | Country | Pin */}
              <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  {/* Points Table */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectMatch(match); }}
                    className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl flex-1 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">Points Table</span>
                  </button>

                  {/* Country */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectMatch(match); }}
                    className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-xl flex-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                      {match.team1Short} vs {match.team2Short}
                    </span>
                  </button>

                  {/* Pin */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setPin(!matchPinned); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl flex-1 transition-colors ${
                      matchPinned
                        ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/40'
                        : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${matchPinned ? 'text-green-600 fill-green-500' : 'text-green-500'}`} />
                    <span className={`text-[11px] font-semibold ${matchPinned ? 'text-green-700 dark:text-green-300' : 'text-green-700 dark:text-green-400'}`}>
                      {matchPinned ? 'Pinned' : 'Pin'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
