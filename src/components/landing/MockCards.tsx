"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  BarChart3,
  Zap,
  Brain,
  Code2,
  Palette,
} from "lucide-react";

const mockIdeas = [
  {
    title: "DevPulse",
    pitch: "A real-time developer activity dashboard that visualizes coding patterns and productivity trends.",
    difficulty: "intermediate",
    time: "3-4 weeks",
    tags: ["Dashboard", "Analytics", "WebSocket"],
    score: 94,
    icon: BarChart3,
  },
  {
    title: "PromptForge",
    pitch: "A collaborative prompt engineering workspace with version control and A/B testing for AI prompts.",
    difficulty: "advanced",
    time: "4-6 weeks",
    tags: ["AI", "Collaboration", "SaaS"],
    score: 91,
    icon: Brain,
  },
  {
    title: "PixelBrief",
    pitch: "An AI-powered design brief generator that turns vague client requests into structured creative briefs.",
    difficulty: "intermediate",
    time: "2-3 weeks",
    tags: ["Design", "AI", "Productivity"],
    score: 88,
    icon: Palette,
  },
  {
    title: "StackRadar",
    pitch: "A tech stack recommendation engine that analyzes project requirements and suggests optimal tool combinations.",
    difficulty: "advanced",
    time: "3-5 weeks",
    tags: ["Developer Tools", "AI", "Recommendation"],
    score: 85,
    icon: Code2,
  },
];

const difficultyColor: Record<string, string> = {
  beginner: "border difficulty-beginner",
  intermediate: "border difficulty-intermediate",
  advanced: "border difficulty-advanced",
  expert: "border difficulty-expert",
};

export function MockCards() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ideas that are actually <span className="gradient-text">worth building</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No more to-do apps. No more weather dashboards. Every idea is tailored
            to your skills, goals, and time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mockIdeas.map((idea, i) => (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="group relative glass rounded-xl p-6 hover:glow-sm transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                        <idea.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{idea.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          {idea.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {idea.score}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {idea.pitch}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${difficultyColor[idea.difficulty]}`}
                    >
                      {idea.difficulty}
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
