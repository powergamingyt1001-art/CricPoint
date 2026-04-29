import { NextResponse } from "next/server";

const CRICAPI_KEY = "a79518cb-8dbe-4d52-aacc-d51ff871a87d";
const CRICAPI_BASE = "https://api.cricapi.com/v1";

// Cache for points table data (5 minute TTL - points don't change often)
let cachedPoints: Record<string, unknown> = {};
let cacheTimestamp = 0;
const CACHE_TTL = 300000;

// Known IPL series ID for 2026
const IPL_SERIES_ID = "87c62aac-bc3c-4738-ab93-19da0690488f";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seriesId = searchParams.get("seriesid") || IPL_SERIES_ID;

  try {
    // Check cache first
    const now = Date.now();
    if (cachedPoints[seriesId] && (now - cacheTimestamp) < CACHE_TTL) {
      return NextResponse.json({ points: cachedPoints[seriesId], source: "cache" });
    }

    const response = await fetch(`${CRICAPI_BASE}/series_points?apikey=${CRICAPI_KEY}&id=${seriesId}`, {
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data) {
        // Calculate points (2 for win, 1 for NR/tie, 0 for loss)
        const pointsTable = data.data.map((team: Record<string, unknown>, idx: number) => {
          const wins = Number(team.wins) || 0;
          const losses = Number(team.loss) || 0;
          const ties = Number(team.ties) || 0;
          const nr = Number(team.nr) || 0;
          const matches = Number(team.matches) || 0;
          const points = wins * 2 + ties * 1 + nr * 1;

          return {
            rank: idx + 1,
            team: team.teamname,
            shortName: team.shortname,
            img: team.img,
            matches,
            won: wins,
            lost: losses,
            tied: ties,
            noResult: nr,
            points,
            nrr: "—",
          };
        });

        // Sort by points (descending), then by wins
        pointsTable.sort((a: Record<string, number>, b: Record<string, number>) => {
          if (b.points !== a.points) return b.points - a.points;
          return b.won - a.won;
        });

        // Re-assign ranks after sorting
        pointsTable.forEach((team: Record<string, number>, idx: number) => {
          team.rank = idx + 1;
        });

        cachedPoints[seriesId] = pointsTable;
        cacheTimestamp = Date.now();

        return NextResponse.json({ points: pointsTable, source: "cricapi" });
      }
    }
  } catch (error) {
    console.error("Points table API error:", error);
  }

  // Return cached data if available
  if (cachedPoints[seriesId]) {
    return NextResponse.json({ points: cachedPoints[seriesId], source: "cache-error" });
  }

  return NextResponse.json({ points: [], source: "unavailable" });
}
