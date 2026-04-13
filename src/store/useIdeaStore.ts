import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectIdea, IdeaSession } from "@/types/idea";
import type { ProjectBlueprint } from "@/types/blueprint";

interface IdeaState {
  currentSession: IdeaSession | null;
  selectedIdea: ProjectIdea | null;
  currentBlueprint: ProjectBlueprint | null;
  savedIdeas: { idea: ProjectIdea; blueprint?: ProjectBlueprint; savedAt: string }[];
  isGenerating: boolean;
  isExpandingBlueprint: boolean;

  setSession: (session: IdeaSession) => void;
  appendIdeaToSession: (idea: ProjectIdea) => void;
  setSelectedIdea: (idea: ProjectIdea | null) => void;
  setBlueprint: (blueprint: ProjectBlueprint | null) => void;
  setIsGenerating: (val: boolean) => void;
  setIsExpandingBlueprint: (val: boolean) => void;
  saveIdea: (idea: ProjectIdea, blueprint?: ProjectBlueprint) => void;
  removeSavedIdea: (ideaId: string) => void;
  isIdeaSaved: (ideaId: string) => boolean;
  updateIdeaInSession: (ideaId: string, updated: ProjectIdea) => void;
  reset: () => void;
}

export const useIdeaStore = create<IdeaState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      selectedIdea: null,
      currentBlueprint: null,
      savedIdeas: [],
      isGenerating: false,
      isExpandingBlueprint: false,

      setSession: (session) => set({ currentSession: session }),
      appendIdeaToSession: (idea) =>
        set((s) => {
          if (!s.currentSession) return s;
          if (s.currentSession.ideas.some((i) => i.id === idea.id)) return s;
          return {
            currentSession: {
              ...s.currentSession,
              ideas: [...s.currentSession.ideas, idea],
            },
          };
        }),
      setSelectedIdea: (idea) => set({ selectedIdea: idea }),
      setBlueprint: (blueprint) => set({ currentBlueprint: blueprint }),
      setIsGenerating: (val) => set({ isGenerating: val }),
      setIsExpandingBlueprint: (val) => set({ isExpandingBlueprint: val }),

      saveIdea: (idea, blueprint) =>
        set((s) => {
          const exists = s.savedIdeas.some((si) => si.idea.id === idea.id);
          if (exists) return s;
          return {
            savedIdeas: [
              ...s.savedIdeas,
              { idea, blueprint, savedAt: new Date().toISOString() },
            ],
          };
        }),

      removeSavedIdea: (ideaId) =>
        set((s) => ({
          savedIdeas: s.savedIdeas.filter((si) => si.idea.id !== ideaId),
        })),

      isIdeaSaved: (ideaId) =>
        get().savedIdeas.some((si) => si.idea.id === ideaId),

      updateIdeaInSession: (ideaId, updated) =>
        set((s) => {
          if (!s.currentSession) return s;
          return {
            currentSession: {
              ...s.currentSession,
              ideas: s.currentSession.ideas.map((i) =>
                i.id === ideaId ? updated : i
              ),
            },
          };
        }),

      reset: () =>
        set({
          currentSession: null,
          selectedIdea: null,
          currentBlueprint: null,
          isGenerating: false,
          isExpandingBlueprint: false,
        }),
    }),
    {
      name: "veto-ideas",
      partialize: (state) => ({ savedIdeas: state.savedIdeas }),
    }
  )
);
