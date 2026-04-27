'use client';

import { Trophy } from 'lucide-react';

interface PointTableEntry {
  team: string;
  shortName: string;
  flag: string;
  matches: number;
  won: number;
  lost: number;
  noResult: number;
  points: number;
  nrr: string;
}

const MOCK_POINTS_TABLE: PointTableEntry[] = [
  { team: "India", shortName: "IND", flag: "🇮🇳", matches: 8, won: 6, lost: 1, noResult: 1, points: 13, nrr: "+1.245" },
  { team: "Australia", shortName: "AUS", flag: "🇦🇺", matches: 8, won: 5, lost: 2, noResult: 1, points: 11, nrr: "+0.892" },
  { team: "England", shortName: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", matches: 8, won: 5, lost: 3, noResult: 0, points: 10, nrr: "+0.567" },
  { team: "South Africa", shortName: "SA", flag: "🇿🇦", matches: 7, won: 4, lost: 3, noResult: 0, points: 8, nrr: "+0.234" },
  { team: "New Zealand", shortName: "NZ", flag: "🇳🇿", matches: 7, won: 3, lost: 3, noResult: 1, points: 7, nrr: "+0.112" },
  { team: "Pakistan", shortName: "PAK", flag: "🇵🇰", matches: 8, won: 3, lost: 4, noResult: 1, points: 7, nrr: "-0.045" },
  { team: "Sri Lanka", shortName: "SL", flag: "🇱🇰", matches: 7, won: 2, lost: 5, noResult: 0, points: 4, nrr: "-0.678" },
  { team: "Bangladesh", shortName: "BAN", flag: "🇧🇩", matches: 7, won: 1, lost: 6, noResult: 0, points: 2, nrr: "-1.234" },
  { team: "West Indies", shortName: "WI", flag: "🏝️", matches: 7, won: 1, lost: 5, noResult: 1, points: 3, nrr: "-0.890" },
  { team: "Afghanistan", shortName: "AFG", flag: "🇦🇫", matches: 7, won: 0, lost: 7, noResult: 0, points: 0, nrr: "-2.156" },
];

export default function PointTable() {
  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Points Table</h2>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <span>Team</span>
          <span className="text-center">M</span>
          <span className="text-center">W</span>
          <span className="text-center">L</span>
          <span className="text-center">NR</span>
          <span className="text-center">Pts</span>
          <span className="text-center">NRR</span>
        </div>

        {/* Table Body */}
        {MOCK_POINTS_TABLE.map((entry, idx) => (
          <div
            key={entry.shortName}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 px-3 py-2.5 items-center ${
              idx < 4
                ? 'bg-green-50/50 dark:bg-green-900/10 border-l-2 border-green-500'
                : idx === MOCK_POINTS_TABLE.length - 1
                ? 'bg-red-50/30 dark:bg-red-900/5 border-l-2 border-red-300'
                : 'border-l-2 border-transparent'
            } ${idx !== MOCK_POINTS_TABLE.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''}`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{entry.flag}</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{entry.shortName}</span>
            </div>
            <span className="text-xs text-center text-gray-600 dark:text-gray-400">{entry.matches}</span>
            <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">{entry.won}</span>
            <span className="text-xs text-center text-gray-600 dark:text-gray-400">{entry.lost}</span>
            <span className="text-xs text-center text-gray-500 dark:text-gray-500">{entry.noResult}</span>
            <span className="text-xs text-center font-bold text-gray-900 dark:text-gray-100">{entry.points}</span>
            <span className={`text-[10px] text-center font-medium ${entry.nrr.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
              {entry.nrr}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded" />
          <span>Top 4 qualify</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-300 rounded" />
          <span>Eliminated</span>
        </div>
      </div>
    </div>
  );
}
