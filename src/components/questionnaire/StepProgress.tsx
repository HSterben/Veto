"use client";

import { motion } from "motion/react";
import { TOTAL_STEPS } from "@/store/useQuestionnaireStore";
import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

const stepLabels = [
  "Project Type",
  "Technologies",
  "Difficulty",
  "Duration",
  "Priority",
  "Balance",
  "Themes",
];

export function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Step {currentStep + 1} of {TOTAL_STEPS}
        </span>
        <span className="text-sm text-muted-foreground">
          {stepLabels[currentStep]}
        </span>
      </div>
      <div className="relative flex items-center gap-1">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="relative flex-1 h-1.5 rounded-full overflow-hidden bg-secondary">
            {i < currentStep && (
              <motion.div
                layoutId={`bar-${i}`}
                className="absolute inset-0 bg-primary rounded-full"
                initial={false}
              />
            )}
            {i === currentStep && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "50%" }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                i < currentStep
                  ? "bg-primary text-primary-foreground"
                  : i === currentStep
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < currentStep ? (
                <Check className="w-3 h-3" />
              ) : (
                i + 1
              )}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 hidden sm:block">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
