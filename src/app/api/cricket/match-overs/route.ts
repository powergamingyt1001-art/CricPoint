import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "826c8e3e87mshfccd1d1cdcea77dp19fb1bjsn1ab67075fba9";
const RAPIDAPI_HOST = "free-cricbuzz-cricket-api.p.rapidapi.com";

const MOCK_OVERS: Record<string, object> = {
  "102040": {
    matchId: "102040",
    overs: [
      { over: 42, balls: [{ run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 1, type: "normal" }] },
      { over: 41, balls: [{ run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 4, type: "four" }, { run: 0, type: "normal" }, { run: 6, type: "six" }] },
      { over: 40, balls: [{ run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 1, type: "normal" }, { run: 4, type: "four" }, { run: 0, type: "normal" }] },
      { over: 39, balls: [{ run: 0, type: "normal" }, { run: 0, type: "normal" }, { run: 4, type: "four" }, { run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 6, type: "six" }] },
      { over: 38, balls: [{ run: 2, type: "normal" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 0, type: "wicket" }, { run: 1, type: "normal" }, { run: 4, type: "four" }] },
      { over: 37, balls: [{ run: 1, type: "normal" }, { run: 1, type: "normal" }, { run: 4, type: "four" }, { run: 0, type: "normal" }, { run: 6, type: "six" }, { run: 1, type: "normal" }] },
      { over: 36, balls: [{ run: 0, type: "normal" }, { run: 4, type: "four" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 2, type: "normal" }, { run: 1, type: "normal" }] },
      { over: 35, balls: [{ run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 0, type: "normal" }, { run: 6, type: "six" }, { run: 0, type: "normal" }, { run: 1, type: "normal" }] },
      { over: 34, balls: [{ run: 4, type: "four" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 2, type: "normal" }] },
      { over: 33, balls: [{ run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 4, type: "four" }, { run: 1, type: "normal" }, { run: 6, type: "six" }, { run: 0, type: "normal" }] },
      { over: 32, balls: [{ run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 0, type: "normal" }, { run: 4, type: "four" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }] },
      { over: 31, balls: [{ run: 6, type: "six" }, { run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 4, type: "four" }, { run: 1, type: "normal" }] },
      { over: 30, balls: [{ run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 2, type: "normal" }, { run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }] },
    ],
  },
  "102046": {
    matchId: "102046",
    overs: [
      { over: 16, balls: [{ run: 1, type: "normal" }, { run: 1, type: "normal" }] },
      { over: 15, balls: [{ run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 4, type: "four" }, { run: 0, type: "normal" }, { run: 6, type: "six" }] },
      { over: 14, balls: [{ run: 1, type: "normal" }, { run: 4, type: "four" }, { run: 0, type: "normal" }, { run: 6, type: "six" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }] },
      { over: 13, balls: [{ run: 0, type: "normal" }, { run: 2, type: "normal" }, { run: 1, type: "normal" }, { run: 0, type: "normal" }, { run: 4, type: "four" }, { run: 1, type: "normal" }] },
      { over: 12, balls: [{ run: 1, type: "normal" }, { run: 0, type: "wicket" }, { run: 4, type: "four" }, { run: 0, type: "normal" }, { run: 1, type: "normal" }, { run: 6, type: "six" }] },
    ],
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchid");

  if (!matchId) {
    return NextResponse.json({ error: "matchid is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/cricket-match-overs?matchid=${matchId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("API fetch error:", error);
  }

  const mock = MOCK_OVERS[matchId] || MOCK_OVERS["102040"];
  return NextResponse.json({ ...mock, mock: true });
}
