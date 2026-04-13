interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

type ProviderSort = "latency" | "throughput" | "price";

function providerPreferencesFromEnv(): { sort: ProviderSort } | undefined {
  const raw = process.env.OPENROUTER_PROVIDER_SORT?.trim().toLowerCase();
  const sort: ProviderSort =
    raw === "latency" || raw === "price" || raw === "throughput"
      ? raw
      : "throughput";
  // Default: prioritize tokens/sec so long JSON completions finish sooner.
  // Set OPENROUTER_PROVIDER_SORT=latency if you care more about time-to-first-byte.
  return { sort };
}

interface OpenRouterOptions {
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
  /**
   * When true, sends `response_format: { type: "json_object" }`.
   * If the model returns an empty message (common with some providers),
   * automatically retries once without that constraint.
   */
  jsonObjectMode?: boolean;
}

type ChatCompletionResponse = {
  choices?: Array<{
    finish_reason?: string;
    message?: Record<string, unknown>;
  }>;
  error?: { message?: string; code?: string };
  model?: string;
};

function textFromContentParts(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (!part || typeof part !== "object") return "";
      const p = part as Record<string, unknown>;
      if (typeof p.text === "string") return p.text;
      if (p.type === "text" && typeof p.text === "string") return p.text;
      return "";
    })
    .join("");
}

function textFromReasoningDetails(details: unknown): string {
  if (!Array.isArray(details)) return "";
  return details
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const o = item as Record<string, unknown>;
      if (typeof o.text === "string") return o.text;
      if (typeof o.content === "string") return o.content;
      return "";
    })
    .join("");
}

function extractAssistantText(data: ChatCompletionResponse): string {
  if (data.error?.message) {
    throw new Error(`OpenRouter: ${data.error.message}`);
  }

  const choice = data.choices?.[0];
  const message = choice?.message;
  if (!message || typeof message !== "object") return "";

  const refusal = message.refusal;
  if (typeof refusal === "string" && refusal.trim()) {
    throw new Error(`Model refused the request: ${refusal}`);
  }

  const fromContent = textFromContentParts(message.content).trim();
  if (fromContent) return fromContent;

  const reasoning = message.reasoning;
  if (typeof reasoning === "string" && reasoning.trim()) {
    return reasoning.trim();
  }

  const fromDetails = textFromReasoningDetails(message.reasoning_details).trim();
  if (fromDetails) return fromDetails;

  return "";
}

function completionDiagnostics(data: ChatCompletionResponse): string {
  const choice = data.choices?.[0];
  const message = choice?.message as Record<string, unknown> | undefined;
  const keys = message ? Object.keys(message).join(", ") : "(no message)";
  const finish = choice?.finish_reason ?? "unknown";
  const topError = data.error?.message;
  const parts: string[] = [
    `finish_reason=${finish}`,
    `message_keys=${keys}`,
    `choices=${data.choices?.length ?? 0}`,
  ];
  if (topError) parts.push(`api_error=${topError}`);
  if (data.model) parts.push(`model=${data.model}`);
  return parts.join("; ");
}

export async function callOpenRouter({
  messages,
  temperature = 0.7,
  maxTokens = 4096,
  jsonObjectMode = true,
}: OpenRouterOptions): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("OPENROUTER_API_KEY is not configured in .env.local");
  }
  if (!model || model === "your_model_here") {
    throw new Error("OPENROUTER_MODEL is not configured in .env.local");
  }

  async function post(body: Record<string, unknown>) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Veto - Project Idea Generator",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`OpenRouter API error (${res.status}): ${errorBody}`);
    }

    return (await res.json()) as ChatCompletionResponse;
  }

  const baseBody: Record<string, unknown> = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    provider: providerPreferencesFromEnv(),
  };

  let data: ChatCompletionResponse;

  if (jsonObjectMode) {
    data = await post({
      ...baseBody,
      response_format: { type: "json_object" },
    });
  } else {
    data = await post(baseBody);
  }

  let text = extractAssistantText(data);

  if (!text && jsonObjectMode) {
    data = await post(baseBody);
    text = extractAssistantText(data);
  }

  if (!text) {
    throw new Error(
      `No assistant text in OpenRouter response (${completionDiagnostics(data)}). ` +
        "Try another model, or disable strict JSON mode for this model. " +
        "See https://openrouter.ai/docs"
    );
  }

  return text;
}
