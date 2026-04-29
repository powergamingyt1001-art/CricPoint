'use client';

import { motion } from 'framer-motion';
import { Trophy, Swords } from 'lucide-react';

interface OverData {
  overNum?: number;
  over?: number;
  runs: number;
  wickets?: number;
  summary?: string;
  balls?: Array<{ run: number; type: string }>;
}

interface OverSectionProps {
  overs: { overs: OverData[] } | null;
  loading: boolean;
}

export default function OverSection({ overs, loading }: OverSectionProps) {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!overs || !overs.overs || overs.overs.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Over data not available</p>
        <p className="text-[10px] mt-1">Detailed over-by-over data requires premium API access</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {overs.overs.map((overData, idx) => {
        const overNum = overData.overNum || overData.over || idx + 1;
        const hasBalls = overData.balls && overData.balls.length > 0;

        return (
          <motion.div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 overflow-hidden"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              {/* Inning/Over indicator */}
              <div className="flex-shrink-0 w-12 text-center">
                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                  (overData.wickets || 0) > 0
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : 'bg-green-100 dark:bg-green-900/20'
                }`}>
                  {(overData.wickets || 0) > 0 ? (
                    <Swords className="w-4 h-4 text-red-500" />
                  ) : (
                    <Trophy className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="flex-1 min-w-0">
                {overData.summary ? (
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {overData.summary}
                  </p>
                ) : hasBalls ? (
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                    {overData.balls!.map((ball, i) => {
                      const style = ball.type === 'wicket'
                        ? 'bg-red-500 text-white'
                        : ball.run === 6 || ball.type === 'six'
                        ? 'bg-green-500 text-white'
                        : ball.run === 4 || ball.type === 'four'
                        ? 'bg-yellow-400 text-yellow-900'
                        : ball.run === 0
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';

                      return (
                        <span
                          key={i}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${style}`}
                        >
                          {ball.type === 'wicket' ? 'W' : ball.run}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    {overData.runs}/{overData.wickets || 0}
                  </p>
                )}
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                <p className={`text-sm font-bold ${
                  (overData.wickets || 0) > 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'
                }`}>
                  {overData.runs}
                </p>
                {(overData.wickets || 0) > 0 && (
                  <p className="text-[9px] text-red-400">{overData.wickets} wkt</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Info note */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <p className="text-[10px] text-gray-400">📡 Match scores update automatically every 30 seconds</p>
      </div>
    </div>
  );
}
