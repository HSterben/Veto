"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Database,
  ArrowRight,
} from "lucide-react";
import type { ProjectBlueprint } from "@/types/blueprint";

interface SectionProps {
  blueprint: ProjectBlueprint;
}

export function OverviewSection({ blueprint }: SectionProps) {
  return (
    <section id="overview" className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Project Overview</h2>
      <div className="prose prose-invert max-w-none">
        <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
          {blueprint.overview}
        </p>
      </div>
    </section>
  );
}

export function ProblemSection({ blueprint }: SectionProps) {
  return (
    <section id="problem" className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Problem & Audience
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 space-y-2">
          <h3 className="font-semibold text-sm text-primary">The Problem</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {blueprint.problem}
          </p>
        </div>
        <div className="glass rounded-xl p-5 space-y-2">
          <h3 className="font-semibold text-sm text-primary">
            Target Audience
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {blueprint.audience}
          </p>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection({ blueprint }: SectionProps) {
  const mvpFeatures = blueprint.features.filter((f) => f.priority === "mvp");
  const stretchFeatures = blueprint.features.filter(
    (f) => f.priority === "stretch"
  );

  return (
    <section id="features" className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Features</h2>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> MVP Features
        </h3>
        <div className="space-y-2">
          {mvpFeatures.map((f) => (
            <div
              key={f.name}
              className="glass rounded-lg p-4 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-sm">{f.name}</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {stretchFeatures.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Circle className="w-4 h-4" /> Stretch Goals
          </h3>
          <div className="space-y-2">
            {stretchFeatures.map((f) => (
              <div
                key={f.name}
                className="glass rounded-lg p-4 flex items-start gap-3 opacity-80"
              >
                <Circle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-sm">{f.name}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function ArchitectureSection({ blueprint }: SectionProps) {
  return (
    <section id="architecture" className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Architecture</h2>
      <p className="text-sm text-foreground/80 leading-relaxed">
        {blueprint.architecture.overview}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {blueprint.architecture.components.map((comp) => (
          <div key={comp.name} className="glass rounded-lg p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{comp.name}</span>
              <Badge variant="secondary" className="text-[10px]">
                {comp.tech}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{comp.description}</p>
          </div>
        ))}
      </div>

      {blueprint.architecture.diagram && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3 text-primary">Diagram</h3>
          <pre className="text-xs text-muted-foreground overflow-x-auto font-mono whitespace-pre">
            {blueprint.architecture.diagram}
          </pre>
        </div>
      )}
    </section>
  );
}

export function SchemaSection({ blueprint }: SectionProps) {
  return (
    <section id="schema" className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Database Schema</h2>
      <div className="space-y-4">
        {blueprint.schema.map((table) => (
          <div key={table.name} className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm font-mono">
                {table.name}
              </span>
            </div>
            <div className="divide-y divide-border/30">
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className="px-5 py-2.5 flex items-center gap-4 text-sm"
                >
                  <span className="font-mono text-xs w-32 shrink-0 text-foreground">
                    {col.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {col.type}
                  </Badge>
                  {col.constraints && (
                    <span className="text-xs text-muted-foreground">
                      {col.constraints}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PagesSection({ blueprint }: SectionProps) {
  return (
    <section id="pages" className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Pages & Screens</h2>
      <div className="space-y-3">
        {blueprint.pages.map((page) => (
          <div key={page.route} className="glass rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-3">
              <code className="text-xs font-mono px-2 py-1 rounded bg-secondary/80 text-primary">
                {page.route}
              </code>
              <span className="font-medium text-sm">{page.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">{page.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {page.components.map((comp) => (
                <Badge
                  key={comp}
                  variant="outline"
                  className="text-[10px]"
                >
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ApiRoutesSection({ blueprint }: SectionProps) {
  const methodColors: Record<string, string> = {
    GET: "http-get",
    POST: "http-post",
    PUT: "http-put",
    PATCH: "http-patch",
    DELETE: "http-delete",
  };

  return (
    <section id="api" className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">API Routes</h2>
      <div className="space-y-2">
        {blueprint.apiRoutes.map((route) => (
          <div
            key={`${route.method}-${route.path}`}
            className="glass rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex min-w-[3.25rem] items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-mono font-bold ${
                  methodColors[route.method.toUpperCase()] ??
                  "bg-secondary text-secondary-foreground"
                }`}
              >
                {route.method}
              </span>
              <code className="text-xs font-mono text-foreground">
                {route.path}
              </code>
            </div>
            <p className="text-xs text-muted-foreground">
              {route.description}
            </p>
            {route.response && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowRight className="w-3 h-3" />
                <span>{route.response}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function RoadmapSection({ blueprint }: SectionProps) {
  return (
    <section id="roadmap" className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Roadmap</h2>
      <div className="space-y-4">
        {blueprint.roadmap.map((phase, i) => (
          <div key={phase.phase} className="relative pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
            <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-primary" />

            <div className="glass rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs font-mono">
                  Phase {phase.phase}
                </Badge>
                <span className="font-semibold text-sm">{phase.title}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {phase.duration}
                </span>
              </div>
              <ul className="space-y-1.5">
                {phase.tasks.map((task) => (
                  <li
                    key={task}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StretchGoalsSection({ blueprint }: SectionProps) {
  return (
    <section id="stretch" className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Stretch Goals</h2>
      <div className="space-y-2">
        {blueprint.stretchGoals.map((goal) => (
          <div key={goal} className="glass rounded-lg p-4 flex items-start gap-3">
            <Circle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-sm text-foreground/80">{goal}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DesignSection({ blueprint }: SectionProps) {
  return (
    <section id="design" className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Design Direction</h2>
      <div className="glass rounded-xl p-5">
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          {blueprint.designDirection}
        </p>
      </div>
    </section>
  );
}
