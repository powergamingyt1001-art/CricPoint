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
    // Use CricAPI match_info to construct commentary from status
    const response = await fetch(`${CRICAPI_BASE}/match_info?apikey=${CRICAPI_KEY}&id=${matchId}`, {
      next: { revalidate: 30 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data) {
        const m = data.data;
        const status = m.status || "";
        const scoreArr = m.score || [];
        const teamInfo = m.teamInfo || [];

        // Build commentary entries from available data
        const commentary: Array<{ over: string; text: string; runs: number; type: string }> = [];

        // Add match status as main commentary
        if (status) {
          commentary.push({
            over: "",
            text: status,
            runs: 0,
            type: "status",
          });
        }

        // Add score summary for each inning
        scoreArr.forEach((s: { inning: string; r: number; w: number; o: number }, i: number) => {
          const tInfo = teamInfo[i] || {};
          const teamName = tInfo.shortname || tInfo.name || `Team ${i + 1}`;
          commentary.push({
            over: String(s.o || 0),
            text: `${teamName}: ${s.r}/${s.w} (${s.o} overs)`,
            runs: s.r || 0,
            type: "score",
          });
        });

        // Add toss info
        if (m.tossWinner && m.tossChoice) {
          commentary.unshift({
            over: "0.0",
            text: `${m.tossWinner} won the toss and elected to ${m.tossChoice}`,
            runs: 0,
            type: "info",
          });
        }

        return NextResponse.json({
          matchId,
          commentary,
          source: "cricapi",
        });
      }
    }
  } catch (error) {
    console.error("Commentary API error:", error);
  }

  return NextResponse.json({ matchId, commentary: [], source: "unavailable" });
}
