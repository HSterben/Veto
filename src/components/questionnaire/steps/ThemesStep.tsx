"use client";

import { TagSelector } from "../TagSelector";
import { themes } from "@/lib/questionnaire-data";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";

export function ThemesStep() {
  const { answers, setAnswer } = useQuestionnaireStore();

  const handleToggle = (id: string) => {
    const current = answers.themes;
    if (current.includes(id)) {
      setAnswer(
        "themes",
        current.filter((t) => t !== id)
      );
    } else {
      setAnswer("themes", [...current, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Any themes you like?
        </h2>
        <p className="text-muted-foreground mt-1">
          Pick 1-5 areas that interest you. This helps the AI find ideas you
          actually care about.
        </p>
      </div>
      <TagSelector
        options={themes}
        selected={answers.themes}
        onToggle={handleToggle}
        max={5}
      />
      {answers.themes.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {answers.themes.length} / 5 selected
        </p>
      )}
    </div>
  );
}
