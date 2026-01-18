import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function testModel(modelName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API Key");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });
  console.log(`Testing model: ${modelName}...`);
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Hello, are you working?",
    });
    console.log(`SUCCESS: ${modelName} responded: ${response.text?.substring(0, 50)}...`);
    return true;
  } catch (error: any) {
    console.log(`FAILED: ${modelName} - ${error.message}`);
    // console.log(JSON.stringify(error, null, 2));
    return false;
  }
}

async function run() {
  // Test gemini-1.5-flash (standard alias)
  const flash = await testModel("gemini-1.5-flash");
  if (flash) return;

  // Test gemini-pro (older standard)
  const pro = await testModel("gemini-pro");
  if (pro) return;

  // Test gemini-1.5-pro
  await testModel("gemini-1.5-pro");
}

run();
