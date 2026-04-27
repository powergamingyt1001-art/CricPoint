'use client';

import { motion } from 'framer-motion';
import { Radio, Clock, Trophy, MapPin, Globe } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';

export default function MatchSlider({ matches, onSelectMatch }: { matches: MatchBasic[]; onSelectMatch: (m: MatchBasic) => void }) {
  const { matchPinned, setPin } = useCricPointStore();
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
      <div className="flex items-center justify-between px-5 mb-2">
        <div className="flex items-center gap-1.5">
          {liveMatches.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          )}
          <h2 className="text-xs font-bold text-gray-800 dark:text-gray-200">
            {liveMatches.length > 0 ? 'Live Matches' : 'Upcoming'}
          </h2>
        </div>
        <span className="text-[10px] text-gray-400">{sliderMatches.length} matches</span>
      </div>

      {/* Horizontal Slider - compact cards */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 px-5 scrollbar-hide snap-x snap-mandatory">
        {sliderMatches.map((match, idx) => (
          <motion.div
            key={match.id}
            className="flex-shrink-0 w-56 snap-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
          >
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Match Card - Clickable */}
              <button
                onClick={() => onSelectMatch(match)}
                className="w-full text-left p-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all active:scale-[0.98]"
              >
                {/* Match type & status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wide truncate max-w-[100px]">
                    {match.matchType}
                  </span>
                  {match.isLive ? (
                    <span className="flex items-center gap-0.5 text-[8px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full">
                      <Radio className="w-2 h-2" />
                      LIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[8px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full">
                      <Clock className="w-2 h-2" />
                      SOON
                    </span>
                  )}
                </div>

                {/* Teams - Compact */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{match.team1Flag}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{match.team1Short}</span>
                        {match.battingTeam === match.team1Short && match.isLive && (
                          <span className="text-[7px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1 py-0.5 rounded">BAT</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-gray-900 dark:text-gray-100">{match.team1Score || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{match.team2Flag}</span>
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{match.team2Short}</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-500">{match.team2Score || 'Yet to bat'}</span>
                  </div>
                </div>

                {/* This Over - Compact, yellow border */}
                {match.isLive && match.currentOver && (
                  <div className="mt-2 pt-1.5 border-t border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/10 -mx-3 px-3 pb-0.5">
                    <span className="text-[8px] text-gray-400 mb-1 block">This Over</span>
                    <div className="flex gap-1">
                      {match.currentOver.split(' ').map((ball, i) => {
                        const run = parseInt(ball);
                        let bgColor = 'bg-gray-100 dark:bg-gray-700';
                        let textColor = 'text-gray-600 dark:text-gray-400';
                        if (run === 4) { bgColor = 'bg-yellow-400'; textColor = 'text-yellow-900'; }
                        else if (run === 6) { bgColor = 'bg-green-500'; textColor = 'text-white'; }
                        else if (run === 0) { bgColor = 'bg-gray-300 dark:bg-gray-600'; textColor = 'text-gray-700 dark:text-gray-300'; }
                        return (
                          <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${bgColor} ${textColor}`}>
                            {ball}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </button>

              {/* Bottom: Points Table | Country | Pin */}
              <div className="border-t border-gray-100 dark:border-gray-700 px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectMatch(match); }}
                    className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg flex-1 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                  >
                    <Trophy className="w-3 h-3 text-amber-500" />
                    <span className="text-[8px] font-semibold text-amber-700 dark:text-amber-400 truncate">Table</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectMatch(match); }}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg flex-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Globe className="w-3 h-3 text-blue-500" />
                    <span className="text-[8px] font-semibold text-blue-700 dark:text-blue-400 truncate">{match.team1Short} vs {match.team2Short}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setPin(!matchPinned); }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg flex-1 transition-colors ${
                      matchPinned ? 'bg-green-100 dark:bg-green-900/30' : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                  >
                    <MapPin className={`w-3 h-3 ${matchPinned ? 'text-green-600 fill-green-500' : 'text-green-500'}`} />
                    <span className={`text-[8px] font-semibold ${matchPinned ? 'text-green-700 dark:text-green-300' : 'text-green-700 dark:text-green-400'}`}>
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
