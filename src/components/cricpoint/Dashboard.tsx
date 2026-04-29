'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, Radio, Heart, MessageCircle, Share2, Clock, ArrowUp, ChevronDown, MapPin, Send, Plus, X, Hash, Trophy, Settings, Info, BarChart3, Moon, Sun, Bell, Shield, HelpCircle, Star, Globe } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';
import MatchSlider from './MatchSlider';
import PinSection from './PinSection';
import PointTable from './PointTable';
import BottomNav from './BottomNav';
import AIChat from './AIChat';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_MATCHES: MatchBasic[] = [
  {
    id: "102040", team1: "India", team2: "Australia", team1Short: "IND", team2Short: "AUS",
    team1Score: "287/4 (42.3)", team2Score: "", status: "LIVE", matchType: "3rd ODI",
    venue: "Mumbai", isLive: true, team1Flag: "🇮🇳", team2Flag: "🇦🇺",
    currentOver: "1 0 4 0 6 1", battingTeam: "IND",
  },
  {
    id: "102041", team1: "England", team2: "South Africa", team1Short: "ENG", team2Short: "SA",
    team1Score: "243/8 (50)", team2Score: "196/10 (43.2)", status: "ENG won by 47 runs", matchType: "2nd T20I",
    venue: "London", isLive: false, team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team2Flag: "🇿🇦",
  },
  {
    id: "102042", team1: "Sri Lanka", team2: "Bangladesh", team1Short: "SL", team2Short: "BAN",
    team1Score: "289/6 (50)", team2Score: "253/10 (47.4)", status: "SL won by 36 runs", matchType: "4th ODI",
    venue: "Colombo", isLive: false, team1Flag: "🇱🇰", team2Flag: "🇧🇩",
  },
];

const FAKE_COMMENT_NAMES = [
  'Rahul_King', 'Cricket_Fan99', 'IPL_Lover', 'Kohli_Army', 'Hitman_Fan',
  'Dhoni_Bhakt', 'Bumrah_Fan', 'Cricket_Guru', 'SixerKing', 'StarkFan',
  'Sports_Nerd', 'Match_Winner', 'Boundary_Boy', 'Pitch_Report', 'Stump_Cam',
];

const FAKE_COMMENTS_LIST = [
  'What a match! 🔥', 'Kohli is GOAT 🐐', 'Incredible innings!', 'Vintage Kohli!',
  'Bumrah is unplayable 🎯', 'What a six!', 'Masterclass batting 👏', 'India will win this!',
  'Great bowling change', 'This is why we love cricket ❤️', 'Pressure handling at its best',
  'Shot of the day! 💥', 'Edge and FOUR!', 'Clean hitting 💪',
];

interface Post {
  id: string;
  title: string;
  hashtag: string;
  image: string;
  likes: number;
  fakeLikesTarget: number;
  comments: number;
  fakeComments: { user: string; text: string }[];
  time: string;
  liked: boolean;
  createdAt: number;
  userComments: { user: string; text: string }[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1', title: '🔥 Virat Kohli smashes 102* off 115 balls in 3rd ODI against Australia!',
    hashtag: '#INDvsAUS #Kohli', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=350&fit=crop',
    likes: 1243, fakeLikesTarget: 1876, comments: 89, fakeComments: [], time: '2h ago', liked: false, createdAt: Date.now() - 7200000, userComments: [],
  },
  {
    id: '2', title: 'IPL 2026 Auction: Top picks and surprises from the mega event',
    hashtag: '#IPL2026 #Auction', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=350&fit=crop',
    likes: 856, fakeLikesTarget: 1523, comments: 45, fakeComments: [], time: '4h ago', liked: false, createdAt: Date.now() - 14400000, userComments: [],
  },
  {
    id: '3', title: 'Bumrah ruled out of England tour — big blow for Team India',
    hashtag: '#Bumrah #TeamIndia', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&h=350&fit=crop',
    likes: 2341, fakeLikesTarget: 1899, comments: 156, fakeComments: [], time: '6h ago', liked: true, createdAt: Date.now() - 21600000, userComments: [],
  },
  {
    id: '4', title: 'Top 10 Fastest Centuries in ODI Cricket History 🏏',
    hashtag: '#ODI #Records', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=350&fit=crop',
    likes: 567, fakeLikesTarget: 1200, comments: 32, fakeComments: [], time: '8h ago', liked: false, createdAt: Date.now() - 28800000, userComments: [],
  },
  {
    id: '5', title: 'Rohit Sharma becomes 1st captain to win 50 T20Is!',
    hashtag: '#Rohit #T20I', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=350&fit=crop',
    likes: 3421, fakeLikesTarget: 1932, comments: 245, fakeComments: [], time: '10h ago', liked: false, createdAt: Date.now() - 36000000, userComments: [],
  },
  {
    id: '6', title: 'ICC Rankings Update: India stays #1 in all formats',
    hashtag: '#ICC #Rankings', image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&h=350&fit=crop',
    likes: 1892, fakeLikesTarget: 1654, comments: 98, fakeComments: [], time: '12h ago', liked: false, createdAt: Date.now() - 43200000, userComments: [],
  },
];

INITIAL_POSTS.forEach(post => {
  const numFakeComments = Math.floor(Math.random() * 100) + 50;
  post.fakeComments = Array.from({ length: numFakeComments }, () => ({
    user: FAKE_COMMENT_NAMES[Math.floor(Math.random() * FAKE_COMMENT_NAMES.length)],
    text: FAKE_COMMENTS_LIST[Math.floor(Math.random() * FAKE_COMMENTS_LIST.length)],
  }));
});

const MOCK_POLLS = [
  { id: 'p1', question: 'Who will win the India vs Australia 3rd ODI?', team1: 'India', team1Flag: '🇮🇳', team2: 'Australia', team2Flag: '🇦🇺', team1Percent: 67, team2Percent: 33, totalVotes: 12450 },
  { id: 'p2', question: 'Will Kohli score a century today?', team1: 'Yes', team1Flag: '✅', team2: 'No', team2Flag: '❌', team1Percent: 72, team2Percent: 28, totalVotes: 8932 },
  { id: 'p3', question: 'Who is the best T20 captain?', team1: 'Rohit', team1Flag: '🇮🇳', team2: 'Buttler', team2Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team1Percent: 58, team2Percent: 42, totalVotes: 5621 },
  { id: 'p4', question: 'Which team will win IPL 2026?', team1: 'CSK', team1Flag: '🦁', team2: 'MI', team2Flag: '🏏', team1Percent: 45, team2Percent: 55, totalVotes: 15600 },
  { id: 'p5', question: 'Best fast bowler in the world right now?', team1: 'Bumrah', team1Flag: '🇮🇳', team2: 'Starc', team2Flag: '🇦🇺', team1Percent: 61, team2Percent: 39, totalVotes: 9870 },
  { id: 'p6', question: 'Who will win the Ashes 2026?', team1: 'England', team1Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'Australia', team2Flag: '🇦🇺', team1Percent: 44, team2Percent: 56, totalVotes: 7230 },
];

/* ===== AD COMPONENT ===== */
function WideAdBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-3 text-center border border-yellow-200 dark:border-gray-600">
      <p className="text-[8px] text-gray-400 uppercase tracking-widest mb-1">Advertisement</p>
      <div className="h-14 bg-yellow-100/50 dark:bg-gray-600/50 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-xs font-medium">📢 Ad Banner</span>
      </div>
    </div>
  );
}

/* ===== ICC RANKING DATA ===== */
const ICC_RANKINGS = {
  tests: [
    { rank: 1, team: 'India', flag: '🇮🇳', rating: 128, points: 5123 },
    { rank: 2, team: 'Australia', flag: '🇦🇺', rating: 119, points: 4765 },
    { rank: 3, team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 112, points: 4498 },
    { rank: 4, team: 'South Africa', flag: '🇿🇦', rating: 105, points: 3780 },
    { rank: 5, team: 'New Zealand', flag: '🇳🇿', rating: 98, points: 3420 },
    { rank: 6, team: 'Pakistan', flag: '🇵🇰', rating: 89, points: 3120 },
    { rank: 7, team: 'Sri Lanka', flag: '🇱🇰', rating: 78, points: 2540 },
    { rank: 8, team: 'West Indies', flag: '🏝️', rating: 72, points: 2210 },
  ],
  odi: [
    { rank: 1, team: 'India', flag: '🇮🇳', rating: 121, points: 5445 },
    { rank: 2, team: 'Australia', flag: '🇦🇺', rating: 116, points: 4987 },
    { rank: 3, team: 'South Africa', flag: '🇿🇦', rating: 110, points: 4210 },
    { rank: 4, team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 108, points: 4102 },
    { rank: 5, team: 'New Zealand', flag: '🇳🇿', rating: 101, points: 3640 },
    { rank: 6, team: 'Pakistan', flag: '🇵🇰', rating: 92, points: 3340 },
    { rank: 7, team: 'Bangladesh', flag: '🇧🇩', rating: 81, points: 2650 },
    { rank: 8, team: 'Sri Lanka', flag: '🇱🇰', rating: 76, points: 2340 },
  ],
  t20: [
    { rank: 1, team: 'India', flag: '🇮🇳', rating: 268, points: 10720 },
    { rank: 2, team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 265, points: 10600 },
    { rank: 3, team: 'Australia', flag: '🇦🇺', rating: 258, points: 9810 },
    { rank: 4, team: 'South Africa', flag: '🇿🇦', rating: 253, points: 9360 },
    { rank: 5, team: 'West Indies', flag: '🏝️', rating: 248, points: 8930 },
    { rank: 6, team: 'Pakistan', flag: '🇵🇰', rating: 241, points: 8680 },
    { rank: 7, team: 'New Zealand', flag: '🇳🇿', rating: 235, points: 8230 },
    { rank: 8, team: 'Sri Lanka', flag: '🇱🇰', rating: 224, points: 7410 },
  ],
};

/* ===== MAIN DASHBOARD ===== */
export default function Dashboard() {
  const { activeTab, selectMatch, matchPinned, matchFilter, setMatchFilter, showPointTable, menuDialog, setMenuDialog } = useCricPointStore();
  const [matches, setMatches] = useState<MatchBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostHashtag, setNewPostHashtag] = useState('');
  const initialFetchDone = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const refreshCountRef = useRef(0);
  const [refreshCooldown, setRefreshCooldown] = useState(false);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);

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
    const interval = setInterval(fetchMatches, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [fetchMatches]);

  // Refresh with rate limiting
  const handleRefresh = async () => {
    if (refreshCooldown) return;
    refreshCountRef.current++;
    if (refreshCountRef.current >= 5) {
      setRefreshCooldown(true);
      setTimeout(() => {
        refreshCountRef.current = 0;
        setRefreshCooldown(false);
      }, 20000);
    }
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  // Pull-to-refresh: detect scroll at top + pull down
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 400);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (container.scrollTop <= 0 && !refreshCooldown) {
        const diff = e.touches[0].clientY - touchStartY.current;
        if (diff > 0) {
          setPullDistance(Math.min(diff, 80));
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= 60 && !refreshCooldown && !isPullRefreshing) {
        setIsPullRefreshing(true);
        refreshCountRef.current++;
        if (refreshCountRef.current >= 5) {
          setRefreshCooldown(true);
          setTimeout(() => {
            refreshCountRef.current = 0;
            setRefreshCooldown(false);
          }, 20000);
        }
        await fetchMatches();
        setIsPullRefreshing(false);
      }
      setPullDistance(0);
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, refreshCooldown, isPullRefreshing, fetchMatches]);

  // Viral system: increase likes gradually
  useEffect(() => {
    const viralInterval = setInterval(() => {
      setPosts(prev => prev.map(post => {
        if (post.likes >= post.fakeLikesTarget) return post;
        const increment = Math.floor(Math.random() * 15) + 3;
        return { ...post, likes: Math.min(post.likes + increment, post.fakeLikesTarget) };
      }));
    }, 8000);
    return () => clearInterval(viralInterval);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createPost = () => {
    if (!newPostTitle.trim()) return;
    const newPost: Post = {
      id: `user_${Date.now()}`,
      title: newPostTitle.trim(),
      hashtag: newPostHashtag.trim() || '#CricPoint',
      image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&h=350&fit=crop',
      likes: 0,
      fakeLikesTarget: Math.floor(Math.random() * 1500) + 500,
      comments: 0,
      fakeComments: [],
      time: 'Just now',
      liked: false,
      createdAt: Date.now(),
      userComments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostHashtag('');
    setShowCreatePost(false);
  };

  const liveMatches = matches.filter(m => m.isLive);
  const completedMatches = matches.filter(m => !m.isLive);
  const upcomingMatches = matches.filter(m => !m.isLive && m.status && m.status.toLowerCase().includes('yet'));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Premium Header - Logo touching text */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#132244] to-[#0a1628] border-b border-white/10 px-4 py-2.5 sticky top-0 z-30 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src="/cricpoint-logo-dashboard.png" alt="CricPoint" className="h-10 w-auto object-contain drop-shadow-lg" />
            <div>
              <h1 className="text-lg font-black text-white leading-none">
                Cric<span className="text-green-400">Point</span>
              </h1>
              <p className="text-[8px] text-white/50 font-medium tracking-wide">LIVE CRICKET SCORE</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {liveMatches.length > 0 && (
              <div className="flex items-center gap-1 bg-red-500/90 px-2 py-0.5 rounded-full shadow-sm">
                <Radio className="w-2.5 h-2.5 text-white" />
                <span className="text-[9px] font-bold text-white">{liveMatches.length} LIVE</span>
              </div>
            )}
            <button onClick={handleRefresh} className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${refreshCooldown ? 'opacity-40' : ''}`}>
              <RefreshCw className={`w-3.5 h-3.5 text-green-400/80 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Pin overlay */}
      {matchPinned && <PinSection matches={matches} />}

      {/* Pull-to-refresh indicator */}
      {(isPullRefreshing || pullDistance > 0) && (
        <div className="flex items-center justify-center py-2 transition-all" style={{ height: Math.max(pullDistance, isPullRefreshing ? 40 : 0) }}>
          <RefreshCw className={`w-5 h-5 text-green-500 ${isPullRefreshing ? 'animate-spin' : ''}`} />
          {isPullRefreshing && <span className="text-xs text-green-600 ml-2 font-medium">Refreshing...</span>}
          {!isPullRefreshing && pullDistance >= 60 && <span className="text-xs text-green-600 ml-2 font-medium">Release to refresh</span>}
          {!isPullRefreshing && pullDistance < 60 && pullDistance > 0 && <span className="text-xs text-gray-400 ml-2">Pull down</span>}
        </div>
      )}

      {/* Main Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-16" style={{ maxHeight: 'calc(100vh - 52px)' }}>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="pt-3">
            <MatchSlider matches={matches} onSelectMatch={(m) => selectMatch(m.id, m)} />

            {/* Points Table */}
            {showPointTable && <PointTable />}

            {/* Green Box: Completed Matches */}
            <div className="mx-4 mt-3 bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-500 dark:border-green-600 p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h2 className="text-sm font-bold text-green-700 dark:text-green-300">Completed Matches</h2>
              </div>
              <div className="space-y-2">
                {completedMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => selectMatch(match.id, match)}
                    className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-3 border border-green-200 dark:border-green-800/50 hover:shadow-sm transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{match.matchType} · {match.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{match.team1Flag}</span>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{match.team1Short}</span>
                        <span className="text-[9px] text-gray-400">vs</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{match.team2Short}</span>
                        <span className="text-sm">{match.team2Flag}</span>
                      </div>
                      <span className="text-[10px] text-green-600 dark:text-green-400 font-medium max-w-[130px] truncate">{match.status}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500">{match.team1Score}</span>
                      <span className="text-[10px] text-gray-500">{match.team2Score}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ad Banner after completed matches */}
            <div className="mx-4 mt-3">
              <WideAdBanner />
            </div>

            {/* View Posts Button */}
            <div className="px-4 mt-3">
              <button
                onClick={() => setShowPosts(!showPosts)}
                className="w-full py-3 bg-gradient-to-r from-[#0a1628] to-[#132244] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${showPosts ? 'rotate-180' : ''}`} />
                {showPosts ? 'Hide Posts' : 'View Posts'}
                <ChevronDown className={`w-5 h-5 transition-transform ${showPosts ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Posts Section */}
            {showPosts && (
              <div className="px-4 pt-3 pb-4 space-y-3">
                {/* Create Post */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3">
                  {showCreatePost ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Create Post</span>
                        <button onClick={() => setShowCreatePost(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="Write your post title..."
                        className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500/30"
                      />
                      <div className="flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={newPostHashtag}
                          onChange={(e) => setNewPostHashtag(e.target.value)}
                          placeholder="Add hashtag (e.g. #Cricket #IPL)"
                          className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500/30"
                        />
                      </div>
                      <button
                        onClick={createPost}
                        disabled={!newPostTitle.trim()}
                        className="w-full py-2 bg-green-600 text-white rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-green-700 transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="w-full flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-green-500" />
                      <span className="text-xs">Create Post...</span>
                    </button>
                  )}
                </div>

                {/* Posts list - 1 ad after every 2 posts */}
                {posts.map((post, idx) => (
                  <div key={post.id}>
                    <PostCard post={post} onUpdatePost={(updated) => {
                      setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
                    }} />
                    {/* Ad after every 2 posts */}
                    {(idx + 1) % 2 === 0 && idx < posts.length - 1 && (
                      <div className="mt-3"><WideAdBanner /></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MATCH TAB */}
        {activeTab === 'match' && (
          <div className="pt-3 px-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMatchFilter('upcoming')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  matchFilter === 'upcoming'
                    ? 'bg-[#132244] text-green-400 shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setMatchFilter('complete')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  matchFilter === 'complete'
                    ? 'bg-[#132244] text-green-400 shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Complete
              </button>
            </div>

            {matchFilter === 'upcoming' ? (
              upcomingMatches.length > 0 ? (
                <div className="space-y-2">
                  {upcomingMatches.map((match) => (
                    <MatchListItem key={match.id} match={match} onClick={() => selectMatch(match.id, match)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No upcoming matches</p>
                </div>
              )
            ) : (
              completedMatches.length > 0 ? (
                <div className="space-y-2">
                  {completedMatches.map((match) => (
                    <MatchListItem key={match.id} match={match} onClick={() => selectMatch(match.id, match)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No completed matches</p>
                </div>
              )
            )}
          </div>
        )}

        {/* AI TAB */}
        {activeTab === 'ai' && <AIChat />}

        {/* POLL TAB */}
        {activeTab === 'poll' && <PollsSection />}
      </div>

      {/* Scroll-to-top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-18 right-4 z-30 w-9 h-9 bg-[#132244] text-green-400 rounded-full shadow-lg flex items-center justify-center hover:bg-[#1a2d52] transition-all active:scale-90"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      <BottomNav />

      {/* Menu Dialogs */}
      <AnimatePresence>
        {menuDialog && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuDialog(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>

              {menuDialog === 'icc-ranking' && <ICCRankingDialog />}
              {menuDialog === 'ranking' && <PlayerRankingDialog />}
              {menuDialog === 'settings' && <SettingsDialog />}
              {menuDialog === 'about' && <AboutDialog />}

              <div className="p-4 pt-0">
                <button
                  onClick={() => setMenuDialog(null)}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== MATCH LIST ITEM ===== */
function MatchListItem({ match, onClick }: { match: MatchBasic; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all active:scale-[0.99]"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{match.matchType}</span>
        {match.isLive && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-red-500">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />LIVE
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{match.team1Flag}</span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{match.team1Short}</span>
        </div>
        <div className="text-[10px] text-gray-400">vs</div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{match.team2Short}</span>
          <span className="text-base">{match.team2Flag}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-gray-500 font-medium">{match.team1Score || '-'}</span>
        <span className="text-[9px] text-green-600 dark:text-green-400 font-medium">{match.status}</span>
        <span className="text-[10px] text-gray-500 font-medium">{match.team2Score || '-'}</span>
      </div>
    </button>
  );
}

/* ===== POST CARD ===== */
function PostCard({ post, onUpdatePost }: { post: Post; onUpdatePost: (post: Post) => void }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const updated = { ...post, userComments: [...post.userComments, { user: 'You', text: commentText.trim() }] };
    onUpdatePost(updated);
    setCommentText('');
  };

  const allComments = [...post.fakeComments.slice(0, showComments ? 50 : 3), ...post.userComments];
  const totalComments = post.fakeComments.length + post.userComments.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1 line-clamp-2">{post.title}</h3>
        {post.hashtag && (
          <p className="text-[10px] text-green-500 font-medium mb-2">{post.hashtag}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleLike} className="flex items-center gap-1 group">
              <Heart className={`w-4 h-4 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-red-400'}`} />
              <span className="text-[11px] text-gray-500 font-medium">{likeCount.toLocaleString()}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 group">
              <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-[11px] text-gray-500 font-medium">{totalComments}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400">{post.time}</span>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Share2 className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="max-h-48 overflow-y-auto space-y-1.5 mb-2 pr-1">
              {allComments.map((c, i) => (
                <div key={i} className="flex gap-1.5">
                  <span className={`text-[10px] font-bold ${c.user === 'You' ? 'text-green-600' : 'text-gray-500'}`}>{c.user}:</span>
                  <span className="text-[10px] text-gray-600 dark:text-gray-400">{c.text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1.5 text-[10px] text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500/30"
              />
              <button
                onClick={addComment}
                disabled={!commentText.trim()}
                className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center disabled:opacity-30"
              >
                <Send className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== POLLS SECTION - FIXED VOTING ===== */
function PollsSection() {
  const [votes, setVotes] = useState<Record<string, string | null>>({});
  const [votedPolls, setVotedPolls] = useState<Record<string, boolean>>({});

  const handleVote = (pollId: string, team: string) => {
    if (votedPolls[pollId]) return;
    setVotedPolls(prev => ({ ...prev, [pollId]: true }));
    setVotes(prev => ({ ...prev, [pollId]: team }));
  };

  return (
    <div className="px-4 pt-3 pb-4 space-y-3">
      <h2 className="text-xs font-bold text-gray-800 dark:text-gray-200">🔥 Match Polls</h2>
      {MOCK_POLLS.map((poll, idx) => {
        const voted = votes[poll.id];
        const hasVoted = votedPolls[poll.id] || false;
        return (
          <div key={poll.id}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-2.5">{poll.question}</p>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleVote(poll.id, 'team1')}
                  className={`w-full relative overflow-hidden rounded-xl p-2.5 text-left transition-all active:scale-[0.98] ${
                    voted === 'team1' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                    : hasVoted ? 'bg-gray-50 dark:bg-gray-700/50'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/10'
                  }`}
                >
                  {voted && <motion.div
                    className="absolute left-0 top-0 bottom-0 bg-green-200/30 dark:bg-green-800/20"
                    initial={{ width: 0 }}
                    animate={{ width: `${poll.team1Percent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{poll.team1Flag}</span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{poll.team1}</span>
                    </div>
                    {voted && <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] font-bold text-green-600"
                    >
                      {poll.team1Percent}%
                    </motion.span>}
                  </div>
                </button>
                <button
                  onClick={() => handleVote(poll.id, 'team2')}
                  className={`w-full relative overflow-hidden rounded-xl p-2.5 text-left transition-all active:scale-[0.98] ${
                    voted === 'team2' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                    : hasVoted ? 'bg-gray-50 dark:bg-gray-700/50'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/10'
                  }`}
                >
                  {voted && <motion.div
                    className="absolute left-0 top-0 bottom-0 bg-green-200/30 dark:bg-green-800/20"
                    initial={{ width: 0 }}
                    animate={{ width: `${poll.team2Percent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{poll.team2Flag}</span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{poll.team2}</span>
                    </div>
                    {voted && <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] font-bold text-green-600"
                    >
                      {poll.team2Percent}%
                    </motion.span>}
                  </div>
                </button>
              </div>
              {voted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[9px] text-gray-400 mt-1.5 text-center"
                >
                  {poll.totalVotes.toLocaleString()} votes • Thanks for voting! ✅
                </motion.p>
              )}
            </div>
            {/* Ad after every 2 polls */}
            {(idx + 1) % 2 === 0 && idx < MOCK_POLLS.length - 1 && (
              <div className="mt-2"><WideAdBanner /></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ===== ICC RANKING DIALOG ===== */
function ICCRankingDialog() {
  const [format, setFormat] = useState<'tests' | 'odi' | 't20'>('tests');
  const data = ICC_RANKINGS[format];

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">ICC Team Rankings</h2>
      </div>

      {/* Format Tabs */}
      <div className="flex gap-1.5 mb-3">
        {(['tests', 'odi', 't20'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              format === f
                ? 'bg-[#132244] text-green-400 shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Rankings Table */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2rem_1fr_3.5rem_3.5rem] gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-[9px] font-bold text-gray-500 uppercase">
          <span>#</span>
          <span>Team</span>
          <span className="text-center">Rating</span>
          <span className="text-center">Points</span>
        </div>
        {data.map((entry, idx) => (
          <div
            key={entry.team}
            className={`grid grid-cols-[2rem_1fr_3.5rem_3.5rem] gap-1 px-3 py-2.5 items-center ${
              idx < 3 ? 'bg-green-50/50 dark:bg-green-900/10' : ''
            } ${idx !== data.length - 1 ? 'border-b border-gray-100 dark:border-gray-600/50' : ''}`}
          >
            <span className={`text-xs font-bold ${idx < 3 ? 'text-green-600' : 'text-gray-400'}`}>{entry.rank}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{entry.flag}</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{entry.team}</span>
            </div>
            <span className="text-xs text-center font-bold text-gray-900 dark:text-gray-100">{entry.rating}</span>
            <span className="text-xs text-center text-gray-600 dark:text-gray-400">{entry.points.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== PLAYER RANKING DIALOG ===== */
function PlayerRankingDialog() {
  const [category, setCategory] = useState<'batting' | 'bowling' | 'allrounder'>('batting');

  const BATTING_RANKS = [
    { rank: 1, name: 'Virat Kohli', team: '🇮🇳', rating: 887 },
    { rank: 2, name: 'Rohit Sharma', team: '🇮🇳', rating: 834 },
    { rank: 3, name: 'Steve Smith', team: '🇦🇺', rating: 812 },
    { rank: 4, name: 'Joe Root', team: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 798 },
    { rank: 5, name: 'Kane Williamson', team: '🇳🇿', rating: 785 },
    { rank: 6, name: 'Babar Azam', team: '🇵🇰', rating: 762 },
    { rank: 7, name: 'Travis Head', team: '🇦🇺', rating: 741 },
    { rank: 8, name: 'Shubman Gill', team: '🇮🇳', rating: 728 },
  ];

  const BOWLING_RANKS = [
    { rank: 1, name: 'Jasprit Bumrah', team: '🇮🇳', rating: 904 },
    { rank: 2, name: 'Pat Cummins', team: '🇦🇺', rating: 862 },
    { rank: 3, name: 'Josh Hazlewood', team: '🇦🇺', rating: 831 },
    { rank: 4, name: 'Ravindra Jadeja', team: '🇮🇳', rating: 822 },
    { rank: 5, name: 'Ravichandran Ashwin', team: '🇮🇳', rating: 810 },
    { rank: 6, name: 'Shaheen Afridi', team: '🇵🇰', rating: 788 },
    { rank: 7, name: 'Kagiso Rabada', team: '🇿🇦', rating: 775 },
    { rank: 8, name: 'Mitchell Starc', team: '🇦🇺', rating: 761 },
  ];

  const ALLROUNDER_RANKS = [
    { rank: 1, name: 'Ravindra Jadeja', team: '🇮🇳', rating: 438 },
    { rank: 2, name: 'Ben Stokes', team: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 412 },
    { rank: 3, name: 'Ravichandran Ashwin', team: '🇮🇳', rating: 389 },
    { rank: 4, name: 'Shakib Al Hasan', team: '🇧🇩', rating: 372 },
    { rank: 5, name: 'Cameron Green', team: '🇦🇺', rating: 345 },
    { rank: 6, name: 'Marco Jansen', team: '🇿🇦', rating: 321 },
    { rank: 7, name: 'Axar Patel', team: '🇮🇳', rating: 308 },
    { rank: 8, name: 'Mitchell Marsh', team: '🇦🇺', rating: 295 },
  ];

  const data = category === 'batting' ? BATTING_RANKS : category === 'bowling' ? BOWLING_RANKS : ALLROUNDER_RANKS;

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-green-500" />
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Player Rankings</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 mb-3">
        {(['batting', 'bowling', 'allrounder'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              category === c
                ? 'bg-[#132244] text-green-400 shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Rankings Table */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2rem_1fr_2.5rem_3rem] gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-[9px] font-bold text-gray-500 uppercase">
          <span>#</span>
          <span>Player</span>
          <span className="text-center"></span>
          <span className="text-center">Rating</span>
        </div>
        {data.map((entry, idx) => (
          <div
            key={entry.name}
            className={`grid grid-cols-[2rem_1fr_2.5rem_3rem] gap-1 px-3 py-2.5 items-center ${
              idx < 3 ? 'bg-green-50/50 dark:bg-green-900/10' : ''
            } ${idx !== data.length - 1 ? 'border-b border-gray-100 dark:border-gray-600/50' : ''}`}
          >
            <span className={`text-xs font-bold ${idx < 3 ? 'text-green-600' : 'text-gray-400'}`}>{entry.rank}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{entry.team}</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{entry.name}</span>
            </div>
            <span></span>
            <span className="text-xs text-center font-bold text-gray-900 dark:text-gray-100">{entry.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== SETTINGS DIALOG ===== */
function SettingsDialog() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-5 h-5 text-gray-500" />
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Settings</h2>
      </div>

      <div className="space-y-1">
        <SettingToggle
          icon={<Bell className="w-4 h-4 text-yellow-500" />}
          label="Push Notifications"
          description="Get notified about live scores"
          enabled={notifications}
          onToggle={() => setNotifications(!notifications)}
        />
        <SettingToggle
          icon={<Moon className="w-4 h-4 text-purple-500" />}
          label="Dark Mode"
          description="Switch to dark theme"
          enabled={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
        />
        <SettingToggle
          icon={<Radio className="w-4 h-4 text-red-500" />}
          label="Match Alerts"
          description="Alerts when match starts"
          enabled={matchAlerts}
          onToggle={() => setMatchAlerts(!matchAlerts)}
        />
        <SettingToggle
          icon={<RefreshCw className="w-4 h-4 text-green-500" />}
          label="Auto Refresh"
          description="Auto-refresh scores every 10s"
          enabled={autoRefresh}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Privacy & Security</span>
        </div>
        <div className="space-y-2">
          <button className="w-full text-left py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            Clear Cache
          </button>
          <button className="w-full text-left py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            Reset Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ icon, label, description, enabled, onToggle }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{label}</p>
          <p className="text-[10px] text-gray-400">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-10 h-6 rounded-full transition-all relative ${enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${enabled ? 'left-4.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

/* ===== ABOUT DIALOG ===== */
function AboutDialog() {
  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-blue-500" />
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">About CricPoint</h2>
      </div>

      {/* App Logo & Info */}
      <div className="flex flex-col items-center py-4">
        <img src="/cricpoint-logo-dashboard.png" alt="CricPoint" className="w-20 h-20 object-contain mb-3" />
        <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">
          Cric<span className="text-green-500">Point</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Live Cricket Scores</p>
            <p className="text-[10px] text-gray-400">Real-time scores from matches around the world</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <Globe className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">ICC Rankings</p>
            <p className="text-[10px] text-gray-400">Team & player rankings across all formats</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <HelpCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">AI Cricket Assistant</p>
            <p className="text-[10px] text-gray-400">Ask anything about cricket with our AI chat</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-center">
        <p className="text-[10px] text-gray-400">Made with ❤️ for Cricket Fans</p>
        <p className="text-[9px] text-gray-300 dark:text-gray-600 mt-1">© 2026 CricPoint. All rights reserved.</p>
      </div>
    </div>
  );
}
