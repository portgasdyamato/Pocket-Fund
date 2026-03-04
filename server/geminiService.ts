const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

if (!OPENROUTER_API_KEY) {
  console.warn(
    "OPENROUTER_API_KEY is not set. AI chat will fall back to a non-AI helper message.",
  );
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Ordered list of free models - tries each in sequence if rate-limited
const FREE_MODELS = [
  "google/gemma-3-27b-it:free",
  "google/gemma-3-12b-it:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-4b:free",
];

async function callAI(messages: any[]): Promise<any | null> {
  for (const model of FREE_MODELS) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Pocket Fund"
        },
        body: JSON.stringify({ model, messages }),
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        console.warn(`OpenRouter model ${model} failed:`, data?.error?.message?.substring(0, 100));
        continue; // Try next model
      }

      if (data?.choices?.[0]?.message?.content) {
        console.log(`OpenRouter: Success with model ${model}`);
        return data;
      }
    } catch (err) {
      console.error(`Error calling model ${model}:`, err);
    }
  }
  console.error("All OpenRouter models failed.");
  return null;
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

  // If the API key is missing, return a friendly fallback.
  if (!OPENROUTER_API_KEY) {
    return (
      "I'm your Financial Glow-Up coach, but my AI brain isn't connected yet.\n\n" +
      "Ask your developer to add a valid OPENROUTER_API_KEY to the server environment so I can give you fully personalized guidance. " +
      "For now, try starting with: **Track your daily spending for the next 7 days**, then we’ll spot quick wins to cut your ‘Icks’ and boost your stash."
    );
  }

  console.log(
    "Starting chat with AI Assistant... OpenRouter Key Status:",
    OPENROUTER_API_KEY ? `Present (Length: ${OPENROUTER_API_KEY.length})` : "Missing/Empty",
  );

  const response = await callAI([
    {
      role: "user",
      content: `${systemPrompt}\n\nUser question: ${message}`
    },
  ]);

  return response?.choices?.[0]?.message?.content || "I'm having a bit of trouble thinking right now. But remember: every ₹100 you save today is a step towards your freedom! What else can I help you with?";
}

export async function categorizePurchase(
  description: string,
  amount: number,
): Promise<{ category: string; tag: "Need" | "Want" | "Ick"; rationale: string }> {
  if (!OPENROUTER_API_KEY) {
    return {
      category: "Uncategorized",
      tag: "Want",
      rationale: "AI Categorization disabled (No API Key)",
    };
  }

  const prompt = `Categorize this purchase: "${description}" for ₹${amount}. 
  Context: Indian youth lifestyle (e.g., Zomato, Zepto, Cinema, Rent, SIP).
  Return JSON only: {"category": "string", "tag": "Need" | "Want" | "Ick", "rationale": "short sentence"}`;

  const response = await callAI([
    {
      role: "user",
      content: prompt,
    },
  ]);

  try {
    const text = response?.choices?.[0]?.message?.content || "";
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (err) {
    return {
      category: "Shopping",
      tag: "Want",
      rationale: "Quick guess based on spending pattern.",
    };
  }
}

export async function generateFinancialInsight(
  totalSpent: number,
  ickSpent: number,
  wantSpent: number,
  needSpent: number
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    return (
      "I'm currently offline, but here's a quick insight: " +
      "Every rupee saved from an 'Ick' is a rupee earned for your 'Glow-Up' fund! Keep tracking those expenses."
    );
  }

  const prompt = `Generate a short, motivational financial insight for a user with these stats:
- Total spent: ₹${totalSpent}
- Needs: ₹${needSpent}
- Wants: ₹${wantSpent}
- Icks (wasteful): ₹${ickSpent}

Provide a 2-3 sentence insight that's encouraging and actionable.`;

  const response = await callAI([
    {
      role: "user",
      content: prompt,
    },
  ]);

  const text = response?.choices?.[0]?.message?.content || null;

  return (
    text ||
    "Keep fighting those Icks! Every rupee saved gets you closer to your goals."
  );
}
