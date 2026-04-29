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
    // Use CricAPI match_info to construct over summary from score data
    const response = await fetch(`${CRICAPI_BASE}/match_info?apikey=${CRICAPI_KEY}&id=${matchId}`, {
      next: { revalidate: 30 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data) {
        const m = data.data;
        const scoreArr = m.score || [];
        const teamInfo = m.teamInfo || [];

        // Build over summaries from available score data
        const overs: Array<{ overNum: number; runs: number; wickets: number; summary: string }> = [];

        scoreArr.forEach((s: { inning: string; r: number; w: number; o: number }, i: number) => {
          const tInfo = teamInfo[i] || {};
          const teamName = tInfo.shortname || tInfo.name || `Team ${i + 1}`;
          overs.push({
            overNum: Math.ceil(s.o || 0),
            runs: s.r || 0,
            wickets: s.w || 0,
            summary: `${teamName} inning: ${s.r}/${s.w} in ${s.o} overs`,
          });
        });

        return NextResponse.json({
          matchId,
          overs,
          source: "cricapi",
        });
      }
    }
  } catch (error) {
    console.error("Overs API error:", error);
  }

  return NextResponse.json({ matchId, overs: [], source: "unavailable" });
}
