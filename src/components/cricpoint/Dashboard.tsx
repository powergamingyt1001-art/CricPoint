'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, Radio, Heart, MessageCircle, Share2, Clock, ArrowUp, ChevronDown, MapPin, Send } from 'lucide-react';
import { useCricPointStore, type MatchBasic } from '@/store/cricpoint-store';
import MatchSlider from './MatchSlider';
import PinSection from './PinSection';
import PointTable from './PointTable';
import BottomNav from './BottomNav';
import AIChat from './AIChat';

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

const MOCK_POLLS = [
  { id: 'p1', question: 'Who will win the India vs Australia 3rd ODI?', team1: 'India', team1Flag: '🇮🇳', team2: 'Australia', team2Flag: '🇦🇺', team1Percent: 67, team2Percent: 33, totalVotes: 12450 },
  { id: 'p2', question: 'Will Kohli score a century today?', team1: 'Yes', team1Flag: '✅', team2: 'No', team2Flag: '❌', team1Percent: 72, team2Percent: 28, totalVotes: 8932 },
  { id: 'p3', question: 'Who is the best T20 captain?', team1: 'Rohit', team1Flag: '🇮🇳', team2: 'Buttler', team2Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team1Percent: 58, team2Percent: 42, totalVotes: 5621 },
  { id: 'p4', question: 'Which team will win IPL 2026?', team1: 'CSK', team1Flag: '🦁', team2: 'MI', team2Flag: '🏏', team1Percent: 45, team2Percent: 55, totalVotes: 15600 },
  { id: 'p5', question: 'Best fast bowler in the world right now?', team1: 'Bumrah', team1Flag: '🇮🇳', team2: 'Starc', team2Flag: '🇦🇺', team1Percent: 61, team2Percent: 39, totalVotes: 9870 },
  { id: 'p6', question: 'Who will win the Ashes 2026?', team1: 'England', team1Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'Australia', team2Flag: '🇦🇺', team1Percent: 44, team2Percent: 56, totalVotes: 7230 },
  { id: 'p7', question: 'Should DRS be limited to 2 per innings?', team1: 'Yes', team1Flag: '👍', team2: 'No', team2Flag: '👎', team1Percent: 38, team2Percent: 62, totalVotes: 4560 },
  { id: 'p8', question: 'Best all-rounder in ODI cricket?', team1: 'Jadeja', team1Flag: '🇮🇳', team2: 'Stokes', team2Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team1Percent: 52, team2Percent: 48, totalVotes: 6340 },
];

function AdBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-3 text-center border border-yellow-200 dark:border-gray-600">
      <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Advertisement</p>
      <div className="h-14 bg-yellow-100/50 dark:bg-gray-600/50 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-xs font-medium">📢 Ad Banner</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { activeTab, selectMatch, matchPinned, matchFilter, setMatchFilter } = useCricPointStore();
  const [matches, setMatches] = useState<MatchBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
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
    const interval = setInterval(fetchMatches, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [fetchMatches]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

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

  const liveMatches = matches.filter(m => m.isLive);
  const completedMatches = matches.filter(m => !m.isLive);
  const upcomingMatches = matches.filter(m => !m.isLive && m.status && m.status.toLowerCase().includes('yet'));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Premium Header - Logo circle + Name */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-2 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Circle Logo */}
            <div className="w-11 h-11 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-500 overflow-hidden">
              <img src="/cricpoint-logo-dashboard.png" alt="CricPoint" className="w-8 h-8 object-contain" />
            </div>
            {/* Name next to logo */}
            <div>
              <h1 className="text-base font-black text-gray-800 dark:text-gray-200 leading-tight">
                Cric<span className="text-green-600 dark:text-green-400">Point</span>
              </h1>
              <p className="text-[9px] text-gray-400 font-medium">Live Cricket Score</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {liveMatches.length > 0 && (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                <Radio className="w-2.5 h-2.5 text-red-500" />
                <span className="text-[9px] font-bold text-red-500">{liveMatches.length} LIVE</span>
              </div>
            )}
            <button onClick={handleRefresh} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Pin overlay - compact pill */}
      {matchPinned && <PinSection matches={matches} />}

      {/* Main Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-16" style={{ maxHeight: 'calc(100vh - 52px)' }}>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="pt-3">
            <MatchSlider matches={matches} onSelectMatch={(m) => selectMatch(m.id, m)} />

            {/* Green Box: Completed Matches */}
            <div className="mx-5 mt-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-500 dark:border-green-600 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <h2 className="text-xs font-bold text-green-700 dark:text-green-300">Completed Matches</h2>
              </div>
              <div className="space-y-1.5">
                {completedMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => selectMatch(match.id, match)}
                    className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-2.5 border border-green-200 dark:border-green-800/50 hover:shadow-sm transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{match.team1Flag}</span>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{match.team1Short}</span>
                        <span className="text-[9px] text-gray-400">vs</span>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{match.team2Short}</span>
                        <span className="text-xs">{match.team2Flag}</span>
                      </div>
                      <span className="text-[9px] text-green-600 dark:text-green-400 font-medium max-w-[120px] truncate">{match.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Down Arrow - Swipe to reveal posts */}
            <div className="flex flex-col items-center py-3">
              <button
                onClick={() => setShowPosts(!showPosts)}
                className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-green-500 transition-colors"
              >
                <span className="text-[10px] font-medium">{showPosts ? 'Hide Posts' : 'Swipe for Posts'}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showPosts ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Posts Section - Revealed on swipe/click */}
            {showPosts && (
              <div className="px-5 pb-4 space-y-4">
                <h2 className="text-xs font-bold text-gray-800 dark:text-gray-200">Latest Posts</h2>
                {MOCK_POSTS.map((post, idx) => (
                  <div key={post.id}>
                    <PostCard post={post} />
                    {(idx + 1) % 2 === 0 && <div className="mt-4"><AdBanner /></div>}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Footer */}
            <div className="px-6 pb-4 pt-3 text-center">
              <img src="/cricpoint-logo-dashboard.png" alt="CricPoint" className="w-8 h-8 object-contain mx-auto mb-1 opacity-30" />
              <p className="text-[9px] text-gray-400">CricPoint v1.0</p>
            </div>
          </div>
        )}

        {/* MATCH TAB */}
        {activeTab === 'match' && (
          <div className="pt-3 px-5">
            {/* Two buttons: Upcoming | Complete */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMatchFilter('upcoming')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  matchFilter === 'upcoming'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setMatchFilter('complete')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  matchFilter === 'complete'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Complete
              </button>
            </div>

            {/* Match list based on filter */}
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

      {/* Scroll-to-top floating button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-18 right-4 z-30 w-9 h-9 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-all active:scale-90"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      <BottomNav />
    </div>
  );
}

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

function PostCard({ post }: { post: typeof MOCK_POSTS[0] }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{user: string; text: string}[]>([]);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { user: 'You', text: commentText.trim() }]);
    setCommentText('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <img src={post.image} alt={post.title} className="w-full h-36 object-cover" />
      <div className="p-3">
        <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">{post.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleLike} className="flex items-center gap-1 group">
              <Heart className={`w-3.5 h-3.5 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-red-400'}`} />
              <span className="text-[10px] text-gray-500">{likeCount.toLocaleString()}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 group">
              <MessageCircle className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-[10px] text-gray-500">{post.comments + comments.length}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400">{post.time}</span>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Share2 className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {comments.length > 0 && (
              <div className="max-h-24 overflow-y-auto space-y-1.5 mb-2">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-1.5">
                    <span className="text-[10px] font-bold text-green-600">{c.user}:</span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">{c.text}</span>
                  </div>
                ))}
              </div>
            )}
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

function PollsSection() {
  const [votes, setVotes] = useState<Record<string, string | null>>({});

  const handleVote = (pollId: string, team: string) => {
    if (votes[pollId]) return;
    setVotes(prev => ({ ...prev, [pollId]: team }));
  };

  return (
    <div className="px-5 pt-3 pb-4 space-y-3">
      <h2 className="text-xs font-bold text-gray-800 dark:text-gray-200">🔥 Match Polls</h2>
      {MOCK_POLLS.map((poll) => {
        const voted = votes[poll.id];
        return (
          <div key={poll.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3">
            <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-2.5">{poll.question}</p>
            <div className="space-y-1.5">
              <button
                onClick={() => handleVote(poll.id, 'team1')}
                disabled={!!voted}
                className={`w-full relative overflow-hidden rounded-xl p-2.5 text-left transition-all ${
                  voted === 'team1' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                  : voted ? 'bg-gray-50 dark:bg-gray-700/50'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/10'
                }`}
              >
                {voted && <div className="absolute left-0 top-0 bottom-0 bg-green-200/30 dark:bg-green-800/20" style={{ width: `${poll.team1Percent}%` }} />}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{poll.team1Flag}</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{poll.team1}</span>
                  </div>
                  {voted && <span className="text-[10px] font-bold text-green-600">{poll.team1Percent}%</span>}
                </div>
              </button>
              <button
                onClick={() => handleVote(poll.id, 'team2')}
                disabled={!!voted}
                className={`w-full relative overflow-hidden rounded-xl p-2.5 text-left transition-all ${
                  voted === 'team2' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                  : voted ? 'bg-gray-50 dark:bg-gray-700/50'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/10'
                }`}
              >
                {voted && <div className="absolute left-0 top-0 bottom-0 bg-green-200/30 dark:bg-green-800/20" style={{ width: `${poll.team2Percent}%` }} />}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{poll.team2Flag}</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{poll.team2}</span>
                  </div>
                  {voted && <span className="text-[10px] font-bold text-green-600">{poll.team2Percent}%</span>}
                </div>
              </button>
            </div>
            {voted && <p className="text-[9px] text-gray-400 mt-1.5 text-center">{poll.totalVotes.toLocaleString()} votes • Thanks for voting!</p>}
          </div>
        );
      })}
    </div>
  );
}
