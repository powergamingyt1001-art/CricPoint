'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, Radio } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';
import MatchSlider from './MatchSlider';
import PinSection from './PinSection';
import PointTable from './PointTable';
import AIChat from './AIChat';
import BottomNav from './BottomNav';

const FALLBACK_MATCHES: MatchBasic[] = [
  {
    id: "102040",
    team1: "India",
    team2: "Australia",
    team1Short: "IND",
    team2Short: "AUS",
    team1Score: "287/4 (42.3)",
    team2Score: "",
    status: "LIVE",
    matchType: "3rd ODI",
    venue: "Mumbai",
    isLive: true,
    team1Flag: "🇮🇳",
    team2Flag: "🇦🇺",
    currentOver: "1 0 4 0 6 1",
    battingTeam: "IND",
  },
];

export default function Dashboard() {
  const { activeTab, selectMatch } = useCricPointStore();
  const [matches, setMatches] = useState<MatchBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const initialFetchDone = useRef(false);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/cricket/matches');
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      setMatches(FALLBACK_MATCHES);
    }
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    let cancelled = false;
    const load = async () => {
      await fetchMatches();
      if (!cancelled) setLoading(false);
    };
    load();

    const interval = setInterval(fetchMatches, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [fetchMatches]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xs">CP</span>
            </div>
            <div>
              <h1 className="text-base font-black text-gray-800 dark:text-gray-200">
                Cric<span className="text-green-600 dark:text-green-400">Point</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {matches.filter(m => m.isLive).length > 0 && (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                <Radio className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-bold text-red-500">
                  {matches.filter(m => m.isLive).length} LIVE
                </span>
              </div>
            )}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'home' && (
        <div className="space-y-6 pt-4">
          <MatchSlider matches={matches} onSelectMatch={selectMatch} />
          <PinSection matches={matches} />

          {matches.filter(m => !m.isLive).length > 0 && (
            <div className="px-4">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Recent Results</h2>
              <div className="space-y-2">
                {matches.filter(m => !m.isLive).map((match) => (
                  <button
                    key={match.id}
                    onClick={() => selectMatch(match.id, match)}
                    className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{match.team1Flag}</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{match.team1Short}</span>
                        <span className="text-[10px] text-gray-400">vs</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{match.team2Short}</span>
                        <span className="text-xs">{match.team2Flag}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 max-w-[120px] truncate">{match.status}</span>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1">{match.matchType} • {match.venue}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="px-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pin' && <PinSection matches={matches} />}
      {activeTab === 'point-table' && <PointTable />}
      {activeTab === 'ai-chat' && <AIChat />}

      <BottomNav />
    </div>
  );
}
