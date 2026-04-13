"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Bookmark,
  Sparkles,
  Trash2,
  Clock,
  Zap,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/landing/Navbar";
import { useIdeaStore } from "@/store/useIdeaStore";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function SavedPage() {
  const router = useRouter();
  const { savedIdeas, removeSavedIdea, setSelectedIdea, setBlueprint } =
    useIdeaStore();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return savedIdeas;
    const q = search.toLowerCase();
    return savedIdeas.filter(
      (si) =>
        si.idea.title.toLowerCase().includes(q) ||
        si.idea.pitch.toLowerCase().includes(q) ||
        si.idea.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [savedIdeas, search]);

  function handleExpand(item: (typeof savedIdeas)[number]) {
    setSelectedIdea(item.idea);
    setBlueprint(item.blueprint ?? null);
    router.push(`/idea/${item.idea.id}`);
  }

  if (savedIdeas.length === 0) {
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
              <Bookmark className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">No saved ideas yet</h1>
            <p className="text-muted-foreground max-w-md">
              Generate some ideas and bookmark the ones you love. They&apos;ll
              show up here for easy access.
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
                  Saved Ideas
                </h1>
                <p className="text-muted-foreground mt-1">
                  {savedIdeas.length} idea{savedIdeas.length !== 1 && "s"} saved
                </p>
              </div>
            </div>

            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search saved ideas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </motion.div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  layout
                >
                  <div className="group relative glass rounded-xl p-6 hover:glow-sm transition-all duration-300">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {item.idea.title}
                            </h3>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-primary" />
                              <span className="text-sm font-medium text-primary">
                                {item.idea.score}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.idea.pitch}
                          </p>
                        </div>
                        <button
                          onClick={() => removeSavedIdea(item.idea.id)}
                          className="shrink-0 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.idea.timeEstimate}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {item.idea.difficulty}
                        </Badge>
                        {item.blueprint && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-primary/10 text-primary"
                          >
                            Has Blueprint
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {item.idea.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-secondary/80"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={() => handleExpand(item)}
                          className="flex-1 gap-2"
                          variant="secondary"
                          size="sm"
                        >
                          View Blueprint
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-[10px] text-muted-foreground/60">
                        Saved{" "}
                        {new Date(item.savedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && search.trim() && (
            <div className="text-center py-12 text-muted-foreground">
              No saved ideas match &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
