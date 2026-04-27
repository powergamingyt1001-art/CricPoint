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
}

export default function ScorecardSection({ scorecard, loading }: ScorecardSectionProps) {
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
          <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
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
    <div className="p-4 space-y-3">
      {scorecard.innings.map((inning) => {
        const isExpanded = expandedInnings.includes(inning.id);
        const hasData = inning.batting && inning.batting.length > 0;

        return (
          <div
            key={inning.id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Team Header - Clickable to expand */}
            <button
              onClick={() => hasData && toggleInning(inning.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{inning.flag}</span>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{inning.team}</span>
                  {inning.totalRuns > 0 && (
                    <span className="ml-2 text-sm font-black text-green-600 dark:text-green-400">
                      {inning.totalRuns}/{inning.totalWickets}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {inning.totalRuns > 0 && (
                  <span className="text-xs text-gray-400">({inning.totalOvers} ov)</span>
                )}
                {hasData && (
                  isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )
                )}
              </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && hasData && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Batting Table */}
                  <div className="px-4 pb-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sword className="w-3 h-3 text-green-600" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Batting</span>
                    </div>

                    <div className="space-y-0">
                      {/* Header */}
                      <div className="grid grid-cols-[1fr_32px_32px_32px_32px_44px] gap-1 text-[9px] font-bold text-gray-400 uppercase px-1 pb-1">
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
                          className={`grid grid-cols-[1fr_32px_32px_32px_32px_44px] gap-1 py-1.5 px-1 text-xs ${
                            idx % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-700/20' : ''
                          } rounded`}
                        >
                          <div>
                            <p className={`font-semibold text-gray-800 dark:text-gray-200 text-[11px] ${
                              batter.dismissal === 'not out' ? 'text-green-600 dark:text-green-400' : ''
                            }`}>
                              {batter.nameShort}
                            </p>
                            <p className="text-[9px] text-gray-400 truncate">{batter.dismissal}</p>
                          </div>
                          <span className="text-center font-bold text-gray-900 dark:text-gray-100">{batter.runs}</span>
                          <span className="text-center text-gray-500">{batter.balls}</span>
                          <span className="text-center text-gray-500">{batter.fours}</span>
                          <span className="text-center text-gray-500">{batter.sixes}</span>
                          <span className="text-center text-gray-500">{batter.strikeRate}</span>
                        </div>
                      ))}
                    </div>

                    {/* Extras */}
                    <div className="mt-2 text-[11px] text-gray-500 px-1">
                      Extras: <span className="font-medium text-gray-700 dark:text-gray-300">{inning.extras}</span>
                    </div>
                  </div>

                  {/* Bowling Table */}
                  {inning.bowling && inning.bowling.length > 0 && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-50 dark:border-gray-700/50">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Zap className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bowling</span>
                      </div>

                      <div className="space-y-0">
                        <div className="grid grid-cols-[1fr_32px_28px_32px_28px_36px] gap-1 text-[9px] font-bold text-gray-400 uppercase px-1 pb-1">
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
                            className={`grid grid-cols-[1fr_32px_28px_32px_28px_36px] gap-1 py-1.5 px-1 text-xs ${
                              idx % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-700/20' : ''
                            } rounded`}
                          >
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11px]">{bowler.nameShort}</span>
                            <span className="text-center text-gray-500">{bowler.overs}</span>
                            <span className="text-center text-gray-500">{bowler.maidens}</span>
                            <span className="text-center text-gray-500">{bowler.runs}</span>
                            <span className="text-center font-bold text-gray-900 dark:text-gray-100">{bowler.wickets}</span>
                            <span className="text-center text-gray-500">{bowler.economy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* If no data */}
            {!hasData && inning.totalRuns === 0 && (
              <div className="px-4 pb-3">
                <p className="text-xs text-gray-400 text-center">Yet to bat</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
