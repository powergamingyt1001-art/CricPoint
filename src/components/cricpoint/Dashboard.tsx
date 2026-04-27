'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, Radio, Heart, MessageCircle, Share2, Clock } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';
import MatchSlider from './MatchSlider';
import PinSection from './PinSection';
import AIChat from './AIChat';
import BottomNav from './BottomNav';

const FALLBACK_MATCHES: MatchBasic[] = [
  {
    id: "102040", team1: "India", team2: "Australia", team1Short: "IND", team2Short: "AUS",
    team1Score: "287/4 (42.3)", team2Score: "", status: "LIVE", matchType: "3rd ODI",
    venue: "Mumbai", isLive: true, team1Flag: "🇮🇳", team2Flag: "🇦🇺",
    currentOver: "1 0 4 0 6 1", battingTeam: "IND",
  },
];

const MOCK_POSTS = [
  {
    id: '1',
    title: '🔥 Virat Kohli smashes 102* off 115 balls in 3rd ODI against Australia!',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=350&fit=crop',
    likes: 1243, comments: 89, time: '2h ago', liked: false,
  },
  {
    id: '2',
    title: 'IPL 2026 Auction: Top picks and surprises from the mega event',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=350&fit=crop',
    likes: 856, comments: 45, time: '4h ago', liked: false,
  },
  {
    id: '3',
    title: 'Bumrah ruled out of England tour — big blow for Team India',
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&h=350&fit=crop',
    likes: 2341, comments: 156, time: '6h ago', liked: true,
  },
  {
    id: '4',
    title: 'Top 10 Fastest Centuries in ODI Cricket History 🏏',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=350&fit=crop',
    likes: 567, comments: 32, time: '8h ago', liked: false,
  },
  {
    id: '5',
    title: 'Rohit Sharma becomes 1st captain to win 50 T20Is!',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=350&fit=crop',
    likes: 3421, comments: 245, time: '10h ago', liked: false,
  },
  {
    id: '6',
    title: 'ICC Rankings Update: India stays #1 in all formats',
    image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&h=350&fit=crop',
    likes: 1892, comments: 98, time: '12h ago', liked: false,
  },
];

function AdBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 text-center border border-yellow-200 dark:border-gray-600">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Advertisement</p>
      <div className="h-16 bg-yellow-100/50 dark:bg-gray-600/50 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-xs font-medium">📢 Ad Banner</span>
      </div>
    </div>
  );
}

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
      if (data.matches) setMatches(data.matches);
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
    return () => { cancelled = true; clearInterval(interval); };
  }, [fetchMatches]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const completedMatches = matches.filter(m => !m.isLive);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Premium Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/cricpoint-logo-dashboard.png" alt="CricPoint" className="w-9 h-9 object-contain" />
            <h1 className="text-lg font-black text-gray-800 dark:text-gray-200">
              Cric<span className="text-green-600 dark:text-green-400">Point</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {matches.filter(m => m.isLive).length > 0 && (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">
                <Radio className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-bold text-red-500">{matches.filter(m => m.isLive).length} LIVE</span>
              </div>
            )}
            <button onClick={handleRefresh} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto">
        {activeTab === 'home' && (
          <div className="space-y-6 pt-4">
            <MatchSlider matches={matches} onSelectMatch={(m) => selectMatch(m.id, m)} />
            <PinSection matches={matches} />

            {/* Completed Matches */}
            {completedMatches.length > 0 && (
              <div className="px-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Completed Matches</h2>
                </div>
                <div className="space-y-2">
                  {completedMatches.map((match) => (
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
                        <span className="text-[10px] text-green-600 dark:text-green-400 font-medium max-w-[140px] truncate">{match.status}</span>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">{match.matchType} • {match.venue}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Posts */}
            <div className="px-6">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Latest Updates</h2>
              <div className="space-y-4">
                {MOCK_POSTS.map((post, idx) => (
                  <div key={post.id}>
                    <PostCard post={post} />
                    {(idx + 1) % 2 === 0 && <div className="mt-4"><AdBanner /></div>}
                  </div>
                ))}
              </div>
            </div>

            {loading && (
              <div className="px-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pin' && <PinSection matches={matches} />}
        {activeTab === 'point-table' && <PollsSection matches={matches} />}
        {activeTab === 'ai-chat' && <AIChat />}
      </div>

      <BottomNav />
    </div>
  );
}

function PostCard({ post }: { post: typeof MOCK_POSTS[0] }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">{post.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="flex items-center gap-1 group">
              <Heart className={`w-4 h-4 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-red-400'}`} />
              <span className="text-xs text-gray-500">{likeCount.toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-1 group">
              <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-xs text-gray-500">{post.comments}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{post.time}</span>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Share2 className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PollsSection({ matches }: { matches: MatchBasic[] }) {
  const [votes, setVotes] = useState<Record<string, string | null>>({});

  const liveAndUpcoming = matches.filter(m => m.isLive);

  const handleVote = (matchId: string, team: string) => {
    setVotes(prev => ({ ...prev, [matchId]: team }));
  };

  if (liveAndUpcoming.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-sm text-gray-400">No active polls right now</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-4">
      <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Match Polls</h2>
      {liveAndUpcoming.map((match) => {
        const voted = votes[match.id];
        const team1Percent = voted ? (voted === 'team1' ? 67 : 60) : 0;
        const team2Percent = voted ? (voted === 'team2' ? 55 : 40) : 0;

        return (
          <div key={match.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{match.matchType}</span>
              {match.isLive && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-3">Who will win?</p>
            <div className="space-y-2">
              <button
                onClick={() => handleVote(match.id, 'team1')}
                disabled={!!voted}
                className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition-all ${
                  voted === 'team1' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                  : voted ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/10'
                }`}
              >
                {voted && <div className="absolute left-0 top-0 bottom-0 bg-green-100/50 dark:bg-green-800/20" style={{ width: `${team1Percent}%` }} />}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{match.team1Flag}</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{match.team1}</span>
                  </div>
                  {voted && <span className="text-xs font-bold text-green-600">{team1Percent}%</span>}
                </div>
              </button>
              <button
                onClick={() => handleVote(match.id, 'team2')}
                disabled={!!voted}
                className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition-all ${
                  voted === 'team2' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                  : voted ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/10'
                }`}
              >
                {voted && <div className="absolute left-0 top-0 bottom-0 bg-green-100/50 dark:bg-green-800/20" style={{ width: `${team2Percent}%` }} />}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{match.team2Flag}</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{match.team2}</span>
                  </div>
                  {voted && <span className="text-xs font-bold text-green-600">{team2Percent}%</span>}
                </div>
              </button>
            </div>
            {voted && <p className="text-[10px] text-gray-400 mt-2 text-center">1,234 votes • Thanks for voting!</p>}
          </div>
        );
      })}
    </div>
  );
}
