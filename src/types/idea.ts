export interface ProjectIdea {
  id: string;
  title: string;
  pitch: string;
  rationale: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  timeEstimate: string;
  stack: string[];
  tags: string[];
  standoutFeature: string;
  portfolioValue: "low" | "medium" | "high" | "very-high";
  score: number;
}

export interface IdeaSession {
  id: string;
  answers: QuestionnaireAnswers;
  ideas: ProjectIdea[];
  createdAt: string;
}

export interface QuestionnaireAnswers {
  projectType: string;
  technologies: string[];
  difficulty: string;
  duration: string;
  priority: string;
  balance: string;
  themes: string[];
}
