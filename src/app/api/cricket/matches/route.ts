import { NextResponse } from "next/server";

const CRICAPI_KEY = "a79518cb-8dbe-4d52-aacc-d51ff871a87d";
const CRICAPI_BASE = "https://api.cricapi.com/v1";

// Team flag mapping
const TEAM_FLAGS: Record<string, string> = {
  "India": "🇮🇳", "Australia": "🇦🇺", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "South Africa": "🇿🇦",
  "New Zealand": "🇳🇿", "Pakistan": "🇵🇰", "Sri Lanka": "🇱🇰", "Bangladesh": "🇧🇩",
  "West Indies": "🏝️", "Afghanistan": "🇦🇫", "Ireland": "🇮🇪", "Zimbabwe": "🇿🇼",
  "Netherlands": "🇳🇱", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Nepal": "🇳🇵", "Oman": "🇴🇲",
  "United Arab Emirates": "🇦🇪", "Mumbai Indians": "🔵", "Chennai Super Kings": "🟡",
  "Royal Challengers Bengaluru": "🔴", "Kolkata Knight Riders": "🟣",
  "Delhi Capitals": "🔷", "Gujarat Titans": "🟠", "Punjab Kings": "🔴",
  "Lucknow Super Giants": "💚", "Rajasthan Royals": "💗", "Sunrisers Hyderabad": "🟧",
  "Multan Sultans": "🟢", "Hyderabad Kingsmen": "🔵", "Peshawar Zalmi": "🟡",
  "Islamabad United": "🔴", "Karachi Kings": "🔵", "Quetta Gladiators": "🟣",
  "Lahore Qalandars": "🟢", "Rawalpindiz": "🔴",
};

interface MatchData {
  id: string;
  team1: string;
  team2: string;
  team1Short: string;
  team2Short: string;
  team1Score: string;
  team2Score: string;
  status: string;
  matchType: string;
  venue: string;
  isLive: boolean;
  team1Flag: string;
  team2Flag: string;
  team1Img?: string;
  team2Img?: string;
  currentOver?: string;
  battingTeam?: string;
  matchStarted: boolean;
  matchEnded: boolean;
  tossWinner?: string;
  tossChoice?: string;
  date: string;
}

// Cache for match data (30 second TTL)
let cachedMatches: MatchData[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 30000;

function getFlag(teamName: string): string {
  return TEAM_FLAGS[teamName] || "🏏";
}

function getShortName(teamInfo: { name: string; shortname?: string }): string {
  if (teamInfo.shortname) return teamInfo.shortname;
  const name = teamInfo.name || "";
  return name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
}

function parseScore(scoreArr: Array<{ inning: string; r: number; w: number; o: number }>): { team1Score: string; team2Score: string; battingTeam: string } {
  let team1Score = "";
  let team2Score = "";
  let battingTeam = "";

  if (scoreArr && scoreArr.length > 0) {
    for (const s of scoreArr) {
      const scoreStr = `${s.r}/${s.w} (${s.o})`;
      if (!team1Score) {
        team1Score = scoreStr;
      } else if (!team2Score) {
        team2Score = scoreStr;
      }
    }
  }

  return { team1Score, team2Score, battingTeam };
}

// Filter priority: IPL > PSL > International > Others
function getMatchPriority(m: { name: string; matchType?: string }): number {
  const name = m.name?.toLowerCase() || "";
  if (name.includes("indian premier league") || name.includes("ipl")) return 100;
  if (name.includes("pakistan super league") || name.includes("psl")) return 90;
  if (name.includes("champions trophy") || name.includes("world cup")) return 80;
  if (name.includes("t20i") || name.includes("odi") || name.includes("test")) return 70;
  if (name.includes("women")) return 30;
  return 50;
}

async function fetchMatchesFromCricAPI(): Promise<MatchData[]> {
  try {
    const response = await fetch(`${CRICAPI_BASE}/currentMatches?apikey=${CRICAPI_KEY}&offset=0`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`CricAPI error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "success" || !data.data) {
      throw new Error(`CricAPI status: ${data.status}, reason: ${data.reason}`);
    }

    const matches: MatchData[] = data.data
      .map((m: Record<string, unknown>) => {
        const teamInfo = (m.teamInfo || []) as Array<{ name: string; shortname?: string; img?: string }>;
        const team1Info = teamInfo[0] || { name: (m.teams as string[])?.[0] || "Team 1" };
        const team2Info = teamInfo[1] || { name: (m.teams as string[])?.[1] || "Team 2" };

        const { team1Score, team2Score, battingTeam } = parseScore(
          (m.score || []) as Array<{ inning: string; r: number; w: number; o: number }>
        );

        const status = (m.status as string) || "";
        const matchStarted = !!m.matchStarted;
        const matchEnded = !!m.matchEnded;
        const isLive = matchStarted && !matchEnded;

        // If scores are empty but match is live, try to extract from match_info
        // CricAPI sometimes doesn't return scores for live matches in the list endpoint
        let finalTeam1Score = team1Score;
        let finalTeam2Score = team2Score;

        // For live matches without scores, we'll do a quick fetch of match details
        // But only if score array was empty
        const scoreArr = (m.score || []) as Array<unknown>;

        // For live matches, fetch individual match_info to get scores
        // CricAPI doesn't always include scores in the list endpoint for live matches
        if (isLive && scoreArr.length === 0 && m.id) {
          // We'll fetch this asynchronously later - for now mark as needing fetch
        }

        return {
          id: m.id as string,
          team1: team1Info.name,
          team2: team2Info.name,
          team1Short: getShortName(team1Info),
          team2Short: getShortName(team2Info),
          team1Score: finalTeam1Score,
          team2Score: finalTeam2Score,
          status,
          matchType: m.name as string,
          venue: (m.venue as string) || "",
          isLive,
          team1Flag: getFlag(team1Info.name),
          team2Flag: getFlag(team2Info.name),
          team1Img: team1Info.img,
          team2Img: team2Info.img,
          currentOver: isLive ? "• • • • • •" : undefined,
          battingTeam,
          matchStarted,
          matchEnded,
          tossWinner: m.tossWinner as string,
          tossChoice: m.tossChoice as string,
          date: (m.date as string) || "",
        } as MatchData;
      })
      // Sort: Live first, then by priority, then by date
      .sort((a: MatchData, b: MatchData) => {
        // Live matches first
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        // Then by priority (IPL > PSL > International)
        const pA = getMatchPriority(a);
        const pB = getMatchPriority(b);
        if (pA !== pB) return pB - pA;
        // Then by date (newest first)
        return (b.date || "").localeCompare(a.date || "");
      });

    // For live matches without scores, fetch match_info to get scores
    const liveWithoutScores = matches.filter(m => m.isLive && !m.team1Score && !m.team2Score);
    if (liveWithoutScores.length > 0 && liveWithoutScores.length <= 5) {
      const scorePromises = liveWithoutScores.map(async (match) => {
        try {
          const infoRes = await fetch(`${CRICAPI_BASE}/match_info?apikey=${CRICAPI_KEY}&id=${match.id}`, {
            next: { revalidate: 30 },
          });
          if (infoRes.ok) {
            const infoData = await infoRes.json();
            if (infoData.status === "success" && infoData.data?.score?.length > 0) {
              const { team1Score, team2Score } = parseScore(infoData.data.score);
              if (team1Score) match.team1Score = team1Score;
              if (team2Score) match.team2Score = team2Score;
            }
          }
        } catch (e) {
          // Silently ignore - we'll just show without scores
        }
      });
      await Promise.all(scorePromises);
    }

    // Still no scores for live matches? Try CricBuzz web scraping as final fallback
    const stillNoScores = matches.filter(m => m.isLive && !m.team1Score && !m.team2Score);
    if (stillNoScores.length > 0) {
      try {
        const ZAI = (await import('z-ai-web-dev-sdk')).default;
        const zai = await ZAI.create();
        const pageData = await zai.functions.invoke('page_reader', {
          url: 'https://www.cricbuzz.com/cricket-match/live-scores',
        });
        if (pageData?.data?.html) {
          const textContent = pageData.data.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
          // Extract scores from CricBuzz text
          const scorePatterns = [
            /([A-Z]{2,4})\s+(\d+[-/]\d+)\s*\((\d+\.?\d*)\)/gi,
          ];
          const webScores: Record<string, string> = {};
          for (const pattern of scorePatterns) {
            let scoreMatch;
            while ((scoreMatch = pattern.exec(textContent)) !== null) {
              const teamShort = scoreMatch[1];
              const runs = scoreMatch[2].replace('-', '/');
              const overs = scoreMatch[3];
              webScores[teamShort] = `${runs} (${overs})`;
            }
          }
          // Apply to matches without scores
          for (const match of stillNoScores) {
            if (webScores[match.team1Short]) match.team1Score = webScores[match.team1Short];
            if (webScores[match.team2Short]) match.team2Score = webScores[match.team2Short];
          }
        }
      } catch (e) {
        // Silently ignore
      }
    }

    return matches;
  } catch (error) {
    console.error("CricAPI fetch error:", error);
    return [];
  }
}

// Fallback mock data
const MOCK_MATCHES: MatchData[] = [
  {
    id: "mock_1", team1: "Mumbai Indians", team2: "Sunrisers Hyderabad", team1Short: "MI", team2Short: "SRH",
    team1Score: "233/5 (20)", team2Score: "110/4 (12)", status: "SRH need 124 runs", matchType: "41st Match, IPL 2026",
    venue: "Wankhede Stadium, Mumbai", isLive: true, team1Flag: "🔵", team2Flag: "🟧",
    currentOver: "• • • • • •", battingTeam: "SRH", matchStarted: true, matchEnded: false, date: "2026-04-29",
  },
];

export async function GET() {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedMatches.length > 0 && (now - cacheTimestamp) < CACHE_TTL) {
      return NextResponse.json({ matches: cachedMatches, source: "cache" });
    }

    // Fetch from CricAPI
    const realMatches = await fetchMatchesFromCricAPI();

    if (realMatches.length > 0) {
      cachedMatches = realMatches;
      cacheTimestamp = Date.now();
      return NextResponse.json({ matches: realMatches, source: "cricapi" });
    }

    // Fallback to mock
    return NextResponse.json({ matches: MOCK_MATCHES, source: "mock" });
  } catch (error) {
    console.error("Matches API error:", error);
    return NextResponse.json({ matches: cachedMatches.length > 0 ? cachedMatches : MOCK_MATCHES, source: "fallback" });
  }
}
