import { z } from "zod/v4";

export const questionnaireSchema = z.object({
  projectType: z.string().min(1, "Pick a project type"),
  technologies: z.array(z.string()).min(1, "Pick at least one technology"),
  difficulty: z.string().min(1, "Pick a difficulty level"),
  duration: z.string().min(1, "Pick a duration"),
  priority: z.string().min(1, "Pick what matters most"),
  balance: z.string().min(1, "Pick a balance"),
  themes: z.array(z.string()).min(1, "Pick at least one theme"),
});

const difficultyEnum = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

const portfolioEnum = z.enum(["low", "medium", "high", "very-high"]);

function normalizeIdeaKeys(input: unknown): unknown {
  if (!input || typeof input !== "object") return input;
  const o = { ...(input as Record<string, unknown>) };
  if (typeof o.time_estimate === "string" && o.timeEstimate == null) {
    o.timeEstimate = o.time_estimate;
  }
  if (typeof o.standout_feature === "string" && o.standoutFeature == null) {
    o.standoutFeature = o.standout_feature;
  }
  if (typeof o.portfolio_value === "string" && o.portfolioValue == null) {
    o.portfolioValue = o.portfolio_value;
  }
  delete o.time_estimate;
  delete o.standout_feature;
  delete o.portfolio_value;
  return o;
}

export const projectIdeaSchema = z.preprocess(
  normalizeIdeaKeys,
  z.object({
    id: z.string(),
    title: z.string(),
    pitch: z.string(),
    rationale: z.string(),
    difficulty: z
      .string()
      .transform((s) => s.trim().toLowerCase())
      .pipe(difficultyEnum),
    timeEstimate: z.string().min(1),
    stack: z.array(z.string()),
    tags: z.array(z.string()),
    standoutFeature: z.string(),
    portfolioValue: z
      .string()
      .transform((s) => s.trim().toLowerCase().replace(/\s+/g, "-"))
      .pipe(portfolioEnum),
    score: z.coerce.number(),
  })
);

export const ideasResponseSchema = z.object({
  ideas: z.array(projectIdeaSchema),
});

export const featureItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  priority: z.enum(["mvp", "stretch"]),
});

function normalizeBlueprintPayload(input: unknown): unknown {
  if (!input || typeof input !== "object") return input;
  const out = { ...(input as Record<string, unknown>) };

  if (Array.isArray(out.roadmap)) {
    out.roadmap = out.roadmap.map((phase) => {
      if (!phase || typeof phase !== "object") return phase;
      const p = { ...(phase as Record<string, unknown>) };
      const tasks = p.tasks;

      // Some models return a single task string instead of an array.
      if (typeof tasks === "string") {
        p.tasks = [tasks];
      } else if (!Array.isArray(tasks)) {
        p.tasks = [];
      }

      return p;
    });
  }

  return out;
}

const blueprintSchemaBase = z.object({
  overview: z.string(),
  problem: z.string(),
  audience: z.string(),
  features: z.array(featureItemSchema),
  architecture: z.object({
    overview: z.string(),
    components: z.array(
      z.object({ name: z.string(), description: z.string(), tech: z.string() })
    ),
    diagram: z.string(),
  }),
  schema: z.array(
    z.object({
      name: z.string(),
      columns: z.array(
        z.object({ name: z.string(), type: z.string(), constraints: z.string() })
      ),
    })
  ),
  pages: z.array(
    z.object({
      route: z.string(),
      name: z.string(),
      description: z.string(),
      components: z.array(z.string()),
    })
  ),
  apiRoutes: z.array(
    z.object({
      method: z.string(),
      path: z.string(),
      description: z.string(),
      requestBody: z.string().optional(),
      response: z.string(),
    })
  ),
  roadmap: z.array(
    z.object({
      phase: z.string(),
      title: z.string(),
      tasks: z.array(z.string()),
      duration: z.string(),
    })
  ),
  stretchGoals: z.array(z.string()),
  designDirection: z.string(),
});

export const blueprintSchema = z.preprocess(
  normalizeBlueprintPayload,
  blueprintSchemaBase
);
