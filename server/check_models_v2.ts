import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function testModel(modelName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return `No API Key for ${modelName}`;
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Hi",
    });
    return `SUCCESS: ${modelName}`;
  } catch (error: any) {
    return `FAILED: ${modelName} - ${error.message}`;
  }
}

async function run() {
  const results = [];
  results.push(await testModel("gemini-1.5-flash"));
  results.push(await testModel("gemini-1.5-flash-001"));
  results.push(await testModel("gemini-2.0-flash-exp"));
  
  fs.writeFileSync(path.join(process.cwd(), "server", "model_status.txt"), results.join("\n"));
}

run();
