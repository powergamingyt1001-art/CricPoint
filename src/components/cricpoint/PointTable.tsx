'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trophy, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface PointTableEntry {
  rank: number;
  team: string;
  shortName: string;
  img?: string;
  matches: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  nrr: string;
}

export default function PointTable() {
  const [tableData, setTableData] = useState<PointTableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState('');

  const fetchPointsTable = useCallback(async () => {
    try {
      const res = await fetch('/api/cricket/points-table');
      const data = await res.json();
      if (data.points && data.points.length > 0) {
        setTableData(data.points);
        setSource(data.source || 'unknown');
      }
    } catch (error) {
      console.error('Failed to fetch points table:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPointsTable();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPointsTable, 300000);
    return () => clearInterval(interval);
  }, [fetchPointsTable]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPointsTable();
  };

  if (loading) {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">IPL 2026 Points Table</h2>
          <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">IPL 2026 Points Table</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center">
          <p className="text-xs text-gray-400">Points table not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">IPL 2026 Points Table</h2>
          {source === 'cricapi' && (
            <span className="text-[7px] font-bold text-green-400 bg-green-900/40 px-1.5 py-0.5 rounded-full">LIVE</span>
          )}
        </div>
        <button onClick={handleRefresh} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[28px_2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 px-3 py-2 bg-gradient-to-r from-[#0a1628] to-[#132244] text-[8px] font-bold text-white/80 uppercase tracking-wider">
          <span className="text-center">#</span>
          <span>Team</span>
          <span className="text-center">M</span>
          <span className="text-center">W</span>
          <span className="text-center">L</span>
          <span className="text-center">T</span>
          <span className="text-center">NR</span>
          <span className="text-center">Pts</span>
        </div>

        {/* Table Body */}
        {tableData.map((entry, idx) => (
          <div
            key={entry.shortName}
            className={`grid grid-cols-[28px_2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 px-3 py-2.5 items-center transition-colors ${
              idx < 4
                ? 'bg-green-50/50 dark:bg-green-900/10 border-l-2 border-green-500'
                : idx === tableData.length - 1
                ? 'bg-red-50/30 dark:bg-red-900/5 border-l-2 border-red-300'
                : 'border-l-2 border-transparent'
            } ${idx !== tableData.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''}`}
          >
            <span className="text-[10px] text-center font-bold text-gray-400">{entry.rank}</span>
            <div className="flex items-center gap-1.5">
              {entry.img ? (
                <Image src={entry.img} alt={entry.shortName} width={20} height={20} className="object-contain" unoptimized />
              ) : (
                <span className="text-sm">🏏</span>
              )}
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{entry.shortName}</span>
            </div>
            <span className="text-xs text-center text-gray-600 dark:text-gray-400">{entry.matches}</span>
            <span className="text-xs text-center font-medium text-green-600 dark:text-green-400">{entry.won}</span>
            <span className="text-xs text-center text-red-500 dark:text-red-400">{entry.lost}</span>
            <span className="text-xs text-center text-gray-500 dark:text-gray-500">{entry.tied}</span>
            <span className="text-xs text-center text-gray-500 dark:text-gray-500">{entry.noResult}</span>
            <span className="text-xs text-center font-black text-gray-900 dark:text-gray-100 bg-green-50 dark:bg-green-900/20 rounded px-1">{entry.points}</span>
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
