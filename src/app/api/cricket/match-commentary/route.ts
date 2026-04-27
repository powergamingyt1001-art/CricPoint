import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "826c8e3e87mshfccd1d1cdcea77dp19fb1bjsn1ab67075fba9";
const RAPIDAPI_HOST = "free-cricbuzz-cricket-api.p.rapidapi.com";

const MOCK_COMMENTARY: Record<string, object> = {
  "102040": {
    matchId: "102040",
    commentary: [
      { over: 42, ball: 3, text: "Kohli drives through covers for a single. 100 up for Kohli! What an innings!", highlight: true, runs: 1 },
      { over: 42, ball: 2, text: "Short ball from Cummins, Rahul pulls it to midwicket for no run.", runs: 0 },
      { over: 42, ball: 1, text: "Full toss outside off, Kohli flicks it to midwicket for a single.", runs: 1 },
      { over: 41, ball: 6, text: "SIX! Kohli launches Zampa over long-on! Magnificent shot!", highlight: true, runs: 6 },
      { over: 41, ball: 5, text: "Tossed up outside off, Kohli drives to long-off for no run.", runs: 0 },
      { over: 41, ball: 4, text: "FOUR! Rahul cuts hard past point. Brilliant placement!", highlight: true, runs: 4 },
      { over: 41, ball: 3, text: "Googly from Zampa, Rahul reads it well and defends.", runs: 0 },
      { over: 41, ball: 2, text: "Short and wide, Kohli cuts to deep point for a single.", runs: 1 },
      { over: 41, ball: 1, text: "Full on middle, Rahul drives to mid-on. No run.", runs: 0 },
      { over: 40, ball: 6, text: "Yorker from Starc! Jadeja just manages to dig it out.", runs: 0 },
      { over: 40, ball: 5, text: "FOUR! Jadeja edges and it flies past the keeper! Lucky boundary.", highlight: true, runs: 4 },
      { over: 40, ball: 4, text: "Length ball outside off, Jadeja drives to cover for a single.", runs: 1 },
      { over: 40, ball: 3, text: "Short ball, Kohli pulls to fine leg for a single.", runs: 1 },
      { over: 40, ball: 2, text: "Good length on off stump, Kohli defends solidly.", runs: 0 },
      { over: 40, ball: 1, text: "Full and swinging in, Kohli flicks to midwicket for a single.", runs: 1 },
      { over: 39, ball: 6, text: "SIX! Kohli goes inside out over extra cover! What a shot!", highlight: true, runs: 6 },
      { over: 39, ball: 5, text: "Tossed up on middle, Kohli sweeps to deep square for a single.", runs: 1 },
      { over: 39, ball: 4, text: "Flat and quick outside off, Jadeja cuts to point. No run.", runs: 0 },
      { over: 39, ball: 3, text: "FOUR! Jadeja steps out and lofts over mid-off! Great timing!", highlight: true, runs: 4 },
      { over: 39, ball: 2, text: "Quicker one from Maxwell, Jadeja defends on back foot.", runs: 0 },
    ],
  },
  "102046": {
    matchId: "102046",
    commentary: [
      { over: 16, ball: 2, text: "Patidar drives through covers for a single. Good running!", runs: 1 },
      { over: 16, ball: 1, text: "Full toss from Russell, Karthik flicks to fine leg for a single.", runs: 1 },
      { over: 15, ball: 6, text: "SIX! Patidar launches Narine over long-off! Massive hit!", highlight: true, runs: 6 },
      { over: 15, ball: 5, text: "Carrom ball, Patidar reads it and defends.", runs: 0 },
      { over: 15, ball: 4, text: "FOUR! Patidar reverse sweeps past short third man!", highlight: true, runs: 4 },
      { over: 15, ball: 3, text: "Flat on middle, Patidar works to midwicket for no run.", runs: 0 },
      { over: 15, ball: 2, text: "Tossed up outside off, drives to cover for a single.", runs: 1 },
      { over: 15, ball: 1, text: "Short and wide, Patidar cuts hard but straight to point.", runs: 0 },
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
      `https://${RAPIDAPI_HOST}/cricket-match-commentary?matchid=${matchId}`,
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

  const mock = MOCK_COMMENTARY[matchId] || MOCK_COMMENTARY["102040"];
  return NextResponse.json({ ...mock, mock: true });
}
