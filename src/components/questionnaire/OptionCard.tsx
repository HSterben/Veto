"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function OptionCard({
  label,
  description,
  selected,
  onClick,
  className,
}: OptionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start gap-1 rounded-xl p-4 text-left transition-all border",
        selected
          ? "border-primary bg-primary/10 glow-sm"
          : "border-border bg-secondary/30 hover:bg-secondary/60 hover:border-border",
        className
      )}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-primary-foreground" />
        </motion.div>
      )}
      <span className="font-medium text-sm">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </motion.button>
  );
}
