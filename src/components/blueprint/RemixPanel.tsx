"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowDownCircle,
  Sparkles,
  Fingerprint,
  DollarSign,
  Layers,
  Smartphone,
  User,
  Zap,
  Loader2,
} from "lucide-react";
import type { RemixAction } from "@/types/api";

const remixActions: {
  action: RemixAction;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { action: "easier", label: "Make Easier", icon: ArrowDownCircle },
  { action: "more-impressive", label: "More Impressive", icon: Sparkles },
  { action: "more-unique", label: "More Unique", icon: Fingerprint },
  { action: "more-monetizable", label: "Monetizable", icon: DollarSign },
  { action: "full-stack", label: "Full-Stack", icon: Layers },
  { action: "mobile-first", label: "Mobile-First", icon: Smartphone },
  { action: "solo-dev-friendly", label: "Solo-Dev", icon: User },
  { action: "faster-to-build", label: "Build Faster", icon: Zap },
];

interface RemixPanelProps {
  onRemix: (action: RemixAction) => void;
  isRemixing: boolean;
  currentAction: RemixAction | null;
}

export function RemixPanel({
  onRemix,
  isRemixing,
  currentAction,
}: RemixPanelProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Remix This Idea</h3>
      <div className="grid grid-cols-2 gap-2">
        {remixActions.map(({ action, label, icon: Icon }) => (
          <Button
            key={action}
            variant="secondary"
            size="sm"
            className="gap-2 text-xs h-9 justify-start"
            onClick={() => onRemix(action)}
            disabled={isRemixing}
          >
            {isRemixing && currentAction === action ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Icon className="w-3.5 h-3.5" />
            )}
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
