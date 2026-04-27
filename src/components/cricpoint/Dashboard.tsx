'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, Radio, Heart, MessageCircle, Share2, Clock, ArrowUp, Mic } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';
import MatchSlider from './MatchSlider';
import PinSection from './PinSection';
import PointTable from './PointTable';
import CommentarySection from './CommentarySection';
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
  const { activeTab, selectMatch, matchPinned } = useCricPointStore();
  const [matches, setMatches] = useState<MatchBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const initialFetchDone = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchMatches, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [fetchMatches]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  // Scroll-to-top logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 400);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedMatches = matches.filter(m => !m.isLive);
  const liveMatches = matches.filter(m => m.isLive);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Premium Header - Fixed */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-2.5 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/cricpoint-logo-dashboard.png" alt="CricPoint" className="w-12 h-12 object-contain" />
          </div>
          <div className="flex items-center gap-3">
            {liveMatches.length > 0 && (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">
                <Radio className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-bold text-red-500">{liveMatches.length} LIVE</span>
              </div>
            )}
            <button onClick={handleRefresh} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Pinned Match Overlay - Shows when pin is ON */}
      {matchPinned && <PinSection matches={matches} />}

      {/* Main Content - Scrollable */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-20" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6 pt-4">
            <MatchSlider matches={matches} onSelectMatch={(m) => selectMatch(m.id, m)} />

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

            {/* Bottom Footer */}
            <div className="px-6 pb-4 pt-6">
              <div className="text-center">
                <img src="/cricpoint-logo-dashboard.png" alt="CricPoint" className="w-10 h-10 object-contain mx-auto mb-2 opacity-40" />
                <p className="text-[10px] text-gray-400 font-medium">CricPoint v1.0</p>
                <p className="text-[9px] text-gray-300 dark:text-gray-600 mt-0.5">Your Cricket Companion</p>
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

        {/* POINTS TAB */}
        {activeTab === 'points' && (
          <div className="pt-4">
            <PointTable />
          </div>
        )}

        {/* COMMENTARY TAB */}
        {activeTab === 'commentary' && (
          <div className="pt-4">
            <LiveCommentary matches={matches} />
          </div>
        )}
      </div>

      {/* Scroll-to-top floating button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-30 w-10 h-10 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-all active:scale-90"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Bottom Nav - Always Fixed */}
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

function LiveCommentary({ matches }: { matches: MatchBasic[] }) {
  const [commentaryData, setCommentaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const liveMatch = matches.find(m => m.isLive);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!liveMatch) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/cricket/match-commentary?matchid=${liveMatch.id}`);
        const data = await res.json();
        if (!cancelled) { setCommentaryData(data); setLoading(false); }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [liveMatch]);

  if (!liveMatch) {
    return (
      <div className="px-6 py-12 text-center">
        <Mic className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-400 font-medium">No live match for commentary</p>
        <p className="text-xs text-gray-300 mt-1">Commentary will appear when a match is live</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const commentaryList = commentaryData?.commentaryList || [];

  return (
    <div className="px-6">
      {/* Live Match Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-4 mb-4 border border-red-100 dark:border-red-800/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-red-500">LIVE COMMENTARY</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{liveMatch.team1Flag}</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{liveMatch.team1Short}</span>
          </div>
          <span className="text-xs text-gray-400">vs</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{liveMatch.team2Short}</span>
            <span className="text-lg">{liveMatch.team2Flag}</span>
          </div>
        </div>
        <p className="text-sm font-black text-gray-900 dark:text-gray-100 text-center mt-2">
          {liveMatch.team1Score} {liveMatch.team2Score ? `| ${liveMatch.team2Score}` : ''}
        </p>
      </div>

      {/* Commentary List */}
      {commentaryList.length > 0 ? (
        <div className="space-y-2">
          {commentaryList.map((item: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400">
                    {item.over || `${idx + 1}`}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">{item.text || item.commentary || 'Ball in progress...'}</p>
                  {item.timestamp && <p className="text-[9px] text-gray-400 mt-1">{item.timestamp}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Fallback commentary when no API data */}
          <CommentaryItem over="42.3" text="Kohli drives through covers — FOUR! Magnificent shot!" />
          <CommentaryItem over="42.2" text="Dot ball. Good length outside off, Kohli leaves it alone." />
          <CommentaryItem over="42.1" text="SIX! Kohli launches it over long-on! What a shot! 🎉" />
          <CommentaryItem over="41.6" text="Single to fine leg. Rahul rotates the strike." />
          <CommentaryItem over="41.5" text="FOUR! Rahul cuts hard past point. Boundary!" />
          <CommentaryItem over="41.4" text="Dot ball. Tight line from Starc." />
          <CommentaryItem over="41.3" text="Kohli on 98... tension building!" />
          <CommentaryItem over="41.2" text="Two runs. Kohli pushes to mid-wicket, quick running." />
          <CommentaryItem over="41.1" text="Kohli drives to long-off for a single. 97 now!" />
          <CommentaryItem over="40.6" text="End of over. IND 271/4. Kohli 96*, Rahul 41*" />
        </div>
      )}
    </div>
  );
}

function CommentaryItem({ over, text }: { over: string; text: string }) {
  const isHighlight = text.includes('SIX') || text.includes('FOUR') || text.includes('WICKET');
  return (
    <div className={`rounded-xl p-3 border ${
      isHighlight 
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30' 
        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
    }`}>
      <div className="flex items-start gap-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isHighlight ? 'bg-yellow-100 dark:bg-yellow-900/40' : 'bg-green-100 dark:bg-green-900/30'
        }`}>
          <span className={`text-[10px] font-bold ${isHighlight ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
            {over}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${isHighlight ? 'text-yellow-800 dark:text-yellow-200 font-medium' : 'text-gray-800 dark:text-gray-200'}`}>
          {text}
        </p>
      </div>
    </div>
  );
}
