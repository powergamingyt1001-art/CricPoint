'use client';

import { motion } from 'framer-motion';
import { Radio, Clock, Trophy, MapPin, Globe } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';

// 8 matches for slider
const EXTRA_MATCHES: MatchBasic[] = [
  {
    id: "102043", team1: "New Zealand", team2: "Pakistan", team1Short: "NZ", team2Short: "PAK",
    team1Score: "198/5 (35.2)", team2Score: "", status: "LIVE", matchType: "1st Test, Day 2",
    venue: "Wellington", isLive: true, team1Flag: "🇳🇿", team2Flag: "🇵🇰",
    currentOver: "0 1 4 0 2 0", battingTeam: "NZ",
  },
  {
    id: "102044", team1: "West Indies", team2: "Afghanistan", team1Short: "WI", team2Short: "AFG",
    team1Score: "", team2Score: "", status: "Starts in 2 hours", matchType: "3rd T20I",
    venue: "Bridgetown", isLive: false, team1Flag: "🏝️", team2Flag: "🇦🇫",
  },
  {
    id: "102045", team1: "Ireland", team2: "Zimbabwe", team1Short: "IRE", team2Short: "ZIM",
    team1Score: "267/10 (48.3)", team2Score: "189/4 (38)", status: "LIVE", matchType: "2nd ODI",
    venue: "Dublin", isLive: true, team1Flag: "🇮🇪", team2Flag: "🇿🇼",
    currentOver: "1 0 0 4 6 0", battingTeam: "ZIM",
  },
  {
    id: "102046", team1: "Netherlands", team2: "Scotland", team1Short: "NED", team2Short: "SCO",
    team1Score: "", team2Score: "", status: "Tomorrow, 10:00 AM", matchType: "1st T20I",
    venue: "Amsterdam", isLive: false, team1Flag: "🇳🇱", team2Flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  },
  {
    id: "102047", team1: "South Africa", team2: "India", team1Short: "SA", team2Short: "IND",
    team1Score: "312/6 (50)", team2Score: "145/3 (28.4)", status: "LIVE", matchType: "Champions Trophy Final",
    venue: "Johannesburg", isLive: true, team1Flag: "🇿🇦", team2Flag: "🇮🇳",
    currentOver: "4 1 0 6 2 1", battingTeam: "IND",
  },
];

export default function MatchSlider({ matches, onSelectMatch }: { matches: MatchBasic[]; onSelectMatch: (m: MatchBasic) => void }) {
  const { matchPinned, pinnedMatchId, togglePin, showPointTable, setShowPointTable } = useCricPointStore();

  // Combine API matches with extra matches to always have 8
  const allMatches = [...matches, ...EXTRA_MATCHES.filter(em => !matches.find(m => m.id === em.id))];
  const liveMatches = allMatches.filter(m => m.isLive);
  const upcomingMatches = allMatches.filter(m => !m.isLive);
  const sliderMatches = [...liveMatches, ...upcomingMatches].slice(0, 8);

  if (sliderMatches.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-sm text-gray-400">No matches available</p>
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
              LIVE
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
            <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Match Card - Clickable */}
              <button
                onClick={() => onSelectMatch(match)}
                className="w-full text-left p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all active:scale-[0.99]"
              >
                {/* Match type & status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                    {match.matchType} · {match.venue}
                  </span>
                  {match.isLive ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                      <Radio className="w-2.5 h-2.5" />
                      LIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                      <Clock className="w-2.5 h-2.5" />
                      SOON
                    </span>
                  )}
                </div>

                {/* Teams - BIGGER with scores */}
                <div className="space-y-3">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{match.team1Flag}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{match.team1Short}</span>
                        {match.battingTeam === match.team1Short && match.isLive && (
                          <span className="text-[8px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">BAT</span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100">{match.team1Score || '-'}</span>
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
                      <span className="text-2xl">{match.team2Flag}</span>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{match.team2Short}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{match.team2Score || 'Yet to bat'}</span>
                  </div>
                </div>

                {/* This Over */}
                {match.isLive && match.currentOver && (
                  <div className="mt-3 pt-2.5 border-t border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/10 -mx-4 px-4 pb-1">
                    <span className="text-[9px] text-gray-400 mb-1.5 block font-medium">This Over</span>
                    <div className="flex gap-1.5">
                      {match.currentOver.split(' ').map((ball, i) => {
                        const run = parseInt(ball);
                        let bgColor = 'bg-gray-100 dark:bg-gray-700';
                        let textColor = 'text-gray-600 dark:text-gray-400';
                        if (run === 4) { bgColor = 'bg-yellow-400'; textColor = 'text-yellow-900'; }
                        else if (run === 6) { bgColor = 'bg-green-500'; textColor = 'text-white'; }
                        else if (run === 0) { bgColor = 'bg-gray-300 dark:bg-gray-600'; textColor = 'text-gray-700 dark:text-gray-300'; }
                        return (
                          <span key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${bgColor} ${textColor}`}>
                            {ball}
                          </span>
                        );
                      })}
                    </div>
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
