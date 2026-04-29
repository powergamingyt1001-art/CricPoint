import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchid");
  const team1 = searchParams.get("team1") || "";
  const team2 = searchParams.get("team2") || "";

  if (!matchId) {
    return NextResponse.json({ error: "matchid is required" }, { status: 400 });
  }

  try {
    const zai = await ZAI.create();

    // Search for this specific match on CricBuzz
    const searchQuery = `${team1} vs ${team2} cricket match score today`.trim();
    const searchResults = await zai.functions.invoke('web_search', {
      query: searchQuery || 'live cricket score today',
      num: 5,
    });

    // Find a CricBuzz or ESPN match page
    const matchUrl = searchResults?.find((r: { host_name: string }) =>
      r.host_name.includes('cricbuzz') || r.host_name.includes('espncricinfo')
    )?.url;

    if (matchUrl) {
      const pageData = await zai.functions.invoke('page_reader', { url: matchUrl });

      if (pageData?.data?.html) {
        const text = pageData.data.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

        // Use LLM to extract match info
        const llmResponse = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a cricket match info extractor. Extract match details and return JSON with:
{"seriesName":"...","matchDesc":"...","matchType":"T20/ODI/Test","venue":{"name":"...","city":"..."},"team1":{"name":"...","shortName":"...","squad":["player1","player2"]},"team2":{"name":"...","shortName":"...","squad":["player1","player2"]},"status":"...","toss":"...","umpires":"..."}
Return ONLY valid JSON. Use empty arrays for squads if not found.`
            },
            {
              role: 'user',
              content: `Extract cricket match info from this page text (first 3000 chars):\n\n${text.substring(0, 3000)}`
            }
          ],
          thinking: { type: 'disabled' },
        });

        const content = llmResponse.choices?.[0]?.message?.content || '{}';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const matchInfo = JSON.parse(jsonMatch[0]);
          matchInfo.matchId = matchId;
          matchInfo.source = "live";
          return NextResponse.json(matchInfo);
        }
      }
    }
  } catch (error) {
    console.error("Match info API error:", error);
  }

  // Fallback mock data
  return NextResponse.json({
    matchId,
    seriesName: "Cricket Series 2026",
    matchDesc: "Match",
    matchType: "T20",
    venue: { name: "Cricket Stadium", city: "" },
    team1: { name: team1 || "Team 1", shortName: "T1", squad: [] },
    team2: { name: team2 || "Team 2", shortName: "T2", squad: [] },
    status: "Info not available",
    toss: "",
    umpires: "",
    source: "mock",
  });
}
