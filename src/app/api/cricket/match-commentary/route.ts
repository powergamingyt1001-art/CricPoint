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
    const searchQuery = `${team1} vs ${team2} ball by ball commentary cricket live`.trim();
    const searchResults = await zai.functions.invoke('web_search', {
      query: searchQuery || 'cricket commentary today live',
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
              content: `Extract recent ball-by-ball cricket commentary. Return JSON: {"commentary":[{"over":"0.1","text":"...","runs":0,"type":"normal/wicket/boundary/six"}]}. Return ONLY valid JSON with up to 20 recent balls.`
            },
            { role: 'user', content: `Extract commentary from:\n\n${text.substring(0, 3000)}` }
          ],
          thinking: { type: 'disabled' },
        });
        const content = llmResponse.choices?.[0]?.message?.content || '{}';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const commentary = JSON.parse(jsonMatch[0]);
          commentary.matchId = matchId;
          commentary.source = "ai";
          return NextResponse.json(commentary);
        }
      }
    }
  } catch (error) {
    console.error("Commentary API error:", error);
  }

  return NextResponse.json({ matchId, commentary: [], source: "mock" });
}
