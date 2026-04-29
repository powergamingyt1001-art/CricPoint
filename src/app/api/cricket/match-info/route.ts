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
    const response = await fetch(`${CRICAPI_BASE}/match_info?apikey=${CRICAPI_KEY}&id=${matchId}`, {
      next: { revalidate: 30 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data) {
        const m = data.data;
        const teamInfo = m.teamInfo || [];

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
            flag: teamInfo[0]?.img || "",
            squad: [],
          },
          team2: {
            name: teamInfo[1]?.name || m.teams?.[1] || "",
            shortName: teamInfo[1]?.shortname || "",
            flag: teamInfo[1]?.img || "",
            squad: [],
          },
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
