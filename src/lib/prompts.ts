import type { QuestionnaireAnswers, ProjectIdea } from "@/types/idea";
import type { RemixAction } from "@/types/api";

export function buildIdeaGenerationPrompt(
  answers: QuestionnaireAnswers,
  existingTitles: string[] = []
): string {
  return `You are an expert software engineering mentor and product strategist. Generate exactly one unique project idea based on the developer preferences below. Keep the output practical and concise, focusing on a high-level overview rather than deep implementation detail.

Developer Preferences:
- Project type: ${answers.projectType}
- Technologies: ${answers.technologies.join(", ")}
- Difficulty: ${answers.difficulty}
- Desired duration: ${answers.duration}
- Priority: ${answers.priority}
- Balance: ${answers.balance}
- Themes: ${answers.themes.join(", ")}
${existingTitles.length > 0 ? `- Already generated titles: ${existingTitles.join(", ")}` : ""}

Return a single JSON object with these exact fields:
{
  "id": "<unique-uuid>",
  "title": "<project name>",
  "pitch": "<one compelling sentence>",
  "rationale": "<short reason this fits (1 sentence)>",
  "difficulty": "<beginner|intermediate|advanced|expert>",
  "timeEstimate": "<e.g. '2-3 weeks'>",
  "stack": ["<tech1>", "<tech2>"],
  "tags": ["<tag1>", "<tag2>"],
  "standoutFeature": "<what makes this unique, 1 sentence>",
  "portfolioValue": "<low|medium|high|very-high>",
  "score": <1-100 match score>
}

Rules:
- Each idea must use at least some of the requested technologies
- Difficulty must match the requested level
- Duration must be realistic for the requested timeframe
- Each id must be a valid UUID v4
- Keep all text fields concise (no long paragraphs)
- Avoid duplicating any title listed in "Already generated titles"
- Return ONLY the JSON object, no extra text`;
}

export function buildBlueprintPrompt(
  idea: ProjectIdea,
  answers: QuestionnaireAnswers
): string {
  return `You are an expert software architect. Expand this project idea into a comprehensive, actionable blueprint that a developer could follow to build it from scratch.

Project: ${idea.title}
Pitch: ${idea.pitch}
Stack: ${idea.stack.join(", ")}
Difficulty: ${idea.difficulty}
Duration: ${idea.timeEstimate}

Developer context:
- Balance preference: ${answers.balance}
- Priority: ${answers.priority}
- Themes: ${answers.themes.join(", ")}

Return a JSON object with these exact fields:
{
  "overview": "<2-3 paragraph project overview>",
  "problem": "<what user problem this solves>",
  "audience": "<who would use this>",
  "features": [
    { "name": "<feature>", "description": "<details>", "priority": "mvp|stretch" }
  ],
  "architecture": {
    "overview": "<high-level architecture description>",
    "components": [
      { "name": "<component>", "description": "<what it does>", "tech": "<technology>" }
    ],
    "diagram": "<ASCII or text-based architecture diagram>"
  },
  "schema": [
    {
      "name": "<table_name>",
      "columns": [
        { "name": "<col>", "type": "<type>", "constraints": "<pk, fk, unique, etc>" }
      ]
    }
  ],
  "pages": [
    { "route": "<url>", "name": "<page name>", "description": "<what it shows>", "components": ["<component>"] }
  ],
  "apiRoutes": [
    { "method": "GET|POST|PUT|DELETE", "path": "<route>", "description": "<what it does>", "requestBody": "<optional>", "response": "<what it returns>" }
  ],
  "roadmap": [
    { "phase": "1", "title": "<phase name>", "tasks": ["<task>"], "duration": "<time>" }
  ],
  "stretchGoals": ["<stretch goal>"],
  "designDirection": "<visual style and UX guidance>"
}

Rules:
- Features should include both MVP and stretch items
- Schema should cover all core tables needed
- API routes must cover all CRUD operations
- Roadmap should have 3-5 phases
- Be specific and actionable, not generic; keep string fields concise (no filler paragraphs)
- Return ONLY the JSON object`;
}

export function buildRemixPrompt(
  idea: ProjectIdea,
  action: RemixAction,
  answers: QuestionnaireAnswers
): string {
  const actionDescriptions: Record<RemixAction, string> = {
    easier:
      "Make this project significantly easier to build. Simplify the architecture, reduce features to the absolute core, and suggest simpler technologies where possible.",
    "more-impressive":
      "Make this project more technically impressive and portfolio-worthy. Add advanced features, complex architecture, and technologies that showcase senior-level skills.",
    "more-unique":
      "Make this project more creative and unique. Change the angle, add unexpected features, or combine concepts in ways nobody has seen before.",
    "more-monetizable":
      "Reframe this project to have strong monetization potential. Add SaaS features, subscription models, or marketplace dynamics.",
    "full-stack":
      "Transform this into a comprehensive full-stack project with robust backend, database, API layer, and frontend.",
    "mobile-first":
      "Redesign this project with mobile-first approach. Consider PWA, responsive design, or native mobile technologies.",
    "solo-dev-friendly":
      "Optimize this for a solo developer. Reduce scope, suggest automation tools, and pick technologies that maximize one person's productivity.",
    "faster-to-build":
      "Streamline this project to be built as fast as possible. Cut scope aggressively, use boilerplates and existing solutions where possible.",
  };

  return `You are an expert software engineering mentor. Remix this project idea based on the instruction below.

Original idea:
- Title: ${idea.title}
- Pitch: ${idea.pitch}
- Stack: ${idea.stack.join(", ")}
- Difficulty: ${idea.difficulty}
- Duration: ${idea.timeEstimate}

Remix instruction: ${actionDescriptions[action]}

Developer context:
- Technologies they know: ${answers.technologies.join(", ")}
- Themes they like: ${answers.themes.join(", ")}

Return a JSON object with the same structure as the original idea, but modified according to the remix instruction:
{
  "id": "<new-uuid-v4>",
  "title": "<modified title>",
  "pitch": "<modified pitch>",
  "rationale": "<why this remixed version is better for the remix goal>",
  "difficulty": "<beginner|intermediate|advanced|expert>",
  "timeEstimate": "<adjusted time>",
  "stack": ["<tech>"],
  "tags": ["<tag>"],
  "standoutFeature": "<what makes the remixed version stand out>",
  "portfolioValue": "<low|medium|high|very-high>",
  "score": <1-100>
}

Return ONLY the JSON object.`;
}
