"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  Users,
  LayoutList,
  Database,
  Globe,
  Route,
  Map,
  Rocket,
  Palette,
  Target,
} from "lucide-react";

const sections = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "problem", label: "Problem & Audience", icon: Target },
  { id: "features", label: "Features", icon: LayoutList },
  { id: "architecture", label: "Architecture", icon: Globe },
  { id: "schema", label: "Database Schema", icon: Database },
  { id: "pages", label: "Pages", icon: Route },
  { id: "api", label: "API Routes", icon: Globe },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "stretch", label: "Stretch Goals", icon: Rocket },
  { id: "design", label: "Design Direction", icon: Palette },
];

interface BlueprintSidebarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function BlueprintSidebar({
  activeSection,
  onSectionClick,
}: BlueprintSidebarProps) {
  return (
    <nav className="space-y-1">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionClick(section.id)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
            activeSection === section.id
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <section.icon className="w-4 h-4 shrink-0" />
          {section.label}
        </button>
      ))}
    </nav>
  );
}
