'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Info, BarChart3, Clock, Mic, MapPin } from 'lucide-react';
import { useCricPointStore, type MatchTab } from '@/store/cricpoint-store';
import InfoSection from './InfoSection';
import ScorecardSection from './ScorecardSection';
import OverSection from './OverSection';
import CommentarySection from './CommentarySection';

const matchTabs: { id: MatchTab; label: string; icon: React.ReactNode }[] = [
  { id: 'info', label: 'Info', icon: <Info className="w-3.5 h-3.5" /> },
  { id: 'scorecard', label: 'Points', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'overs', label: 'Overs', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'commentary', label: 'Commentary', icon: <Mic className="w-3.5 h-3.5" /> },
];

export default function MatchDetail() {
  const { selectedMatchData, goBack } = useCricPointStore();
  const [activeTab, setActiveTab] = useState<MatchTab>('info');
  const [matchInfo, setMatchInfo] = useState<Record<string, unknown> | null>(null);
  const [scorecard, setScorecard] = useState<Record<string, unknown> | null>(null);
  const [overs, setOvers] = useState<Record<string, unknown> | null>(null);
  const [commentary, setCommentary] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchDoneRef = useRef<string | null>(null);

  const match = selectedMatchData;

  const fetchMatchData = useCallback(async (matchId: string) => {
    const [info, sc, ov, comm] = await Promise.all([
      fetch(`/api/cricket/match-info?matchid=${matchId}`).then(r => r.json()).catch(() => null),
      fetch(`/api/cricket/match-scorecard?matchid=${matchId}`).then(r => r.json()).catch(() => null),
      fetch(`/api/cricket/match-overs?matchid=${matchId}`).then(r => r.json()).catch(() => null),
      fetch(`/api/cricket/match-commentary?matchid=${matchId}`).then(r => r.json()).catch(() => null),
    ]);
    return { info, sc, ov, comm };
  }, []);

  useEffect(() => {
    if (!match) return;
    if (fetchDoneRef.current === match.id) return;
    fetchDoneRef.current = match.id;

    let cancelled = false;
    const load = async () => {
      const data = await fetchMatchData(match.id);
      if (!cancelled) {
        setMatchInfo(data.info);
        setScorecard(data.sc);
        setOvers(data.ov);
        setCommentary(data.comm);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [match, fetchMatchData]);

  if (!match) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-green-900 text-white px-4 pt-3 pb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-white/70 hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Back</span>
        </button>

        <p className="text-[10px] text-white/50 uppercase tracking-wider mb-2">{match.matchType}</p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <span className="text-3xl block mb-1">{match.team1Flag}</span>
            <p className="text-sm font-bold">{match.team1Short}</p>
            <p className="text-base font-black text-green-400 mt-0.5">{match.team1Score || '-'}</p>
          </div>
          <div className="flex-shrink-0">
            {match.isLive ? (
              <div className="flex items-center gap-1.5 bg-red-500/30 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold">LIVE</span>
              </div>
            ) : (
              <span className="text-xs text-white/40 font-bold">VS</span>
            )}
          </div>
          <div className="flex-1 text-center">
            <span className="text-3xl block mb-1">{match.team2Flag}</span>
            <p className="text-sm font-bold">{match.team2Short}</p>
            <p className="text-base font-black text-white/80 mt-0.5">{match.team2Score || '-'}</p>
          </div>
        </div>

        {!match.isLive && <p className="text-xs text-yellow-300 mt-2 text-center font-medium">{match.status}</p>}
        <p className="text-[10px] text-white/40 mt-1 text-center">{match.venue}</p>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex">
          {matchTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-green-50/50 dark:bg-green-900/10'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pb-4 overflow-y-auto">
        {activeTab === 'info' && <InfoSection info={matchInfo as any} loading={loading} />}
        {activeTab === 'scorecard' && <ScorecardSection scorecard={scorecard as any} loading={loading} matchData={match} />}
        {activeTab === 'overs' && <OverSection overs={overs as any} loading={loading} />}
        {activeTab === 'commentary' && <CommentarySection commentary={commentary as any} loading={loading} />}
      </div>
    </div>
  );
}
