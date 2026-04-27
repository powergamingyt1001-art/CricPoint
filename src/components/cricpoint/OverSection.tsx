'use client';

import { motion } from 'framer-motion';

interface OverBall {
  run: number;
  type: string;
}

interface OverData {
  over: number;
  balls: OverBall[];
}

interface OverSectionProps {
  overs: { overs: OverData[] } | null;
  loading: boolean;
}

function getBallStyle(type: string, run: number) {
  if (type === 'wicket') return 'bg-red-500 text-white';
  if (type === 'six' || run === 6) return 'bg-green-500 text-white';
  if (type === 'four' || run === 4) return 'bg-yellow-400 text-yellow-900';
  if (run === 0) return 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300';
  return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
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

  if (!overs || !overs.overs) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Over data not available</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-[9px] text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span>4</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>6</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>W</span>
        </div>
      </div>

      {overs.overs.map((overData, idx) => {
        const totalRuns = overData.balls.reduce((sum, b) => sum + b.run, 0);
        const hasWicket = overData.balls.some(b => b.type === 'wicket');
        const hasBoundary = overData.balls.some(b => b.type === 'four' || b.type === 'six' || b.run === 4 || b.run === 6);

        return (
          <motion.div
            key={overData.over}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              {/* Over number */}
              <div className="flex-shrink-0 w-10 text-center">
                <span className="text-[10px] text-gray-400">Over</span>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{overData.over}</p>
              </div>

              {/* Balls */}
              <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {overData.balls.map((ball, i) => (
                  <span
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${getBallStyle(ball.type, ball.run)}`}
                  >
                    {ball.type === 'wicket' ? 'W' : ball.run}
                  </span>
                ))}
              </div>

              {/* Runs in over */}
              <div className="flex-shrink-0 text-right">
                <p className={`text-sm font-bold ${
                  hasWicket ? 'text-red-500' : hasBoundary ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {totalRuns}
                </p>
                <p className="text-[9px] text-gray-400">runs</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
