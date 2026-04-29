'use client';

import { motion } from 'framer-motion';
import { Radio, Clock, Trophy, MapPin, Globe, Zap, Loader2 } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';

export default function MatchSlider({ matches, onSelectMatch }: { matches: MatchBasic[]; onSelectMatch: (m: MatchBasic) => void }) {
  const { matchPinned, pinnedMatchId, togglePin, showPointTable, setShowPointTable } = useCricPointStore();

  const liveMatches = matches.filter(m => m.isLive);
  const completedMatches = matches.filter(m => !m.isLive && m.status && (m.status.toLowerCase().includes('won') || m.status.toLowerCase().includes('lost') || m.status.toLowerCase().includes('draw') || m.status.toLowerCase().includes('tied') || m.status.toLowerCase().includes('abandon') || m.status.toLowerCase().includes('result')));
  const upcomingMatches = matches.filter(m => !m.isLive && !completedMatches.includes(m));
  const sliderMatches = [...liveMatches, ...upcomingMatches, ...completedMatches].slice(0, 8);

  if (sliderMatches.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <Loader2 className="w-6 h-6 text-green-500 animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading live matches...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-1.5">
          {liveMatches.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {liveMatches.length} LIVE
            </span>
          )}
          <h2 className="text-xs font-bold text-gray-800 dark:text-gray-200">
            {liveMatches.length > 0 ? 'Live & Upcoming' : 'Upcoming Matches'}
          </h2>
        </div>
        <span className="text-[10px] text-gray-400">{sliderMatches.length} matches</span>
      </div>

      {/* FULL WIDTH Horizontal Slider - 1 card per screen with snap scroll */}
      <div className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide snap-x snap-mandatory">
        {sliderMatches.map((match, idx) => (
          <motion.div
            key={match.id}
            className="flex-shrink-0 snap-start"
            style={{ width: 'calc(100vw - 32px)' }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
          >
            <div className={`w-full rounded-2xl shadow-sm border overflow-hidden ${
              match.isLive
                ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800/50'
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
            }`}>
              {/* Match Card - Clickable */}
              <button
                onClick={() => onSelectMatch(match)}
                className="w-full text-left p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all active:scale-[0.99]"
              >
                {/* Match type & status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide max-w-[70%] truncate">
                    {match.matchType} · {match.venue}
                  </span>
                  {match.isLive ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full flex-shrink-0">
                      <Radio className="w-2.5 h-2.5" />
                      LIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full flex-shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {completedMatches.includes(match) ? 'END' : 'SOON'}
                    </span>
                  )}
                </div>

                {/* Teams with scores */}
                <div className="space-y-3">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {match.team1Img ? (
                        <img src={match.team1Img} alt={match.team1Short} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-2xl">{match.team1Flag}</span>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{match.team1Short}</span>
                        {match.battingTeam === match.team1Short && match.isLive && (
                          <span className="text-[8px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Zap className="w-2 h-2" />BAT
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                      {match.team1Score || '-'}
                    </span>
                  </div>

                  {/* VS divider */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
                    <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600">VS</span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {match.team2Img ? (
                        <img src={match.team2Img} alt={match.team2Short} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-2xl">{match.team2Flag}</span>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{match.team2Short}</span>
                        {match.battingTeam === match.team2Short && match.isLive && (
                          <span className="text-[8px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Zap className="w-2 h-2" />BAT
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      {match.team2Score || 'Yet to bat'}
                    </span>
                  </div>
                </div>

                {/* Status line for important updates */}
                {match.status && (
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className={`text-[10px] font-semibold truncate ${
                      match.isLive ? 'text-green-600 dark:text-green-400' :
                      match.status.toLowerCase().includes('won') ? 'text-amber-600 dark:text-amber-400' :
                      match.status.toLowerCase().includes('abandon') ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      {match.isLive && <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1" />}
                      {match.status}
                    </p>
                  </div>
                )}
              </button>

              {/* Bottom: Points Table | Country | Pin */}
              <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowPointTable(!showPointTable); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-1 transition-colors ${
                      showPointTable ? 'bg-amber-200 dark:bg-amber-800/40' : 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                    }`}
                  >
                    <Trophy className={`w-3.5 h-3.5 ${showPointTable ? 'text-amber-700' : 'text-amber-500'}`} />
                    <span className={`text-[9px] font-semibold ${showPointTable ? 'text-amber-800 dark:text-amber-200' : 'text-amber-700 dark:text-amber-400'}`}>Table</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectMatch(match); }}
                    className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-900/20 px-3 py-1.5 rounded-xl flex-1 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-[9px] font-semibold text-sky-700 dark:text-sky-400 truncate">{match.team1Short} vs {match.team2Short}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin(match.id); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-1 transition-colors ${
                      matchPinned && pinnedMatchId === match.id ? 'bg-emerald-200 dark:bg-emerald-900/40' : 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${matchPinned && pinnedMatchId === match.id ? 'text-emerald-600 fill-emerald-500' : 'text-emerald-500'}`} />
                    <span className={`text-[9px] font-semibold ${matchPinned && pinnedMatchId === match.id ? 'text-emerald-800 dark:text-emerald-200' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {matchPinned && pinnedMatchId === match.id ? 'Pinned' : 'Pin'}
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
