"use client";

import { OptionCard } from "../OptionCard";
import { priorities } from "@/lib/questionnaire-data";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";

export function PriorityStep() {
  const { answers, setAnswer } = useQuestionnaireStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          What matters most to you?
        </h2>
        <p className="text-muted-foreground mt-1">
          This changes how the AI weighs ideas. Learning and portfolio value
          produce different projects.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {priorities.map((p) => (
          <OptionCard
            key={p.id}
            label={p.label}
            description={p.description}
            selected={answers.priority === p.id}
            onClick={() => setAnswer("priority", p.id)}
          />
        ))}
      </div>
    </div>
  );
}
