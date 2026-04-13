import { create } from "zustand";
import type { QuestionnaireAnswers } from "@/types/idea";

interface QuestionnaireState {
  currentStep: number;
  answers: QuestionnaireAnswers;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAnswer: <K extends keyof QuestionnaireAnswers>(
    key: K,
    value: QuestionnaireAnswers[K]
  ) => void;
  reset: () => void;
}

const defaultAnswers: QuestionnaireAnswers = {
  projectType: "",
  technologies: [],
  difficulty: "",
  duration: "",
  priority: "",
  balance: "",
  themes: [],
};

export const TOTAL_STEPS = 7;

export const useQuestionnaireStore = create<QuestionnaireState>((set) => ({
  currentStep: 0,
  answers: { ...defaultAnswers },
  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS - 1) })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  setAnswer: (key, value) =>
    set((s) => ({ answers: { ...s.answers, [key]: value } })),
  reset: () => set({ currentStep: 0, answers: { ...defaultAnswers } }),
}));
