import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithFinancialAssistant(
  message: string,
  context?: {
    userName?: string;
    totalStashed?: number;
    saveStreak?: number;
    ickAmount?: number;
  }
): Promise<string> {
  const systemPrompt = `You are a friendly, motivational high level financial expert partner for "Pocket Fund" app designed for young adults in India. Your tone is encouraging, easily understandable, non-judgmental, and straightforward.

Your role:
- Help users understand their spending habits
- Provide financial advice and tips
- Celebrate their wins and progress
- Motivate them to fight their "Icks" (impulse buys)
- Explain financial concepts in simple terms

Remember:
- Use simple language, avoid heavy financial jargon
- Be positive and supportive
- Keep responses concise and actionable
- Use rupee (₹) for currency
${context ? `\nUser Context:\n- Name: ${context.userName || 'User'}\n- Total Stashed: ₹${context.totalStashed || 0}\n- Save Streak: ${context.saveStreak || 0} days\n- Recent Icks: ₹${context.ickAmount || 0}` : ''}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: message,
  });

  return response.text || "I'm here to help! Could you ask that again?";
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            suggestedCategory: { type: "string", enum: ["Need", "Want", "Ick"] },
            reasoning: { type: "string" },
          },
          required: ["suggestedCategory", "reasoning"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "Keep fighting those Icks! Every rupee saved gets you closer to your goals.";
}
