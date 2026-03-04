const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

if (!GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY is not set. AI chat will fall back to a non-AI helper message instead of calling Gemini.",
  );
}

// Use the public Gemini REST endpoint with Gemini 2.5 Flash.
// Docs: https://ai.google.dev/api/rest/v1beta/models/generateContent
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(requestBody: any): Promise<any | null> {
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      console.error("Gemini HTTP error:", res.status, await res.text());
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Gemini network/error calling API:", err);
    return null;
  }
}

export async function chatWithFinancialAssistant(
  message: string,
  context?: {
    userName?: string;
    totalStashed?: number;
    saveStreak?: number;
    ickAmount?: number;
  }
): Promise<string> {
  const systemPrompt = `You are the "Financial Glow-Up Coach" for the Pocket Fund app. Your mission is to help young adults in India level up their money game. 

Your tone:
- Encouraging, high-energy, and relatable (like a cool older sibling or mentor).
- Non-judgmental but firm about fighting "Spending Icks".
- Uses "Project-speak": Stash, Glow-Up, Icks, Wins, XP.

Your Vocabulary:
- Use "Spending Icks" instead of "impulse buying" or "wasteful spending".
- Use "Glow-Up" or "Leveling up" instead of "improving financial health".
- Use "Safety Vibe" or "Rainy Day Stash" instead of "emergency fund".
- Use "Money Moves" instead of "financial transactions" or "advice".
- Use "The 50/30/20 Budget Vibe" instead of "50/30/20 rule".

Your role:
- Help users understand where their money is going.
- Provide actionable "Money Moves" to save more.
- Celebrate their "Wins" and XP progress.
- Help them identify and fight their "Spending Icks".
- Keep it simple: No heavy finance talk.

Remember:
- Keep responses short, punchy, and emoji-friendly.
- Use rupee (₹) for all currency.
${context ? `\nUser Context:\n- Name: ${context.userName || "User"}\n- Total Stashed: ₹${context.totalStashed || 0}\n- Save Streak: ${context.saveStreak || 0} days\n- Recent Spending Icks: ₹${context.ickAmount || 0}` : ""}`;

  // If the API key is missing, return a friendly fallback instead of calling Gemini.
  if (!GEMINI_API_KEY) {
    return (
      "I'm your Financial Glow-Up coach, but my AI brain isn't connected yet.\n\n" +
      "Ask your developer to add a valid GEMINI_API_KEY to the server environment so I can give you fully personalized guidance. " +
      "For now, try starting with: **Track your daily spending for the next 7 days**, then we’ll spot quick wins to cut your ‘Icks’ and boost your stash."
    );
  }

  console.log(
    "Starting chat with AI Assistant... API Key Status:",
    GEMINI_API_KEY ? `Present (Length: ${GEMINI_API_KEY.length})` : "Missing/Empty",
  );

  const response = await callGemini({
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser question: ${message}` }],
      },
    ],
  });

  const text =
    response?.candidates?.[0]?.content?.parts
      ?.map((p: any) => (typeof p.text === "string" ? p.text : ""))
      .join("") ||
    response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    response?.text ||
    null;

  if (text) {
    return text;
  }

  // If Gemini fails or returns nothing, respond with a friendly fallback instead of erroring.
  return (
    "I'm having trouble reaching my AI brain right now, so I can't give a fully smart answer.\n\n" +
    "Quick starter tip: **Pick one small money habit to improve this week** – for example, cap food delivery to 2x a week or move ₹200/day to a stash account. " +
    "Once the AI connection is stable, I can help you plan deeper strategies based on your real numbers."
  );
}

export async function categorizePurchase(description: string, amount: number): Promise<{
  suggestedCategory: 'Need' | 'Want' | 'Ick';
  reasoning: string;
}> {
  try {
    const prompt = `Categorize this purchase:
Description: ${description}
Amount: ₹${amount}

Categories:
- Need: Essential expenses (rent, groceries, bills, transportation, medicine)
- Want: Non-essential but reasonable (dining out, entertainment, hobbies)
- Ick: Impulse buys, wasteful spending, unnecessary subscriptions

Respond with JSON only.`;

    const response = await callGemini({
      generationConfig: {
        response_mime_type: "application/json",
        response_schema: {
          type: "object",
          properties: {
            suggestedCategory: { type: "string", enum: ["Need", "Want", "Ick"] },
            reasoning: { type: "string" },
          },
          required: ["suggestedCategory", "reasoning"],
        },
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const rawJson =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || response?.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    throw new Error("Empty response from model");
  } catch (error) {
    return {
      suggestedCategory: "Want",
      reasoning: "Unable to categorize automatically. Please review.",
    };
  }
}

export async function generateFinancialInsight(
  totalSpent: number,
  ickSpent: number,
  wantSpent: number,
  needSpent: number
): Promise<string> {
  const prompt = `Generate a short, motivational financial insight for a user with these stats:
- Total spent: ₹${totalSpent}
- Needs: ₹${needSpent}
- Wants: ₹${wantSpent}
- Icks (wasteful): ₹${ickSpent}

Provide a 2-3 sentence insight that's encouraging and actionable.`;

  const response = await callGemini({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  const text =
    response?.candidates?.[0]?.content?.parts
      ?.map((p: any) => (typeof p.text === "string" ? p.text : ""))
      .join("") ||
    response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    response?.text ||
    null;

  return (
    text ||
    "Keep fighting those Icks! Every rupee saved gets you closer to your goals."
  );
}
