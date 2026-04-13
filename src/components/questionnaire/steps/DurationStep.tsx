"use client";

import { OptionCard } from "../OptionCard";
import { durations } from "@/lib/questionnaire-data";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";

export function DurationStep() {
  const { answers, setAnswer } = useQuestionnaireStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          How long do you want it to take?
        </h2>
        <p className="text-muted-foreground mt-1">
          This affects scope and complexity. Be realistic about your time.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {durations.map((d) => (
          <OptionCard
            key={d.id}
            label={d.label}
            description={d.description}
            selected={answers.duration === d.id}
            onClick={() => setAnswer("duration", d.id)}
          />
        ))}
      </div>
    </div>
  );
}
