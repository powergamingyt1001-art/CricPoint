import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const INAPPROPRIATE_PATTERNS = [
  /sex/i, /porn/i, /nude/i, /kill/i, /bomb/i, /terror/i, /drug/i,
  /gambl/i, /bet/i, /hate/i, /racis/i, /abuse/i, /violence/i,
  /suicide/i, /murder/i, /weapon/i, /illegal/i,
];

function isInappropriate(message: string): boolean {
  return INAPPROPRIATE_PATTERNS.some(pattern => pattern.test(message));
}

const SYSTEM_PROMPT = `You are CricPoint AI, a cricket expert assistant. You only answer questions related to cricket - matches, players, stats, rules, teams, tournaments, and cricket history. If someone asks about non-cricket topics, politely decline and redirect to cricket. Keep responses concise and informative. You can discuss cricket strategies, player performances, match predictions, and cricket trivia. Always be respectful and sportsmanlike.`;

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (isInappropriate(message)) {
      return NextResponse.json({
        response: "I can only discuss cricket-related topics. Please ask about cricket matches, players, stats, or tournaments! 🏏",
        flagged: true,
      });
    }

    const zai = await ZAI.create();

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
    });

    const aiResponse = response.choices?.[0]?.message?.content || "Sorry, I couldn't process your request. Please try again!";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
