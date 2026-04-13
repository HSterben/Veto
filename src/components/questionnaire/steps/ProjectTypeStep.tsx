"use client";

import { OptionCard } from "../OptionCard";
import { projectTypes } from "@/lib/questionnaire-data";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";

export function ProjectTypeStep() {
  const { answers, setAnswer } = useQuestionnaireStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          What kind of project do you want to build?
        </h2>
        <p className="text-muted-foreground mt-1">
          Pick the type that excites you most.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {projectTypes.map((type) => (
          <OptionCard
            key={type.id}
            label={type.label}
            selected={answers.projectType === type.id}
            onClick={() => setAnswer("projectType", type.id)}
          />
        ))}
      </div>
    </div>
  );
}
