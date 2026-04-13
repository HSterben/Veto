"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Bookmark } from "lucide-react";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 group-hover:glow transition-shadow">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Veto</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/saved"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link
            href="/generate"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 glow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Ideas
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
