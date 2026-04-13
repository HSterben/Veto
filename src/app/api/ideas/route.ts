import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";
import { buildIdeaGenerationPrompt } from "@/lib/prompts";
import { parseSingleIdeaResponse } from "@/lib/parser";
import { questionnaireSchema } from "@/lib/validators";
import { v4 as uuidv4 } from "uuid";
import type { GenerateIdeasResponse } from "@/types/api";
import type { ProjectIdea } from "@/types/idea";

/** Allow long OpenRouter generations on hosts that support extended timeouts (e.g. Vercel Pro). */
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers = questionnaireSchema.parse(body.answers);
    const sessionId = uuidv4();
    const targetIdeas = Math.max(
      1,
      Math.min(8, Number(process.env.IDEA_COUNT ?? "4"))
    );

    if (body.stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const push = (event: Record<string, unknown>) => {
            controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
          };
          const existingTitles: string[] = [];

          push({ type: "session", sessionId, targetIdeas });

          for (let i = 0; i < targetIdeas; i++) {
            try {
              const prompt = buildIdeaGenerationPrompt(answers, existingTitles);
              const raw = await callOpenRouter({
                messages: [
                  {
                    role: "system",
                    content:
                      "You are a project idea generator. Always respond with valid JSON only.",
                  },
                  { role: "user", content: prompt },
                ],
                temperature: 0.7,
                maxTokens: 900,
              });

              const idea = parseSingleIdeaResponse(raw);
              existingTitles.push(idea.title);
              push({ type: "idea", index: i + 1, idea });
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Failed to generate idea";
              push({ type: "warning", index: i + 1, message });
            }
          }

          push({ type: "done" });
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    }

    const ideas: ProjectIdea[] = [];
    const existingTitles: string[] = [];
    for (let i = 0; i < targetIdeas; i++) {
      const prompt = buildIdeaGenerationPrompt(answers, existingTitles);
      const raw = await callOpenRouter({
        messages: [
          {
            role: "system",
            content:
              "You are a project idea generator. Always respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        maxTokens: 900,
      });
      const idea = parseSingleIdeaResponse(raw);
      existingTitles.push(idea.title);
      ideas.push(idea);
    }

    const response: GenerateIdeasResponse = {
      sessionId,
      ideas,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Ideas generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate ideas";
    return NextResponse.json({ error: "generation_failed", message }, { status: 500 });
  }
}
