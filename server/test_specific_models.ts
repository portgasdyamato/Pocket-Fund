import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function testModel(modelName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  const body = {
    contents: [{ role: "user", parts: [{ text: "Hello" }] }]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
        console.log(`SUCCESS: ${modelName}`);
    } else {
        console.log(`FAILED: ${modelName} - ${data.error.message}`);
    }
  } catch (error) {
    console.error(`Error testing ${modelName}:`, error);
  }
}

async function run() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-2.0-flash");
    await testModel("gemini-2.5-flash");
}

run();
