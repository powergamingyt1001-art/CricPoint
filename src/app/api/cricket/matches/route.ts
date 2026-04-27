import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "826c8e3e87mshfccd1d1cdcea77dp19fb1bjsn1ab67075fba9";
const RAPIDAPI_HOST = "free-cricbuzz-cricket-api.p.rapidapi.com";

// Fallback mock data for when API is unavailable
const MOCK_MATCHES = [
  {
    id: "102040",
    team1: "India",
    team2: "Australia",
    team1Short: "IND",
    team2Short: "AUS",
    team1Score: "287/4 (42.3)",
    team2Score: "Yet to bat",
    status: "LIVE",
    matchType: "3rd ODI",
    venue: "Wankhede Stadium, Mumbai",
    isLive: true,
    team1Flag: "🇮🇳",
    team2Flag: "🇦🇺",
    currentOver: "1 0 4 0 6 1",
    battingTeam: "IND",
  },
  {
    id: "102041",
    team1: "England",
    team2: "South Africa",
    team1Short: "ENG",
    team2Short: "SA",
    team1Score: "245/7 (50.0)",
    team2Score: "198/10 (43.2)",
    status: "ENG won by 47 runs",
    matchType: "2nd T20I",
    venue: "Lord's, London",
    isLive: false,
    team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    team2Flag: "🇿🇦",
  },
  {
    id: "102042",
    team1: "Pakistan",
    team2: "New Zealand",
    team1Short: "PAK",
    team2Short: "NZ",
    team1Score: "156/3 (28.4)",
    team2Score: "",
    status: "LIVE",
    matchType: "1st Test, Day 2",
    venue: "Gaddafi Stadium, Lahore",
    isLive: true,
    team1Flag: "🇵🇰",
    team2Flag: "🇳🇿",
    currentOver: "0 2 1 0 0 3",
    battingTeam: "PAK",
  },
  {
    id: "102043",
    team1: "Sri Lanka",
    team2: "Bangladesh",
    team1Short: "SL",
    team2Short: "BAN",
    team1Score: "312/6 (50.0)",
    team2Score: "278/10 (48.3)",
    status: "SL won by 34 runs",
    matchType: "4th ODI",
    venue: "R. Premadasa Stadium, Colombo",
    isLive: false,
    team1Flag: "🇱🇰",
    team2Flag: "🇧🇩",
  },
  {
    id: "102044",
    team1: "West Indies",
    team2: "Afghanistan",
    team1Short: "WI",
    team2Short: "AFG",
    team1Score: "78/2 (12.3)",
    team2Score: "",
    status: "LIVE",
    matchType: "1st T20I",
    venue: "Kensington Oval, Barbados",
    isLive: true,
    team1Flag: "🏝️",
    team2Flag: "🇦🇫",
    currentOver: "4 1 0 6 0 2",
    battingTeam: "WI",
  },
  {
    id: "102045",
    team1: "Mumbai Indians",
    team2: "Chennai Super Kings",
    team1Short: "MI",
    team2Short: "CSK",
    team1Score: "198/5 (20.0)",
    team2Score: "175/9 (20.0)",
    status: "MI won by 23 runs",
    matchType: "IPL 2026, Match 45",
    venue: "Wankhede Stadium, Mumbai",
    isLive: false,
    team1Flag: "🔵",
    team2Flag: "🟡",
  },
  {
    id: "102046",
    team1: "Royal Challengers",
    team2: "Kolkata Knight Riders",
    team1Short: "RCB",
    team2Short: "KKR",
    team1Score: "145/4 (16.2)",
    team2Score: "",
    status: "LIVE",
    matchType: "IPL 2026, Match 46",
    venue: "M. Chinnaswamy Stadium, Bangalore",
    isLive: true,
    team1Flag: "🔴",
    team2Flag: "🟣",
    currentOver: "1 1 4 0 6 0",
    battingTeam: "RCB",
  },
];

export async function GET() {
  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/cricket-matches`,
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
    console.error("API fetch error, using mock data:", error);
  }

  return NextResponse.json({ matches: MOCK_MATCHES, mock: true });
}
