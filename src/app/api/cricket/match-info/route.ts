import { NextResponse } from "next/server";

const CRICAPI_KEY = "a79518cb-8dbe-4d52-aacc-d51ff871a87d";
const CRICAPI_BASE = "https://api.cricapi.com/v1";

// Team emoji flags
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
  "Lahore Qalandars": "🟢",
};

function getFlag(teamName: string): string {
  return TEAM_FLAGS[teamName] || "🏏";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchid");

  if (!matchId) {
    return NextResponse.json({ error: "matchid is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${CRICAPI_BASE}/match_info?apikey=${CRICAPI_KEY}&id=${matchId}`, {
      next: { revalidate: 30 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data) {
        const m = data.data;
        const teamInfo = m.teamInfo || [];
        const scoreArr = m.score || [];

        // Build score info for each team
        const team1Score = scoreArr[0] ? `${scoreArr[0].r}/${scoreArr[0].w} (${scoreArr[0].o})` : "";
        const team2Score = scoreArr[1] ? `${scoreArr[1].r}/${scoreArr[1].w} (${scoreArr[1].o})` : "";

        return NextResponse.json({
          matchId: m.id,
          seriesName: m.name,
          matchDesc: m.name,
          matchType: m.matchType?.toUpperCase() || "T20",
          venue: {
            name: m.venue || "",
            city: "",
          },
          team1: {
            name: teamInfo[0]?.name || m.teams?.[0] || "",
            shortName: teamInfo[0]?.shortname || "",
            flag: getFlag(teamInfo[0]?.name || ""),  // Emoji flag, NOT image URL
            img: teamInfo[0]?.img || "",  // Image URL separate
            score: team1Score,
            squad: [],
          },
          team2: {
            name: teamInfo[1]?.name || m.teams?.[1] || "",
            shortName: teamInfo[1]?.shortname || "",
            flag: getFlag(teamInfo[1]?.name || ""),  // Emoji flag, NOT image URL
            img: teamInfo[1]?.img || "",  // Image URL separate
            score: team2Score,
            squad: [],
          },
          score: scoreArr,
          status: m.status || "",
          toss: m.tossWinner && m.tossChoice
            ? `${m.tossWinner} won the toss and elected to ${m.tossChoice}`
            : "",
          matchStarted: m.matchStarted || false,
          matchEnded: m.matchEnded || false,
          date: m.date || "",
          dateTimeGMT: m.dateTimeGMT || "",
          source: "cricapi",
        });
      }
    }
  } catch (error) {
    console.error("Match info API error:", error);
  }

  return NextResponse.json({
    matchId,
    status: "Info not available",
    source: "mock",
  });
}
