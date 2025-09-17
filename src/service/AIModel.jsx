import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const model = "gemini-2.0-flash";

export async function generateTripPlan(prompt) {
  const contents = [{ role: "user", parts: [{ text: prompt }] }];

  const response = await ai.models.generateContentStream({
    model,
    contents,
  });

  let output = "";
  for await (const chunk of response) {
    output += chunk.text || "";
  }

  return output; // return raw JSON text
}
