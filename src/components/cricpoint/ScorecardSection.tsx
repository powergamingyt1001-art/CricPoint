'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sword, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BattingEntry {
  name: string;
  nameShort: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal: string;
}

interface BowlingEntry {
  name: string;
  nameShort: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface InningData {
  id: number;
  team: string;
  teamShort: string;
  flag: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: string;
  extras: string;
  batting: BattingEntry[];
  bowling: BowlingEntry[];
}

interface ScorecardSectionProps {
  scorecard: { innings: InningData[] } | null;
  loading: boolean;
  matchData?: { team1Flag?: string; team2Flag?: string; team1?: string; team2?: string } | null;
}

export default function ScorecardSection({ scorecard, loading, matchData }: ScorecardSectionProps) {
  const [expandedInnings, setExpandedInnings] = useState<number[]>([]);

  const toggleInning = (id: number) => {
    setExpandedInnings(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!scorecard || !scorecard.innings) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Scorecard not available</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Team tabs at top - Cricbuzz style */}
      <div className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {scorecard.innings.map((inning, idx) => {
          const isExpanded = expandedInnings.includes(inning.id);
          return (
            <button
              key={inning.id}
              onClick={() => {
                if (!isExpanded && inning.batting && inning.batting.length > 0) {
                  toggleInning(inning.id);
                } else if (isExpanded) {
                  toggleInning(inning.id);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all ${
                isExpanded
                  ? 'bg-green-50 dark:bg-green-900/20 border-b-2 border-green-600'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${idx === 0 ? 'border-r border-gray-100 dark:border-gray-700' : ''}`}
            >
              <span className="text-lg">{inning.flag}</span>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{inning.teamShort}</p>
                {inning.totalRuns > 0 && (
                  <p className="text-[10px] font-bold text-green-600">{inning.totalRuns}/{inning.totalWickets}</p>
                )}
              </div>
              {inning.batting && inning.batting.length > 0 && (
                isExpanded ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Innings Details */}
      {scorecard.innings.map((inning) => {
        const isExpanded = expandedInnings.includes(inning.id);
        const hasData = inning.batting && inning.batting.length > 0;

        return (
          <AnimatePresence key={inning.id}>
            {isExpanded && hasData && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Team header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 mb-3 border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{inning.flag}</span>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{inning.team}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-green-600 dark:text-green-400">
                        {inning.totalRuns}/{inning.totalWickets}
                      </span>
                      <p className="text-[10px] text-gray-400">({inning.totalOvers} ov)</p>
                    </div>
                  </div>
                </div>

                {/* Batting Table - Bigger */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-3">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <Sword className="w-3 h-3 text-green-600" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Batting</span>
                  </div>

                  <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_36px_36px_36px_36px_48px] gap-1 px-4 py-2 text-[9px] font-bold text-gray-400 uppercase">
                      <span>Batter</span>
                      <span className="text-center">R</span>
                      <span className="text-center">B</span>
                      <span className="text-center">4s</span>
                      <span className="text-center">6s</span>
                      <span className="text-center">SR</span>
                    </div>

                    {inning.batting.map((batter, idx) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-[1fr_36px_36px_36px_36px_48px] gap-1 py-3 px-4 ${
                          idx % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-700/20' : ''
                        }`}
                      >
                        <div>
                          <p className={`text-xs font-semibold text-gray-800 dark:text-gray-200 ${
                            batter.dismissal === 'not out' ? 'text-green-600 dark:text-green-400' : ''
                          }`}>
                            {batter.nameShort}
                          </p>
                          <p className="text-[9px] text-gray-400 truncate">{batter.dismissal}</p>
                        </div>
                        <span className="text-center text-sm font-bold text-gray-900 dark:text-gray-100 self-center">{batter.runs}</span>
                        <span className="text-center text-xs text-gray-500 self-center">{batter.balls}</span>
                        <span className="text-center text-xs text-gray-500 self-center">{batter.fours}</span>
                        <span className="text-center text-xs text-gray-500 self-center">{batter.sixes}</span>
                        <span className="text-center text-xs text-gray-500 self-center">{batter.strikeRate}</span>
                      </div>
                    ))}
                  </div>

                  {/* Extras */}
                  <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                    <span className="text-xs text-gray-500">Extras: </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{inning.extras}</span>
                  </div>
                </div>

                {/* Bowling Table - Bigger */}
                {inning.bowling && inning.bowling.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                      <Zap className="w-3 h-3 text-orange-500" />
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bowling</span>
                    </div>

                    <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                      <div className="grid grid-cols-[1fr_36px_28px_36px_28px_40px] gap-1 px-4 py-2 text-[9px] font-bold text-gray-400 uppercase">
                        <span>Bowler</span>
                        <span className="text-center">O</span>
                        <span className="text-center">M</span>
                        <span className="text-center">R</span>
                        <span className="text-center">W</span>
                        <span className="text-center">Econ</span>
                      </div>

                      {inning.bowling.map((bowler, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-[1fr_36px_28px_36px_28px_40px] gap-1 py-3 px-4 ${
                            idx % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-700/20' : ''
                          }`}
                        >
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 self-center">{bowler.nameShort}</span>
                          <span className="text-center text-xs text-gray-500 self-center">{bowler.overs}</span>
                          <span className="text-center text-xs text-gray-500 self-center">{bowler.maidens}</span>
                          <span className="text-center text-xs text-gray-500 self-center">{bowler.runs}</span>
                          <span className="text-center text-sm font-bold text-gray-900 dark:text-gray-100 self-center">{bowler.wickets}</span>
                          <span className="text-center text-xs text-gray-500 self-center">{bowler.economy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}

      {/* Not expanded yet hint */}
      {expandedInnings.length === 0 && (
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">Tap a team tab above to see scorecard</p>
        </div>
      )}
    </div>
  );
}
