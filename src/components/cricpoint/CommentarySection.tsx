'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface CommentaryEntry {
  over: number;
  ball: number;
  text: string;
  highlight?: boolean;
  runs: number;
}

interface CommentarySectionProps {
  commentary: { commentary: CommentaryEntry[] } | null;
  loading: boolean;
}

function groupByOvers(entries: CommentaryEntry[]) {
  const groups: { over: number; showHeader: boolean; entries: CommentaryEntry[] }[] = [];
  let currentOver = -1;

  for (const entry of entries) {
    const showHeader = entry.over !== currentOver;
    if (showHeader) {
      currentOver = entry.over;
      groups.push({ over: entry.over, showHeader: true, entries: [entry] });
    } else {
      groups[groups.length - 1].entries.push(entry);
    }
  }

  return groups;
}

export default function CommentarySection({ commentary, loading }: CommentarySectionProps) {
  const grouped = useMemo(
    () => (commentary?.commentary ? groupByOvers(commentary.commentary) : []),
    [commentary]
  );

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!commentary || !commentary.commentary) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Commentary not available</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-1">
      {grouped.map((group, gIdx) => (
        <div key={gIdx}>
          {/* Over separator */}
          <div className="flex items-center gap-2 py-2 mt-2">
            <div className="w-8 h-5 bg-green-600 rounded-md flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">Ov {group.over}</span>
            </div>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
          </div>

          {/* Entries in this over */}
          {group.entries.map((entry, idx) => (
            <motion.div
              key={`${gIdx}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02, duration: 0.2 }}
            >
              <div className={`flex gap-2 py-2 px-2 rounded-lg ${
                entry.highlight
                  ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-2 border-yellow-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${
                  entry.runs === 4
                    ? 'bg-yellow-400 text-yellow-900'
                    : entry.runs === 6
                    ? 'bg-green-500 text-white'
                    : entry.runs === 0
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {entry.runs}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {entry.highlight ? (
                      <span className="font-semibold">{entry.text}</span>
                    ) : (
                      entry.text
                    )}
                  </p>
                  <span className="text-[9px] text-gray-400">{entry.over}.{entry.ball}</span>
                </div>

                {entry.highlight && (
                  <Volume2 className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
