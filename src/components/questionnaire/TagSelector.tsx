"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TagSelectorProps {
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  max?: number;
}

export function TagSelector({ options, selected, onToggle, max }: TagSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const isDisabled = !isSelected && max !== undefined && selected.length >= max;

        return (
          <motion.button
            key={option.id}
            whileHover={!isDisabled ? { scale: 1.05 } : undefined}
            whileTap={!isDisabled ? { scale: 0.95 } : undefined}
            onClick={() => !isDisabled && onToggle(option.id)}
            disabled={isDisabled}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              isSelected
                ? "bg-primary/15 border-primary/50 text-primary"
                : isDisabled
                ? "bg-secondary/20 border-border/50 text-muted-foreground/50 cursor-not-allowed"
                : "bg-secondary/30 border-border hover:bg-secondary/60 hover:border-border text-foreground"
            )}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
