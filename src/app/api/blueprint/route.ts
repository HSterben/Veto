import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";
import { buildBlueprintPrompt } from "@/lib/prompts";
import { parseBlueprintResponse } from "@/lib/parser";
import type { GenerateBlueprintResponse } from "@/types/api";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idea, answers } = body;

    if (!idea || !answers) {
      return NextResponse.json(
        { error: "invalid_request", message: "Missing idea or answers" },
        { status: 400 }
      );
    }

    const prompt = buildBlueprintPrompt(idea, answers);
    const raw = await callOpenRouter({
      messages: [
        {
          role: "system",
          content:
            "You are a software architect. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 6000,
    });

    const blueprint = parseBlueprintResponse(raw, idea.id);

    const response: GenerateBlueprintResponse = { blueprint };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Blueprint generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate blueprint";
    return NextResponse.json(
      { error: "blueprint_failed", message },
      { status: 500 }
    );
  }
}
