import { NextResponse } from "next/server";

const CRICAPI_KEY = "a79518cb-8dbe-4d52-aacc-d51ff871a87d";
const CRICAPI_BASE = "https://api.cricapi.com/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchid");

  if (!matchId) {
    return NextResponse.json({ error: "matchid is required" }, { status: 400 });
  }

  try {
    // Use CricAPI match_info for scorecard data
    const response = await fetch(`${CRICAPI_BASE}/match_info?apikey=${CRICAPI_KEY}&id=${matchId}`, {
      next: { revalidate: 30 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data) {
        const m = data.data;
        const scoreArr = m.score || [];
        const teamInfo = m.teamInfo || [];

        const innings = scoreArr.map((s: { inning: string; r: number; w: number; o: number }, i: number) => {
          const tInfo = teamInfo[i] || {};
          return {
            id: i + 1,
            team: s.inning || tInfo.name || `Team ${i + 1}`,
            teamShort: tInfo.shortname || `T${i + 1}`,
            totalRuns: s.r || 0,
            totalWickets: s.w || 0,
            totalOvers: String(s.o || 0),
            batting: [],
            bowling: [],
          };
        });

        return NextResponse.json({
          matchId,
          innings,
          source: "cricapi",
        });
      }
    }
  } catch (error) {
    console.error("Scorecard API error:", error);
  }

  return NextResponse.json({ matchId, innings: [], source: "unavailable" });
}
