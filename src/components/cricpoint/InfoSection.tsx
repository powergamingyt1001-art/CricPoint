'use client';

import { useState } from 'react';
import { MapPin, Users, Clock, Trophy, Vote } from 'lucide-react';
import { motion } from 'framer-motion';

interface MatchInfo {
  matchId: string;
  seriesName: string;
  matchDesc: string;
  matchType: string;
  venue: { name: string; city: string; capacity: string; hostTeam: string };
  team1: { name: string; shortName: string; flag: string; squad: string[] };
  team2: { name: string; shortName: string; flag: string; squad: string[] };
  status: string;
  toss: string;
  umpires: string;
  matchReferee: string;
  startTime: string;
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

  return (
    <div className="p-4 space-y-4">
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
                <span className="text-lg">{info.team1.flag}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{info.team1.name}</span>
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
                <span className="text-lg">{info.team2.flag}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{info.team2.name}</span>
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
          <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} label="Venue" value={`${info.venue.name}, ${info.venue.city}`} />
          <InfoRow icon={<Users className="w-3.5 h-3.5" />} label="Capacity" value={info.venue.capacity} />
          <InfoRow icon={<Clock className="w-3.5 h-3.5" />} label="Start Time" value={new Date(info.startTime).toLocaleString()} />
        </div>
      </div>

      {/* Toss & Officials */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
          Toss & Officials
        </h3>
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          <InfoRow label="Toss" value={info.toss} />
          <InfoRow label="Umpires" value={info.umpires} />
          <InfoRow label="Match Referee" value={info.matchReferee} />
        </div>
      </div>

      {/* Squads */}
      <div className="space-y-3">
        {[info.team1, info.team2].map((team) => (
          <div key={team.shortName} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <span className="text-lg">{team.flag}</span>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{team.name} Squad</h3>
            </div>
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-1.5">
                {team.squad.map((player, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full"
                  >
                    {player}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
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
