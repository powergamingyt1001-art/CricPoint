import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

// Team short name mapping
const TEAM_SHORT: Record<string, string> = {
  "India": "IND", "Australia": "AUS", "England": "ENG", "South Africa": "SA",
  "New Zealand": "NZ", "Pakistan": "PAK", "Sri Lanka": "SL", "Bangladesh": "BAN",
  "West Indies": "WI", "Afghanistan": "AFG", "Ireland": "IRE", "Zimbabwe": "ZIM",
  "Netherlands": "NED", "Scotland": "SCO", "Nepal": "NEP", "Oman": "OMA",
  "Mumbai Indians": "MI", "Chennai Super Kings": "CSK", "Royal Challengers Bengaluru": "RCB",
  "Kolkata Knight Riders": "KKR", "Delhi Capitals": "DC", "Gujarat Titans": "GT",
  "Punjab Kings": "PBKS", "Lucknow Super Giants": "LSG", "Rajasthan Royals": "RR",
  "Sunrisers Hyderabad": "SRH",
  "Multan Sultans": "MS", "Hyderabad Kingsmen": "HYDK",
  "Peshawar Zalmi": "PZ", "Islamabad United": "IU",
  "Karachi Kings": "KK", "Quetta Gladiators": "QG", "Lahore Qalandars": "LQ",
};

// Team flag mapping
const TEAM_FLAGS: Record<string, string> = {
  "India": "🇮🇳", "Australia": "🇦🇺", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "South Africa": "🇿🇦",
  "New Zealand": "🇳🇿", "Pakistan": "🇵🇰", "Sri Lanka": "🇱🇰", "Bangladesh": "🇧🇩",
  "West Indies": "🏝️", "Afghanistan": "🇦🇫", "Ireland": "🇮🇪", "Zimbabwe": "🇿🇼",
  "Netherlands": "🇳🇱", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Nepal": "🇳🇵", "Oman": "🇴🇲",
  "Mumbai Indians": "🔵", "Chennai Super Kings": "🟡", "Royal Challengers Bengaluru": "🔴",
  "Kolkata Knight Riders": "🟣", "Delhi Capitals": "🔷", "Gujarat Titans": "🟠",
  "Punjab Kings": "🔴", "Lucknow Super Giants": "💚", "Rajasthan Royals": "💗",
  "Sunrisers Hyderabad": "🟧",
  "Multan Sultans": "🟢", "Hyderabad Kingsmen": "🔵",
  "Peshawar Zalmi": "🟡", "Islamabad United": "🔴",
  "Karachi Kings": "🔵", "Quetta Gladiators": "🟣", "Lahore Qalandars": "🟢",
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
  currentOver?: string;
  battingTeam?: string;
}

// Cache for match data (30 second TTL)
let cachedMatches: MatchData[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 30000; // 30 seconds

function getShortName(teamName: string): string {
  return TEAM_SHORT[teamName] || teamName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
}

function getFlag(teamName: string): string {
  return TEAM_FLAGS[teamName] || "🏏";
}

function parseCricBuzzHTML(html: string): MatchData[] {
  const matches: MatchData[] = [];

  try {
    // Extract JSON-LD structured data (SportsEvent)
    const mainEntityMatch = html.match(/"mainEntity":\{"@type":"ItemList","itemListElement":\[(.*?)\]\}/s);
    if (!mainEntityMatch) return matches;

    const eventsJson = `[${mainEntityMatch[1]}]`;
    const events = JSON.parse(eventsJson);

    // Extract text content for scores
    const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

    // Score patterns from CricBuzz HTML:
    // "MI 110-2 (8.3)" or "NEP 155/7 (36.5 ov)" or "MS 50-3 (6.3)"
    const scorePatterns = [
      /([A-Z]{2,4})\s+(\d+[-/]\d+)\s*\((\d+\.?\d*)\s*ov\)/gi,
      /([A-Z]{2,4})\s+(\d+[-/]\d+)\s*\((\d+\.?\d*)\)/gi,
    ];
    const scoreMap: Record<string, { score: string; overs: string }> = {};
    for (const pattern of scorePatterns) {
      let scoreMatch;
      while ((scoreMatch = pattern.exec(textContent)) !== null) {
        const teamShort = scoreMatch[1];
        const runs = scoreMatch[2];
        const overs = scoreMatch[3];
        // Only store if we don't have it, or this has more specific data
        if (!scoreMap[teamShort]) {
          scoreMap[teamShort] = { score: `${runs.replace('-', '/')} (${overs})`, overs };
        }
      }
    }

    for (const event of events) {
      if (event["@type"] !== "SportsEvent") continue;

      const name = event.name || "";
      const competitors = event.competitor || [];
      const location = (event.location || "").replace(/,\s*$/, "");
      const eventStatus = (event.eventStatus || "").trim();

      if (competitors.length < 2) continue;

      const team1Name = competitors[0].name || "";
      const team2Name = competitors[1].name || "";

      const team1Short = getShortName(team1Name);
      const team2Short = getShortName(team2Name);

      // Get scores from our score map
      const team1ScoreData = scoreMap[team1Short];
      const team2ScoreData = scoreMap[team2Short];

      // Determine if live - match is live if toss happened and no winner yet
      const isLive = (eventStatus.toLowerCase().includes('opt to') ||
                     eventStatus.toLowerCase().includes('lead') ||
                     eventStatus.toLowerCase().includes('trail') ||
                     (team1ScoreData && !eventStatus.toLowerCase().includes('won') && !eventStatus.toLowerCase().includes('abandon'))) &&
                     !eventStatus.toLowerCase().includes('won by') &&
                     !eventStatus.toLowerCase().includes('lost by') &&
                     !eventStatus.toLowerCase().includes('draw') &&
                     !eventStatus.toLowerCase().includes('tied') &&
                     !eventStatus.toLowerCase().includes('abandon');

      // Determine batting team from status
      let battingTeam: string | undefined;
      if (isLive) {
        if (eventStatus.toLowerCase().includes(team1Name.toLowerCase()) && eventStatus.toLowerCase().includes('bat')) {
          battingTeam = team1Short;
        } else if (eventStatus.toLowerCase().includes(team2Name.toLowerCase()) && eventStatus.toLowerCase().includes('bat')) {
          battingTeam = team2Short;
        } else if (eventStatus.toLowerCase().includes(team1Name.toLowerCase()) && eventStatus.toLowerCase().includes('bowl')) {
          battingTeam = team2Short;
        } else if (eventStatus.toLowerCase().includes(team2Name.toLowerCase()) && eventStatus.toLowerCase().includes('bowl')) {
          battingTeam = team1Short;
        } else if (team1ScoreData && !team2ScoreData) {
          battingTeam = team1Short;
        } else {
          battingTeam = team1Short;
        }
      }

      const matchId = `live_${matches.length}_${team1Short}_${team2Short}`;

      matches.push({
        id: matchId,
        team1: team1Name,
        team2: team2Name,
        team1Short,
        team2Short,
        team1Score: team1ScoreData?.score || "",
        team2Score: team2ScoreData?.score || "",
        status: eventStatus,
        matchType: name,
        venue: location,
        isLive,
        team1Flag: getFlag(team1Name),
        team2Flag: getFlag(team2Name),
        currentOver: isLive ? "• • • • • •" : undefined,
        battingTeam,
      });
    }
  } catch (e) {
    console.error("Error parsing CricBuzz HTML:", e);
  }

  return matches;
}

// Fallback: Use web search + LLM to get match data
async function getMatchesFromWebSearch(): Promise<MatchData[]> {
  try {
    const zai = await ZAI.create();

    // Read the CricBuzz live scores page directly
    const pageData = await zai.functions.invoke('page_reader', {
      url: 'https://www.cricbuzz.com/cricket-match/live-scores',
    });

    if (pageData?.data?.html) {
      const parsedMatches = parseCricBuzzHTML(pageData.data.html);
      if (parsedMatches.length > 0) {
        // Also try to extract upcoming matches from the same page text
        const html = pageData.data.html;
        const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

        // Find upcoming matches from text (e.g., "Gujarat Titans vs Royal Challengers Bengaluru 42nd Match")
        const upcomingPattern = /((?:Mumbai|Chennai|Kolkata|Delhi|Gujarat|Punjab|Lucknow|Rajasthan|Sunrisers|Royal|Peshawar|Islamabad|Karachi|Quetta|Lahore|Multan|Hyderabad)\s+(?:Indians|Super|Knight|Capitals|Titans|Kings|Giants|Royals|Challengers|Zalmi|United|Kingsmen|Gladiators|Qalandars|Sultans|Bengaluru))\s+vs\s+((?:Mumbai|Chennai|Kolkata|Delhi|Gujarat|Punjab|Lucknow|Rajasthan|Sunrisers|Royal|Peshawar|Islamabad|Karachi|Quetta|Lahore|Multan|Hyderabad)\s+(?:Indians|Super|Knight|Capitals|Titans|Kings|Giants|Royals|Challengers|Zalmi|United|Kingsmen|Gladiators|Qalandars|Sultans|Bengaluru))\s+(\d+(?:st|nd|rd|th)\s+Match)/g;
        let upMatch;
        const existingShorts = new Set(parsedMatches.flatMap(m => [m.team1Short, m.team2Short]));
        while ((upMatch = upcomingPattern.exec(textContent)) !== null) {
          const team1Name = upMatch[1];
          const team2Name = upMatch[2];
          const matchDesc = upMatch[3];
          const t1s = getShortName(team1Name);
          const t2s = getShortName(team2Name);

          // Skip if already in our matches
          if (existingShorts.has(t1s) && existingShorts.has(t2s)) continue;

          parsedMatches.push({
            id: `upcoming_${parsedMatches.length}_${t1s}_${t2s}`,
            team1: team1Name,
            team2: team2Name,
            team1Short: t1s,
            team2Short: t2s,
            team1Score: "",
            team2Score: "",
            status: "Upcoming",
            matchType: matchDesc,
            venue: "",
            isLive: false,
            team1Flag: getFlag(team1Name),
            team2Flag: getFlag(team2Name),
          });
          existingShorts.add(t1s);
          existingShorts.add(t2s);
        }

        return parsedMatches;
      }
    }

    // Fallback: search + LLM
    const searchResults = await zai.functions.invoke('web_search', {
      query: 'live cricket score today match IPL PSL 2026',
      num: 10,
    });

    if (!searchResults || searchResults.length === 0) return [];

    // Try LLM extraction from snippets
    const snippets = searchResults
      .slice(0, 5)
      .map((r: { name: string; snippet: string }) => `${r.name}: ${r.snippet}`)
      .join('\n');

    const llmResponse = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a cricket data parser. Extract current live/recent cricket matches from the given text. Return a JSON array of matches with this exact format:
[{"team1":"Full Team Name","team2":"Full Team Name","team1Short":"3 letter code","team2Short":"3 letter code","team1Score":"123/4 (15.3)","team2Score":"98/7 (12.0)","status":"Live/Result text","matchType":"Match description","venue":"City","isLive":true}]
Only include real matches found in the text. Return ONLY the JSON array, nothing else.`
        },
        {
          role: 'user',
          content: `Extract cricket matches from these search results:\n\n${snippets}`
        }
      ],
      thinking: { type: 'disabled' },
    });

    const content = llmResponse.choices?.[0]?.message?.content || '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const llmMatches = JSON.parse(jsonMatch[0]);
    return llmMatches.map((m: Record<string, unknown>, i: number) => ({
      id: `search_${i}_${m.team1Short}_${m.team2Short}`,
      team1: m.team1 || "Team 1",
      team2: m.team2 || "Team 2",
      team1Short: m.team1Short || "T1",
      team2Short: m.team2Short || "T2",
      team1Score: m.team1Score || "",
      team2Score: m.team2Score || "",
      status: m.status || "",
      matchType: m.matchType || "",
      venue: m.venue || "",
      isLive: !!m.isLive,
      team1Flag: getFlag(m.team1 as string),
      team2Flag: getFlag(m.team2 as string),
      currentOver: m.isLive ? "• • • • • •" : undefined,
      battingTeam: undefined,
    }));
  } catch (error) {
    console.error("Web search match fetch error:", error);
    return [];
  }
}

// Mock data for fallback
const MOCK_MATCHES: MatchData[] = [
  {
    id: "mock_1", team1: "India", team2: "Australia", team1Short: "IND", team2Short: "AUS",
    team1Score: "287/4 (42.3)", team2Score: "Yet to bat", status: "LIVE", matchType: "3rd ODI",
    venue: "Wankhede Stadium, Mumbai", isLive: true, team1Flag: "🇮🇳", team2Flag: "🇦🇺",
    currentOver: "1 0 4 0 6 1", battingTeam: "IND",
  },
  {
    id: "mock_2", team1: "England", team2: "South Africa", team1Short: "ENG", team2Short: "SA",
    team1Score: "245/7 (50.0)", team2Score: "198/10 (43.2)", status: "ENG won by 47 runs", matchType: "2nd T20I",
    venue: "Lord's, London", isLive: false, team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team2Flag: "🇿🇦",
  },
  {
    id: "mock_3", team1: "Mumbai Indians", team2: "Chennai Super Kings", team1Short: "MI", team2Short: "CSK",
    team1Score: "198/5 (20.0)", team2Score: "175/9 (20.0)", status: "MI won by 23 runs", matchType: "IPL 2026, Match 45",
    venue: "Wankhede Stadium, Mumbai", isLive: false, team1Flag: "🔵", team2Flag: "🟡",
  },
];

export async function GET() {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedMatches.length > 0 && (now - cacheTimestamp) < CACHE_TTL) {
      return NextResponse.json({ matches: cachedMatches, source: "cache" });
    }

    // Try to get real matches from web
    const realMatches = await getMatchesFromWebSearch();

    if (realMatches.length > 0) {
      cachedMatches = realMatches;
      cacheTimestamp = Date.now();
      return NextResponse.json({ matches: realMatches, source: "live" });
    }

    // Fallback to mock data
    if (cachedMatches.length === 0) {
      cachedMatches = MOCK_MATCHES;
      cacheTimestamp = Date.now();
    }

    return NextResponse.json({ matches: cachedMatches, source: cachedMatches === MOCK_MATCHES ? "mock" : "cache" });
  } catch (error) {
    console.error("Matches API error:", error);
    return NextResponse.json({ matches: MOCK_MATCHES, source: "mock" });
  }
}
