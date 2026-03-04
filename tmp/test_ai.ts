
import "dotenv/config";
import { chatWithFinancialAssistant } from "../server/geminiService";

async function test() {
  console.log("Testing AI Chatbot with OpenRouter...");
  console.log("-----------------------------------------");
  
  try {
    const response = await chatWithFinancialAssistant("Hello Coach! How can I save more money today?");
    console.log("AI Response:", response);
    
    if (response && response.length > 10) {
      console.log("-----------------------------------------");
      console.log("✅ Chatbot is working and responding 100%!");
    } else {
      console.log("-----------------------------------------");
      console.log("⚠️ Chatbot returned a very short or unexpected response.");
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

test();
