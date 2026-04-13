"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/landing/Navbar";
import { IdeaCard } from "@/components/results/IdeaCard";
import { useIdeaStore } from "@/store/useIdeaStore";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";
import type { ProjectIdea } from "@/types/idea";
import { useState, useMemo } from "react";
import Link from "next/link";

type SortKey = "score" | "difficulty" | "time";

const difficultyOrder: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

export default function ResultsPage() {
  const router = useRouter();
  const { currentSession, isGenerating, setSelectedIdea, setBlueprint } = useIdeaStore();
  const { answers } = useQuestionnaireStore();
  const [sortBy, setSortBy] = useState<SortKey>("score");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    if (!currentSession) return [];
    const tags = new Set<string>();
    currentSession.ideas.forEach((idea) =>
      idea.tags.forEach((t) => tags.add(t))
    );
    return Array.from(tags);
  }, [currentSession]);

  const sortedIdeas = useMemo(() => {
    if (!currentSession) return [];
    let ideas = [...currentSession.ideas];

    if (filterTag) {
      ideas = ideas.filter((idea) => idea.tags.includes(filterTag));
    }

    ideas.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "difficulty":
          return (
            (difficultyOrder[a.difficulty] ?? 0) -
            (difficultyOrder[b.difficulty] ?? 0)
          );
        case "time":
          return a.timeEstimate.localeCompare(b.timeEstimate);
        default:
          return 0;
      }
    });
    return ideas;
  }, [currentSession, sortBy, filterTag]);

  function handleExpand(idea: ProjectIdea) {
    setSelectedIdea(idea);
    setBlueprint(null);
    router.push(`/idea/${idea.id}`);
  }

  if (!currentSession || currentSession.ideas.length === 0) {
    return (
      <main className="flex flex-col flex-1 min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
              {isGenerating ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Sparkles className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-bold">
              {isGenerating ? "Generating ideas..." : "No ideas yet"}
            </h1>
            <p className="text-muted-foreground max-w-md">
              {isGenerating
                ? "Your ideas will appear one at a time as soon as each one is ready."
                : "Answer a few questions and let Veto generate project ideas tailored to you."}
            </p>
            {!isGenerating && (
              <Link href="/generate">
                <Button className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Generating
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 min-h-screen">
      <Navbar />
      <div className="flex-1 px-6 pt-24 pb-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Your Ideas
                </h1>
                <p className="text-muted-foreground mt-1">
                  {currentSession.ideas.length} ideas generated based on your
                  preferences{isGenerating ? " (more incoming...)" : ""}
                </p>
              </div>
              <Link href="/generate">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <SlidersHorizontal className="w-4 h-4" />
                Sort:
              </div>
              {(["score", "difficulty", "time"] as SortKey[]).map((key) => (
                <Button
                  key={key}
                  variant={sortBy === key ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSortBy(key)}
                  className="text-xs h-8"
                >
                  {key === "score"
                    ? "Match Score"
                    : key === "difficulty"
                    ? "Difficulty"
                    : "Build Time"}
                </Button>
              ))}

              {allTags.length > 0 && (
                <>
                  <div className="w-px h-6 bg-border mx-1" />
                  <div className="flex flex-wrap gap-1.5">
                    {filterTag && (
                      <Badge
                        variant="outline"
                        className="cursor-pointer text-xs hover:bg-secondary/60"
                        onClick={() => setFilterTag(null)}
                      >
                        Clear filter
                      </Badge>
                    )}
                    {allTags.slice(0, 8).map((tag) => (
                      <Badge
                        key={tag}
                        variant={filterTag === tag ? "default" : "secondary"}
                        className="cursor-pointer text-xs"
                        onClick={() =>
                          setFilterTag(filterTag === tag ? null : tag)
                        }
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {sortedIdeas.map((idea, i) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                index={i}
                onExpand={handleExpand}
              />
            ))}
          </div>

          {sortedIdeas.length === 0 && filterTag && (
            <div className="text-center py-12 text-muted-foreground">
              No ideas match the &ldquo;{filterTag}&rdquo; filter.
              <Button
                variant="link"
                onClick={() => setFilterTag(null)}
                className="ml-1"
              >
                Clear filter
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
