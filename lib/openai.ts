import OpenAI from "openai";
import type { ContentType } from "@/types";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  return new OpenAI({ apiKey });
}

export const MODEL_NAME = "gpt-4o";

export function buildSystemPrompt(type: ContentType) {
  return `You are a professional content writer AI. The user will provide a topic and content type. Produce high-quality, well-structured output tailored for the selected type. Content type: ${type}. Be concise, clear, and engaging.`;
}
