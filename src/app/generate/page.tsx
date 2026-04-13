"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { StepProgress } from "@/components/questionnaire/StepProgress";
import { ProjectTypeStep } from "@/components/questionnaire/steps/ProjectTypeStep";
import { TechnologiesStep } from "@/components/questionnaire/steps/TechnologiesStep";
import { DifficultyStep } from "@/components/questionnaire/steps/DifficultyStep";
import { DurationStep } from "@/components/questionnaire/steps/DurationStep";
import { PriorityStep } from "@/components/questionnaire/steps/PriorityStep";
import { BalanceStep } from "@/components/questionnaire/steps/BalanceStep";
import { ThemesStep } from "@/components/questionnaire/steps/ThemesStep";
import {
  useQuestionnaireStore,
  TOTAL_STEPS,
} from "@/store/useQuestionnaireStore";
import { useIdeaStore } from "@/store/useIdeaStore";
import type { ProjectIdea } from "@/types/idea";
import { useState } from "react";

const steps = [
  ProjectTypeStep,
  TechnologiesStep,
  DifficultyStep,
  DurationStep,
  PriorityStep,
  BalanceStep,
  ThemesStep,
];

function isStepValid(step: number, answers: ReturnType<typeof useQuestionnaireStore.getState>["answers"]): boolean {
  switch (step) {
    case 0: return answers.projectType !== "";
    case 1: return answers.technologies.length >= 1;
    case 2: return answers.difficulty !== "";
    case 3: return answers.duration !== "";
    case 4: return answers.priority !== "";
    case 5: return answers.balance !== "";
    case 6: return answers.themes.length >= 1;
    default: return false;
  }
}

export default function GeneratePage() {
  const router = useRouter();
  const { currentStep, answers, nextStep, prevStep } = useQuestionnaireStore();
  const { setSession, appendIdeaToSession, setIsGenerating } = useIdeaStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const StepComponent = steps[currentStep];
  const isLast = currentStep === TOTAL_STEPS - 1;
  const canProceed = isStepValid(currentStep, answers);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setIsGenerating(true);

    try {
      setSession({
        id: crypto.randomUUID(),
        answers,
        ideas: [],
        createdAt: new Date().toISOString(),
      });
      router.push("/results");

      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, stream: true }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to generate ideas");
      }

      if (!res.body) {
        throw new Error("Streaming was not available");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          const event = JSON.parse(trimmed) as {
            type: string;
            idea?: unknown;
            sessionId?: string;
          };

          if (event.type === "session" && event.sessionId) {
            setSession({
              id: event.sessionId,
              answers,
              ideas: [],
              createdAt: new Date().toISOString(),
            });
            continue;
          }

          if (event.type === "idea" && event.idea) {
            appendIdeaToSession(event.idea as ProjectIdea);
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  }

  function handleNext() {
    if (isLast) {
      handleGenerate();
    } else {
      nextStep();
    }
  }

  return (
    <main className="flex flex-col flex-1 min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-2xl space-y-10">
          <StepProgress currentStep={currentStep} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className="gap-2 glow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : isLast ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Ideas
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
