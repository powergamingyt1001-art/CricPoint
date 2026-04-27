const RAPIDAPI_KEY = "826c8e3e87mshfccd1d1cdcea77dp19fb1bjsn1ab67075fba9";
const RAPIDAPI_HOST = "free-cricbuzz-cricket-api.p.rapidapi.com";
const LIFETIME_FREE_KEY = "a79518cb-8dbe-4d52-aacc-d51ff871a87d";

const BASE_URL = `https://${RAPIDAPI_HOST}`;

async function fetchFromAPI(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Cricket API error:", error);
    return null;
  }
}

export async function getMatches() {
  return fetchFromAPI("/cricket-matches");
}

export async function getMatchInfo(matchId: string) {
  return fetchFromAPI("/cricket-match-info", { matchid: matchId });
}

export async function getMatchScorecard(matchId: string) {
  return fetchFromAPI("/cricket-match-scorecard", { matchid: matchId });
}

export async function getMatchCommentary(matchId: string) {
  return fetchFromAPI("/cricket-match-commentary", { matchid: matchId });
}

export async function getMatchOvers(matchId: string) {
  return fetchFromAPI("/cricket-match-overs", { matchid: matchId });
}

export { LIFETIME_FREE_KEY };
