import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("[gemini] GEMINI_API_KEY is not set. AI features will fail.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

/** Flash model — fast & cheap, good for structured JSON output */
export const flashModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/** Pro model — smarter, used for deep resume analysis */
export const proModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export default genAI;
