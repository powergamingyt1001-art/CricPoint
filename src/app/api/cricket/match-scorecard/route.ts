import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "826c8e3e87mshfccd1d1cdcea77dp19fb1bjsn1ab67075fba9";
const RAPIDAPI_HOST = "free-cricbuzz-cricket-api.p.rapidapi.com";

function truncateName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length <= 1) return parts[0];
  return `${parts[0].charAt(0)}. ${parts[parts.length - 1]}`;
}

const MOCK_SCORECARD: Record<string, object> = {
  "102040": {
    matchId: "102040",
    innings: [
      {
        id: 1,
        team: "India",
        teamShort: "IND",
        flag: "🇮🇳",
        totalRuns: 287,
        totalWickets: 4,
        totalOvers: "42.3",
        extras: "12 (B 2, LB 5, W 3, NB 2)",
        batting: [
          { name: "Rohit Sharma", nameShort: "R. Sharma", runs: 45, balls: 52, fours: 5, sixes: 2, strikeRate: 86.5, dismissal: "c Smith b Cummins" },
          { name: "Shubman Gill", nameShort: "S. Gill", runs: 23, balls: 31, fours: 3, sixes: 0, strikeRate: 74.2, dismissal: "b Starc" },
          { name: "Virat Kohli", nameShort: "V. Kohli", runs: 102, balls: 115, fours: 8, sixes: 3, strikeRate: 88.7, dismissal: "not out" },
          { name: "KL Rahul", nameShort: "KL. Rahul", runs: 45, balls: 52, fours: 4, sixes: 1, strikeRate: 86.5, dismissal: "not out" },
          { name: "Suryakumar Yadav", nameShort: "S. Yadav", runs: 34, balls: 28, fours: 3, sixes: 2, strikeRate: 121.4, dismissal: "c Carey b Zampa" },
          { name: "Hardik Pandya", nameShort: "H. Pandya", runs: 18, balls: 12, fours: 1, sixes: 1, strikeRate: 150.0, dismissal: "run out" },
          { name: "Ravindra Jadeja", nameShort: "R. Jadeja", runs: 8, balls: 5, fours: 1, sixes: 0, strikeRate: 160.0, dismissal: "not out" },
        ],
        bowling: [
          { name: "Pat Cummins", nameShort: "P. Cummins", overs: "9", maidens: 1, runs: 52, wickets: 1, economy: 5.78 },
          { name: "Mitchell Starc", nameShort: "M. Starc", overs: "8.3", maidens: 0, runs: 68, wickets: 1, economy: 7.91 },
          { name: "Josh Hazlewood", nameShort: "J. Hazlewood", overs: "9", maidens: 1, runs: 48, wickets: 0, economy: 5.33 },
          { name: "Adam Zampa", nameShort: "A. Zampa", overs: "10", maidens: 0, runs: 65, wickets: 2, economy: 6.50 },
          { name: "Glenn Maxwell", nameShort: "G. Maxwell", overs: "6", maidens: 0, runs: 42, wickets: 0, economy: 7.00 },
        ],
      },
      {
        id: 2,
        team: "Australia",
        teamShort: "AUS",
        flag: "🇦🇺",
        totalRuns: 0,
        totalWickets: 0,
        totalOvers: "0.0",
        extras: "-",
        batting: [],
        bowling: [],
      },
    ],
  },
  "102046": {
    matchId: "102046",
    innings: [
      {
        id: 1,
        team: "Royal Challengers Bengaluru",
        teamShort: "RCB",
        flag: "🔴",
        totalRuns: 145,
        totalWickets: 4,
        totalOvers: "16.2",
        extras: "8 (B 1, LB 3, W 2, NB 2)",
        batting: [
          { name: "Virat Kohli", nameShort: "V. Kohli", runs: 56, balls: 38, fours: 6, sixes: 2, strikeRate: 147.4, dismissal: "c Russell b Starc" },
          { name: "Faf du Plessis", nameShort: "F. Plessis", runs: 32, balls: 24, fours: 4, sixes: 1, strikeRate: 133.3, dismissal: "b Narine" },
          { name: "Glenn Maxwell", nameShort: "G. Maxwell", runs: 18, balls: 12, fours: 1, sixes: 1, strikeRate: 150.0, dismissal: "c Iyer b Chakravarthy" },
          { name: "Rajat Patidar", nameShort: "R. Patidar", runs: 22, balls: 16, fours: 2, sixes: 1, strikeRate: 137.5, dismissal: "not out" },
          { name: "Dinesh Karthik", nameShort: "D. Karthik", runs: 8, balls: 4, fours: 1, sixes: 0, strikeRate: 200.0, dismissal: "not out" },
        ],
        bowling: [
          { name: "Mitchell Starc", nameShort: "M. Starc", overs: "4", maidens: 0, runs: 38, wickets: 1, economy: 9.50 },
          { name: "Sunil Narine", nameShort: "S. Narine", overs: "4", maidens: 0, runs: 28, wickets: 1, economy: 7.00 },
          { name: "Varun Chakravarthy", nameShort: "V. Chakravarthy", overs: "4", maidens: 0, runs: 32, wickets: 1, economy: 8.00 },
          { name: "Andre Russell", nameShort: "A. Russell", overs: "3", maidens: 0, runs: 30, wickets: 1, economy: 10.00 },
          { name: "Harshit Rana", nameShort: "H. Rana", overs: "1.2", maidens: 0, runs: 12, wickets: 0, economy: 9.00 },
        ],
      },
      {
        id: 2,
        team: "Kolkata Knight Riders",
        teamShort: "KKR",
        flag: "🟣",
        totalRuns: 0,
        totalWickets: 0,
        totalOvers: "0.0",
        extras: "-",
        batting: [],
        bowling: [],
      },
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
      `https://${RAPIDAPI_HOST}/cricket-match-scorecard?matchid=${matchId}`,
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

  const mock = MOCK_SCORECARD[matchId] || MOCK_SCORECARD["102040"];
  return NextResponse.json({ ...mock, mock: true });
}
