"use client";

import { OptionCard } from "../OptionCard";
import { balances } from "@/lib/questionnaire-data";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";

export function BalanceStep() {
  const { answers, setAnswer } = useQuestionnaireStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Frontend-heavy, backend-heavy, or balanced?
        </h2>
        <p className="text-muted-foreground mt-1">
          This shapes the technical direction of your project.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {balances.map((b) => (
          <OptionCard
            key={b.id}
            label={b.label}
            description={b.description}
            selected={answers.balance === b.id}
            onClick={() => setAnswer("balance", b.id)}
          />
        ))}
      </div>
    </div>
  );
}
