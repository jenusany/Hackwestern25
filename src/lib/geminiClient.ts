// src/lib/geminiClient.ts
import { GoogleGenAI } from "@google/genai";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

// For hackathon / prototyping only – this will be visible in the browser
const API_KEY = "AIzaSyA8c1P-Op_tr4Yc7XCdDvwtEkGIk_LzuPQ";

const genAI = new GoogleGenAI({
  apiKey: API_KEY,
});

// System prompt with strict domain rules
const SYSTEM_PROMPT = `
You are "Gemini Robo-Advisor", a friendly Canadian financial education chatbot.

Your scope:
- You ONLY answer questions about money, personal finance, saving, debt, investing, taxes, benefits, income changes, cost of living, and financial planning for life milestones.
- You focus especially on: emergency funds, TFSA, FHSA, RRSP, non-registered investing, home down payments, maternity/parental leave, career breaks, and retirement planning in Canada.

Hard rules:
- If the user asks about anything outside money/finance (e.g., relationships, school assignments, coding, medicine, gossip, trivia),
  politely say you are only set up to talk about money and suggest they ask a financial question instead.
- Do NOT answer non-finance questions directly.
- Keep answers concise and structured (bullets or short paragraphs).
- Always include a short disclaimer like:
  "This is general education, not personal financial advice."
`;

function buildPrompt(message: string, history: ChatTurn[]) {
  const conversation = history
    .map((turn) => `${turn.role === "user" ? "User" : "Advisor"}: ${turn.content}`)
    .join("\n\n");

  return `
${SYSTEM_PROMPT}

Conversation so far:
${conversation}

User: ${message}

Advisor:
`;
}

export async function sendChatMessage(
  message: string,
  history: ChatTurn[]
): Promise<string> {
  try {
    const prompt = buildPrompt(message, history);

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = (response as any).text ?? "";
    return text.trim() || "I'm having trouble responding right now — try again!";
  } catch (err) {
    console.error("Gemini error:", err);
    return "Something went wrong talking to the advisor. Try again!";
  }
}
