import type { QuestionnaireAnswers, ProjectIdea } from "./idea";
import type { ProjectBlueprint } from "./blueprint";

export interface GenerateIdeasRequest {
  answers: QuestionnaireAnswers;
}

export interface GenerateIdeasResponse {
  sessionId: string;
  ideas: ProjectIdea[];
}

export interface GenerateBlueprintRequest {
  idea: ProjectIdea;
  answers: QuestionnaireAnswers;
}

export interface GenerateBlueprintResponse {
  blueprint: ProjectBlueprint;
}

export type RemixAction =
  | "easier"
  | "more-impressive"
  | "more-unique"
  | "more-monetizable"
  | "full-stack"
  | "mobile-first"
  | "solo-dev-friendly"
  | "faster-to-build";

export interface RemixIdeaRequest {
  idea: ProjectIdea;
  action: RemixAction;
  answers: QuestionnaireAnswers;
}

export interface RemixIdeaResponse {
  idea: ProjectIdea;
}

export interface SaveIdeaRequest {
  idea: ProjectIdea;
  blueprint?: ProjectBlueprint;
}

export interface ApiError {
  error: string;
  message: string;
}
