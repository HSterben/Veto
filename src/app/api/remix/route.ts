import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";
import { buildRemixPrompt } from "@/lib/prompts";
import { parseRemixResponse } from "@/lib/parser";
import type { RemixIdeaResponse } from "@/types/api";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idea, action, answers } = body;

    if (!idea || !action || !answers) {
      return NextResponse.json(
        { error: "invalid_request", message: "Missing idea, action, or answers" },
        { status: 400 }
      );
    }

    const prompt = buildRemixPrompt(idea, action, answers);
    const raw = await callOpenRouter({
      messages: [
        {
          role: "system",
          content:
            "You are a project idea remixer. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      maxTokens: 2048,
    });

    const remixedIdea = parseRemixResponse(raw);

    const response: RemixIdeaResponse = { idea: remixedIdea };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Remix error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to remix idea";
    return NextResponse.json({ error: "remix_failed", message }, { status: 500 });
  }
}
