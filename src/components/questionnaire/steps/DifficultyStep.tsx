"use client";

import { OptionCard } from "../OptionCard";
import { difficulties } from "@/lib/questionnaire-data";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";

export function DifficultyStep() {
  const { answers, setAnswer } = useQuestionnaireStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          How hard should it be?
        </h2>
        <p className="text-muted-foreground mt-1">
          Be honest. A project too far above your level stalls; too far below
          bores you.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {difficulties.map((d) => (
          <OptionCard
            key={d.id}
            label={d.label}
            description={d.description}
            selected={answers.difficulty === d.id}
            onClick={() => setAnswer("difficulty", d.id)}
          />
        ))}
      </div>
    </div>
  );
}
