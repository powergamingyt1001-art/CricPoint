import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const CRICAPI_KEY = "a79518cb-8dbe-4d52-aacc-d51ff871a87d";
const CRICAPI_BASE = "https://api.cricapi.com/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchid");
  const team1 = searchParams.get("team1") || "";
  const team2 = searchParams.get("team2") || "";

  if (!matchId) {
    return NextResponse.json({ error: "matchid is required" }, { status: 400 });
  }

  try {
    // First try CricAPI match_info (has score data)
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

  // Fallback: use z-ai-web-dev-sdk
  try {
    const zai = await ZAI.create();
    const searchQuery = `${team1} vs ${team2} scorecard cricket`.trim();
    const searchResults = await zai.functions.invoke('web_search', {
      query: searchQuery || 'cricket scorecard today',
      num: 5,
    });

    const matchUrl = searchResults?.find((r: { host_name: string }) =>
      r.host_name.includes('cricbuzz') || r.host_name.includes('espncricinfo')
    )?.url;

    if (matchUrl) {
      const pageData = await zai.functions.invoke('page_reader', { url: matchUrl });
      if (pageData?.data?.html) {
        const text = pageData.data.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const llmResponse = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Extract cricket scorecard data. Return JSON: {"innings":[{"team":"...","teamShort":"...","totalRuns":0,"totalWickets":0,"totalOvers":"0.0","batting":[{"name":"...","runs":0,"balls":0,"fours":0,"sixes":0,"strikeRate":0,"dismissal":"..."}],"bowling":[{"name":"...","overs":"0","runs":0,"wickets":0,"economy":0}]}]}. Return ONLY valid JSON.`
            },
            { role: 'user', content: `Extract scorecard from:\n\n${text.substring(0, 4000)}` }
          ],
          thinking: { type: 'disabled' },
        });
        const content = llmResponse.choices?.[0]?.message?.content || '{}';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const scorecard = JSON.parse(jsonMatch[0]);
          scorecard.matchId = matchId;
          scorecard.source = "ai";
          return NextResponse.json(scorecard);
        }
      }
    }
  } catch (error) {
    console.error("Scorecard AI fallback error:", error);
  }

  return NextResponse.json({ matchId, innings: [], source: "mock" });
}
