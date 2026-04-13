import {
  ideasResponseSchema,
  blueprintSchema,
  projectIdeaSchema,
} from "./validators";
import type { ProjectIdea } from "@/types/idea";
import type { ProjectBlueprint } from "@/types/blueprint";
import { v4 as uuidv4 } from "uuid";

const uuidLike =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseIdeasResponse(raw: string): ProjectIdea[] {
  const json = extractJson(raw);
  const normalized = normalizeIdeasPayload(json);
  const parsed = ideasResponseSchema.parse(normalized);
  return parsed.ideas.map((idea) => ({
    ...idea,
    id: uuidLike.test(idea.id) ? idea.id : uuidv4(),
  }));
}

export function parseSingleIdeaResponse(raw: string): ProjectIdea {
  const json = extractJson(raw);
  const parsed = projectIdeaSchema.parse(json);
  return {
    ...parsed,
    id: uuidLike.test(parsed.id) ? parsed.id : uuidv4(),
  };
}

export function parseBlueprintResponse(
  raw: string,
  ideaId: string
): ProjectBlueprint {
  const json = extractJson(raw);
  const parsed = blueprintSchema.parse(json);
  return {
    id: uuidv4(),
    ideaId,
    ...parsed,
    createdAt: new Date().toISOString(),
  };
}

export function parseRemixResponse(raw: string): ProjectIdea {
  const json = extractJson(raw);
  return projectIdeaSchema.parse(json);
}

function normalizeIdeasPayload(data: unknown): unknown {
  if (Array.isArray(data)) {
    return { ideas: data };
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.ideas)) return data;
    if (Array.isArray(o.Ideas)) return { ideas: o.Ideas };
    if (Array.isArray(o.projects)) return { ideas: o.projects };
    if (Array.isArray(o.suggestions)) return { ideas: o.suggestions };
    if (Array.isArray(o.results)) return { ideas: o.results };
  }
  return data;
}

/** Remove trailing commas before } or ] (common model mistake). */
function repairJsonText(s: string): string {
  return s.replace(/,\s*([}\]])/g, "$1");
}

/**
 * Extract a complete JSON object or array from `text` starting at `start`
 * (must be `{` or `[`), respecting strings and escapes.
 */
function sliceBalancedJson(text: string, start: number): string | null {
  const root = text[start];
  if (root !== "{" && root !== "[") return null;

  const stack: string[] = [root];
  const pair: Record<string, string> = { "{": "}", "[": "]" };
  let inString = false;
  let escaped = false;

  for (let i = start + 1; i < text.length; i++) {
    const c = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (c === "\\") {
        escaped = true;
        continue;
      }
      if (c === '"') {
        inString = false;
      }
      continue;
    }

    if (c === '"') {
      inString = true;
      continue;
    }

    if (c === "{" || c === "[") {
      stack.push(c);
      continue;
    }

    if (c === "}" || c === "]") {
      const top = stack[stack.length - 1];
      const expected = pair[top];
      if (c !== expected) continue;
      stack.pop();
      if (stack.length === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

function firstJsonSlice(text: string): string | null {
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "{" || c === "[") {
      const slice = sliceBalancedJson(text, i);
      if (slice) return slice;
    }
  }
  return null;
}

function extractFromMarkdownFence(text: string): string | null {
  const patterns = [
    /```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?\s*```/i,
    /```\s*\r?\n?([\s\S]*?)\r?\n?\s*```/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const inner = m[1].trim();
      const slice = firstJsonSlice(inner) ?? inner;
      if (slice.startsWith("{") || slice.startsWith("[")) return slice;
    }
  }
  return null;
}

function tryParseJson(text: string): unknown {
  const attempts = [text, repairJsonText(text)];
  let lastErr: Error | null = null;
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastErr ?? new Error("JSON.parse failed");
}

function extractJson(text: string): unknown {
  const trimmed = text
    .replace(/^\uFEFF/, "")
    .replace(/^[\s\u200B\u200C\u200D\uFEFF]+/, "")
    .trim();

  const errors: string[] = [];

  let parsed: unknown | null = null;

  const tryCandidate = (label: string, candidate: string | null): unknown | null => {
    if (!candidate?.trim()) return null;
    try {
      return tryParseJson(candidate.trim());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${label}: ${msg}`);
      return null;
    }
  };

  // 1) Whole string is JSON
  parsed = tryCandidate(
    "raw",
    trimmed.startsWith("{") || trimmed.startsWith("[") ? trimmed : null
  );

  // 2) Markdown fenced block
  if (!parsed) {
    const fence = extractFromMarkdownFence(trimmed);
    parsed = tryCandidate("markdown_fence", fence);
  }

  // 3) First balanced JSON object/array anywhere in the text (skips leading prose)
  if (!parsed) {
    const slice = firstJsonSlice(trimmed);
    parsed = tryCandidate("balanced_slice", slice);
  }

  // 4) Greedy brace match (last resort; can fail on nested edge cases)
  if (!parsed) {
    const greedy = trimmed.match(/\{[\s\S]*\}/);
    if (greedy) {
      parsed = tryCandidate("greedy_object", greedy[0]);
    }
  }

  if (!parsed) {
    const preview = trimmed.slice(0, 400).replace(/\s+/g, " ");
    throw new Error(
      `Could not extract JSON from AI response. ${errors.join(" | ")} Preview: ${preview}`
    );
  }

  return parsed;
}
