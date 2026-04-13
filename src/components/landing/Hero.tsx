"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-mesh overflow-hidden">
      <FloatingOrbs />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Project Ideas
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Stop staring at
            <br />
            <span className="gradient-text">blank folders.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get a project idea worth building. Answer a few questions, and Veto
            generates tailored ideas with full blueprints, architecture,
            schema, roadmap, and everything you need to start.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/generate"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 glow transition-all"
            >
              Generate Ideas
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-medium border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-chart-2/5 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -20, 10, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-chart-3/5 blur-3xl"
      />
    </div>
  );
}
