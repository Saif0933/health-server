import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ENV } from "../../config/env";

export const googleGenAIModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: ENV.googleApiKey,
  maxOutputTokens: 8192, // Sufficient for long JSON plans
  maxRetries: 2,
  temperature: 0.2,
});

export const groqModel = new ChatGroq({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  apiKey: ENV.groqApiKey,
  maxTokens: 8000,
  maxRetries: 1,
});


// Example test call (optional, usually removed in production)
// groqModel.invoke([
//   nutritionAgentPrompt,
//   {
//     role: 'user',
//     content: 'Analyze my nutrition'
//   }
// ]).then(console.log).catch(console.error);