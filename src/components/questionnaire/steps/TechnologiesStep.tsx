"use client";

import { TagSelector } from "../TagSelector";
import { technologies } from "@/lib/questionnaire-data";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";

export function TechnologiesStep() {
  const { answers, setAnswer } = useQuestionnaireStore();

  const handleToggle = (id: string) => {
    const current = answers.technologies;
    if (current.includes(id)) {
      setAnswer(
        "technologies",
        current.filter((t) => t !== id)
      );
    } else {
      setAnswer("technologies", [...current, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          What tech do you want to use?
        </h2>
        <p className="text-muted-foreground mt-1">
          Pick up to 8 technologies. These shape what ideas you get.
        </p>
      </div>
      <TagSelector
        options={technologies}
        selected={answers.technologies}
        onToggle={handleToggle}
        max={8}
      />
      {answers.technologies.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {answers.technologies.length} / 8 selected
        </p>
      )}
    </div>
  );
}
