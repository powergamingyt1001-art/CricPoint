import { NextResponse } from "next/server";

const RAPIDAPI_KEY = "826c8e3e87mshfccd1d1cdcea77dp19fb1bjsn1ab67075fba9";
const RAPIDAPI_HOST = "free-cricbuzz-cricket-api.p.rapidapi.com";

const MOCK_INFO: Record<string, object> = {
  "102040": {
    matchId: "102040",
    seriesName: "India Tour of Australia 2026",
    matchDesc: "3rd ODI",
    matchType: "ODI",
    venue: {
      name: "Wankhede Stadium",
      city: "Mumbai",
      capacity: "33,108",
      hostTeam: "India",
    },
    team1: {
      name: "India",
      shortName: "IND",
      flag: "🇮🇳",
      squad: [
        "Rohit Sharma (C)", "Shubman Gill", "Virat Kohli", "KL Rahul (WK)",
        "Suryakumar Yadav", "Hardik Pandya", "Ravindra Jadeja",
        "Ravichandran Ashwin", "Kuldeep Yadav", "Jasprit Bumrah", "Mohammed Siraj",
      ],
    },
    team2: {
      name: "Australia",
      shortName: "AUS",
      flag: "🇦🇺",
      squad: [
        "David Warner", "Travis Head", "Steve Smith (C)", "Marnus Labuschagne",
        "Glenn Maxwell", "Marcus Stoinis", "Alex Carey (WK)",
        "Pat Cummins", "Mitchell Starc", "Josh Hazlewood", "Adam Zampa",
      ],
    },
    status: "LIVE",
    toss: "India won the toss and elected to bat",
    umpires: "Richard Kettleborough, Nitin Menon",
    matchReferee: "Javagal Srinath",
    startTime: "2026-04-26T14:00:00Z",
  },
  "102046": {
    matchId: "102046",
    seriesName: "IPL 2026",
    matchDesc: "Match 46",
    matchType: "T20",
    venue: {
      name: "M. Chinnaswamy Stadium",
      city: "Bangalore",
      capacity: "40,000",
      hostTeam: "RCB",
    },
    team1: {
      name: "Royal Challengers Bengaluru",
      shortName: "RCB",
      flag: "🔴",
      squad: [
        "Virat Kohli", "Faf du Plessis (C)", "Glenn Maxwell", "Dinesh Karthik (WK)",
        "Rajat Patidar", "Cameron Green", "Wanindu Hasaranga",
        "Mohammed Siraj", "Yash Dayal", "Lockie Ferguson", " Karn Sharma",
      ],
    },
    team2: {
      name: "Kolkata Knight Riders",
      shortName: "KKR",
      flag: "🟣",
      squad: [
        "Shreyas Iyer (C)", "Phil Salt", "Venkatesh Iyer", "Nitish Rana",
        "Rinku Singh", "Andre Russell", "Sunil Narine",
        "Mitchell Starc", "Varun Chakravarthy", "Harshit Rana", "Umesh Yadav",
      ],
    },
    status: "LIVE",
    toss: "RCB won the toss and elected to bat",
    umpires: "Anil Chaudhary, KN Ananthapadmanabhan",
    matchReferee: "GK Gandhi",
    startTime: "2026-04-26T14:30:00Z",
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
      `https://${RAPIDAPI_HOST}/cricket-match-info?matchid=${matchId}`,
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

  const mock = MOCK_INFO[matchId] || MOCK_INFO["102040"];
  return NextResponse.json({ ...mock, mock: true });
}
