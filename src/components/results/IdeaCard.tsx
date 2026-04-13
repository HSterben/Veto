"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Zap,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Star,
} from "lucide-react";
import type { ProjectIdea } from "@/types/idea";
import { useIdeaStore } from "@/store/useIdeaStore";
import { cn } from "@/lib/utils";

const difficultyConfig: Record<string, { color: string; label: string }> = {
  beginner: {
    color: "border difficulty-beginner",
    label: "Beginner",
  },
  intermediate: {
    color: "border difficulty-intermediate",
    label: "Intermediate",
  },
  advanced: {
    color: "border difficulty-advanced",
    label: "Advanced",
  },
  expert: {
    color: "border difficulty-expert",
    label: "Expert",
  },
};

const portfolioConfig: Record<string, { color: string; stars: number }> = {
  low: { color: "text-muted-foreground", stars: 1 },
  medium: { color: "text-primary/80", stars: 2 },
  high: { color: "text-primary", stars: 3 },
  "very-high": { color: "text-primary", stars: 4 },
};

interface IdeaCardProps {
  idea: ProjectIdea;
  index: number;
  onExpand: (idea: ProjectIdea) => void;
}

export function IdeaCard({ idea, index, onExpand }: IdeaCardProps) {
  const { saveIdea, removeSavedIdea, isIdeaSaved } = useIdeaStore();
  const saved = isIdeaSaved(idea.id);
  const difficulty = difficultyConfig[idea.difficulty];
  const portfolio = portfolioConfig[idea.portfolioValue];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      layout
    >
      <div className="group relative glass rounded-xl p-6 hover:glow-sm transition-all duration-300">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{idea.title}</h3>
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {idea.score}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {idea.pitch}
              </p>
            </div>
            <button
              onClick={() =>
                saved ? removeSavedIdea(idea.id) : saveIdea(idea)
              }
              className="shrink-0 p-2 rounded-lg hover:bg-secondary/60 transition-colors"
            >
              {saved ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <Bookmark className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>

          <p className="text-sm text-foreground/80 italic">
            &ldquo;{idea.rationale}&rdquo;
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {idea.timeEstimate}
            </span>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: portfolio?.stars ?? 0 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3 fill-current",
                    portfolio?.color
                  )}
                />
              ))}
              <span className="ml-1">Portfolio</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">Stack:</span>
            {idea.stack.slice(0, 5).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-[10px] bg-secondary/80"
              >
                {tech}
              </Badge>
            ))}
            {idea.stack.length > 5 && (
              <span className="text-muted-foreground">
                +{idea.stack.length - 5}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                difficulty?.color
              )}
            >
              {difficulty?.label}
            </span>
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

          <div className="pt-2 border-t border-border/50">
            <div className="flex items-start gap-2 text-xs">
              <Zap className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                <span className="text-foreground font-medium">
                  Standout:
                </span>{" "}
                {idea.standoutFeature}
              </span>
            </div>
          </div>

          <Button
            onClick={() => onExpand(idea)}
            className="w-full gap-2 mt-2"
            variant="secondary"
          >
            Expand Blueprint
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
