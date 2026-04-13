"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/landing/Navbar";
import { BlueprintSidebar } from "@/components/blueprint/BlueprintSidebar";
import {
  OverviewSection,
  ProblemSection,
  FeaturesSection,
  ArchitectureSection,
  SchemaSection,
  PagesSection,
  ApiRoutesSection,
  RoadmapSection,
  StretchGoalsSection,
  DesignSection,
} from "@/components/blueprint/BlueprintSections";
import { RemixPanel } from "@/components/blueprint/RemixPanel";
import { ExportActions } from "@/components/blueprint/ExportActions";
import { useIdeaStore } from "@/store/useIdeaStore";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";
import type { RemixAction } from "@/types/api";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function IdeaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    currentSession,
    selectedIdea,
    currentBlueprint,
    setSelectedIdea,
    setBlueprint,
    saveIdea,
    removeSavedIdea,
    isIdeaSaved,
    updateIdeaInSession,
  } = useIdeaStore();
  const { answers } = useQuestionnaireStore();

  const [activeSection, setActiveSection] = useState("overview");
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixAction, setRemixAction] = useState<RemixAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const idea =
    selectedIdea?.id === id
      ? selectedIdea
      : currentSession?.ideas.find((i) => i.id === id) ?? null;

  useEffect(() => {
    if (idea && !selectedIdea) {
      setSelectedIdea(idea);
    }
  }, [idea, selectedIdea, setSelectedIdea]);

  useEffect(() => {
    if (idea && !currentBlueprint && !loadingBlueprint) {
      generateBlueprint();
    }
  }, [idea]);

  async function generateBlueprint() {
    if (!idea) return;
    setLoadingBlueprint(true);
    setError(null);

    try {
      const res = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, answers }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to generate blueprint");
      }

      const data = await res.json();
      setBlueprint(data.blueprint);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoadingBlueprint(false);
    }
  }

  async function handleRemix(action: RemixAction) {
    if (!idea) return;
    setIsRemixing(true);
    setRemixAction(action);

    try {
      const res = await fetch("/api/remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, action, answers }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to remix idea");
      }

      const data = await res.json();
      const remixed = data.idea;
      setSelectedIdea(remixed);
      updateIdeaInSession(idea.id, remixed);
      setBlueprint(null);
      router.replace(`/idea/${remixed.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remix failed");
    } finally {
      setIsRemixing(false);
      setRemixAction(null);
    }
  }

  function handleSectionClick(sectionId: string) {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }

  if (!idea) {
    return (
      <main className="flex flex-col flex-1 min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-2xl font-bold">Idea not found</h1>
            <p className="text-muted-foreground">
              Generate some ideas first, then come back here.
            </p>
            <Link href="/generate">
              <Button className="gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Ideas
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const saved = isIdeaSaved(idea.id);

  return (
    <main className="flex flex-col flex-1 min-h-screen">
      <Navbar />
      <div className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>

            <div className="glass rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {idea.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {idea.pitch}
                  </p>
                </div>
                <button
                  onClick={() =>
                    saved
                      ? removeSavedIdea(idea.id)
                      : saveIdea(idea, currentBlueprint ?? undefined)
                  }
                  className="shrink-0 p-3 rounded-lg hover:bg-secondary/60 transition-colors"
                >
                  {saved ? (
                    <BookmarkCheck className="w-6 h-6 text-primary" />
                  ) : (
                    <Bookmark className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {idea.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {idea.timeEstimate}
                </Badge>
                {idea.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-secondary/80"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center justify-between"
              >
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateBlueprint}
                  className="gap-2"
                >
                  Retry
                </Button>
              </motion.div>
            )}

            <div className="flex gap-8">
              <aside className="hidden lg:block w-56 shrink-0">
                <div className="sticky top-24 space-y-6">
                  <BlueprintSidebar
                    activeSection={activeSection}
                    onSectionClick={handleSectionClick}
                  />
                  <Separator />
                  <RemixPanel
                    onRemix={handleRemix}
                    isRemixing={isRemixing}
                    currentAction={remixAction}
                  />
                  {currentBlueprint && (
                    <>
                      <Separator />
                      <ExportActions
                        idea={idea}
                        blueprint={currentBlueprint}
                      />
                    </>
                  )}
                </div>
              </aside>

              <div className="flex-1 min-w-0">
                {loadingBlueprint ? (
                  <BlueprintSkeleton />
                ) : currentBlueprint ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-12"
                  >
                    <OverviewSection blueprint={currentBlueprint} />
                    <ProblemSection blueprint={currentBlueprint} />
                    <FeaturesSection blueprint={currentBlueprint} />
                    <ArchitectureSection blueprint={currentBlueprint} />
                    <SchemaSection blueprint={currentBlueprint} />
                    <PagesSection blueprint={currentBlueprint} />
                    <ApiRoutesSection blueprint={currentBlueprint} />
                    <RoadmapSection blueprint={currentBlueprint} />
                    <StretchGoalsSection blueprint={currentBlueprint} />
                    <DesignSection blueprint={currentBlueprint} />
                  </motion.div>
                ) : null}

                <div className="lg:hidden mt-8 space-y-6">
                  <Separator />
                  <RemixPanel
                    onRemix={handleRemix}
                    isRemixing={isRemixing}
                    currentAction={remixAction}
                  />
                  {currentBlueprint && (
                    <>
                      <Separator />
                      <ExportActions
                        idea={idea}
                        blueprint={currentBlueprint}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function BlueprintSkeleton() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
