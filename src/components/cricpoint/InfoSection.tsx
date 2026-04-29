'use client';

import { useState } from 'react';
import { MapPin, Users, Clock, Trophy, Vote, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MatchInfo {
  matchId: string;
  seriesName: string;
  matchDesc: string;
  matchType: string;
  venue: { name: string; city: string; capacity?: string; hostTeam?: string };
  team1: { name: string; shortName: string; flag: string; img?: string; score?: string; squad: string[] };
  team2: { name: string; shortName: string; flag: string; img?: string; score?: string; squad: string[] };
  status: string;
  toss: string;
  umpires?: string;
  matchReferee?: string;
  startTime?: string;
  date?: string;
  dateTimeGMT?: string;
  matchStarted?: boolean;
  matchEnded?: boolean;
  score?: Array<{ inning: string; r: number; w: number; o: number }>;
}

interface InfoSectionProps {
  info: MatchInfo | null;
  loading: boolean;
}

export default function InfoSection({ info, loading }: InfoSectionProps) {
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [pollCounts, setPollCounts] = useState({ team1: 67, team2: 33 });

  const handleVote = (team: 'team1' | 'team2') => {
    if (pollVoted) return;
    setPollVoted(team);
    if (team === 'team1') {
      setPollCounts(prev => ({ team1: prev.team1 + 1, team2: prev.team2 }));
    } else {
      setPollCounts(prev => ({ team1: prev.team1, team2: prev.team2 + 1 }));
    }
  };

  const totalVotes = pollCounts.team1 + pollCounts.team2;
  const team1Percent = Math.round((pollCounts.team1 / totalVotes) * 100);
  const team2Percent = 100 - team1Percent;

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!info) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Match info not available</p>
      </div>
    );
  }

  const isLive = info.matchStarted && !info.matchEnded;

  return (
    <div className="p-4 space-y-4">
      {/* Live Status Banner */}
      {isLive && info.status && (
        <motion.div
          className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-3 border border-green-200 dark:border-green-800/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Live Update</span>
          </div>
          <p className="text-xs font-semibold text-green-700 dark:text-green-300">{info.status}</p>
        </motion.div>
      )}

      {/* Match Result */}
      {!isLive && info.status && (
        <motion.div
          className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-3 border border-amber-200 dark:border-amber-800/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{info.status}</p>
        </motion.div>
      )}

      {/* Score Summary */}
      {(info.team1?.score || info.team2?.score || (info.score && info.score.length > 0)) && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
            <Zap className="w-3 h-3 text-green-600" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Score Summary</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {/* Team 1 Score */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                {info.team1.img ? (
                  <Image src={info.team1.img} alt={info.team1.shortName} width={24} height={24} className="object-contain" unoptimized />
                ) : (
                  <span className="text-lg">{info.team1.flag}</span>
                )}
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{info.team1.shortName || info.team1.name}</span>
              </div>
              <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                {info.team1.score || '—'}
              </span>
            </div>
            {/* Team 2 Score */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                {info.team2.img ? (
                  <Image src={info.team2.img} alt={info.team2.shortName} width={24} height={24} className="object-contain" unoptimized />
                ) : (
                  <span className="text-lg">{info.team2.flag}</span>
                )}
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{info.team2.shortName || info.team2.name}</span>
              </div>
              <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                {info.team2.score || '—'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Poll Section */}
      <motion.div
        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-100 dark:border-green-800/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Vote className="w-4 h-4 text-green-600" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Who will win?</h3>
        </div>

        <div className="space-y-2">
          {/* Team 1 */}
          <button
            onClick={() => handleVote('team1')}
            disabled={!!pollVoted}
            className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition-all ${
              pollVoted === 'team1'
                ? 'ring-2 ring-green-500 bg-green-100 dark:bg-green-900/40'
                : pollVoted
                ? 'bg-white dark:bg-gray-800'
                : 'bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
          >
            {pollVoted && (
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-green-200/40 dark:bg-green-700/30"
                initial={{ width: 0 }}
                animate={{ width: `${team1Percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                {info.team1.img ? (
                  <Image src={info.team1.img} alt={info.team1.shortName} width={20} height={20} className="object-contain" unoptimized />
                ) : (
                  <span className="text-lg">{info.team1.flag}</span>
                )}
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{info.team1.shortName || info.team1.name}</span>
              </div>
              {pollVoted && (
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{team1Percent}%</span>
              )}
            </div>
          </button>

          {/* Team 2 */}
          <button
            onClick={() => handleVote('team2')}
            disabled={!!pollVoted}
            className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition-all ${
              pollVoted === 'team2'
                ? 'ring-2 ring-green-500 bg-green-100 dark:bg-green-900/40'
                : pollVoted
                ? 'bg-white dark:bg-gray-800'
                : 'bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
          >
            {pollVoted && (
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-green-200/40 dark:bg-green-700/30"
                initial={{ width: 0 }}
                animate={{ width: `${team2Percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                {info.team2.img ? (
                  <Image src={info.team2.img} alt={info.team2.shortName} width={20} height={20} className="object-contain" unoptimized />
                ) : (
                  <span className="text-lg">{info.team2.flag}</span>
                )}
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{info.team2.shortName || info.team2.name}</span>
              </div>
              {pollVoted && (
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{team2Percent}%</span>
              )}
            </div>
          </button>

          {pollVoted && (
            <p className="text-[10px] text-center text-gray-400 mt-1">
              {totalVotes.toLocaleString()} votes • Thank you for voting!
            </p>
          )}
        </div>
      </motion.div>

      {/* Match Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
          Match Details
        </h3>

        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          <InfoRow icon={<Trophy className="w-3.5 h-3.5" />} label="Series" value={info.seriesName} />
          <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} label="Venue" value={info.venue.name} />
          <InfoRow icon={<Clock className="w-3.5 h-3.5" />} label="Date" value={info.date || info.dateTimeGMT || ''} />
        </div>
      </div>

      {/* Toss Info */}
      {info.toss && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
            Toss
          </h3>
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{info.toss}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 px-4 py-2.5">
      {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
      <div className="flex-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
