"use client";

import { Button } from "@/components/ui/button";
import { Copy, FileText, Check } from "lucide-react";
import type { ProjectBlueprint } from "@/types/blueprint";
import type { ProjectIdea } from "@/types/idea";
import { useState } from "react";

interface ExportActionsProps {
  idea: ProjectIdea;
  blueprint: ProjectBlueprint;
}

export function ExportActions({ idea, blueprint }: ExportActionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  function toMarkdown(): string {
    let md = `# ${idea.title}\n\n`;
    md += `> ${idea.pitch}\n\n`;
    md += `## Overview\n\n${blueprint.overview}\n\n`;
    md += `## Problem\n\n${blueprint.problem}\n\n`;
    md += `## Target Audience\n\n${blueprint.audience}\n\n`;

    md += `## Features\n\n`;
    md += `### MVP\n\n`;
    blueprint.features
      .filter((f) => f.priority === "mvp")
      .forEach((f) => {
        md += `- **${f.name}**: ${f.description}\n`;
      });
    const stretch = blueprint.features.filter((f) => f.priority === "stretch");
    if (stretch.length > 0) {
      md += `\n### Stretch\n\n`;
      stretch.forEach((f) => {
        md += `- **${f.name}**: ${f.description}\n`;
      });
    }

    md += `\n## Architecture\n\n${blueprint.architecture.overview}\n\n`;
    blueprint.architecture.components.forEach((c) => {
      md += `- **${c.name}** (${c.tech}): ${c.description}\n`;
    });

    if (blueprint.architecture.diagram) {
      md += `\n\`\`\`\n${blueprint.architecture.diagram}\n\`\`\`\n`;
    }

    md += `\n## Database Schema\n\n`;
    blueprint.schema.forEach((table) => {
      md += `### ${table.name}\n\n`;
      md += `| Column | Type | Constraints |\n|--------|------|-------------|\n`;
      table.columns.forEach((col) => {
        md += `| ${col.name} | ${col.type} | ${col.constraints} |\n`;
      });
      md += `\n`;
    });

    md += `## Pages\n\n`;
    blueprint.pages.forEach((page) => {
      md += `- **${page.name}** (\`${page.route}\`): ${page.description}\n`;
    });

    md += `\n## API Routes\n\n`;
    blueprint.apiRoutes.forEach((route) => {
      md += `- \`${route.method} ${route.path}\`: ${route.description}\n`;
    });

    md += `\n## Roadmap\n\n`;
    blueprint.roadmap.forEach((phase) => {
      md += `### Phase ${phase.phase}: ${phase.title} (${phase.duration})\n\n`;
      phase.tasks.forEach((task) => {
        md += `- [ ] ${task}\n`;
      });
      md += `\n`;
    });

    if (blueprint.stretchGoals.length > 0) {
      md += `## Stretch Goals\n\n`;
      blueprint.stretchGoals.forEach((g) => {
        md += `- ${g}\n`;
      });
    }

    md += `\n## Design Direction\n\n${blueprint.designDirection}\n`;

    return md;
  }

  function toPlainText(): string {
    let text = `${idea.title}\n${"=".repeat(idea.title.length)}\n\n`;
    text += `${idea.pitch}\n\n`;
    text += `OVERVIEW\n${blueprint.overview}\n\n`;
    text += `PROBLEM\n${blueprint.problem}\n\n`;
    text += `AUDIENCE\n${blueprint.audience}\n\n`;
    text += `FEATURES\n`;
    blueprint.features.forEach((f) => {
      text += `  [${f.priority.toUpperCase()}] ${f.name}: ${f.description}\n`;
    });
    text += `\nROADMAP\n`;
    blueprint.roadmap.forEach((phase) => {
      text += `  Phase ${phase.phase} - ${phase.title} (${phase.duration})\n`;
      phase.tasks.forEach((t) => {
        text += `    - ${t}\n`;
      });
    });
    return text;
  }

  async function copyToClipboard(format: "markdown" | "text") {
    const content = format === "markdown" ? toMarkdown() : toPlainText();
    await navigator.clipboard.writeText(content);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Export</h3>
      <div className="space-y-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full gap-2 text-xs h-9 justify-start"
          onClick={() => copyToClipboard("markdown")}
        >
          {copied === "markdown" ? (
            <Check className="w-3.5 h-3.5 text-success" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
          Copy as Markdown
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-full gap-2 text-xs h-9 justify-start"
          onClick={() => copyToClipboard("text")}
        >
          {copied === "text" ? (
            <Check className="w-3.5 h-3.5 text-success" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          Copy as Plain Text
        </Button>
      </div>
    </div>
  );
}
