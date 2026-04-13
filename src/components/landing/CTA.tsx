"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center space-y-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ready to build something <span className="gradient-text">real</span>?
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Stop scrolling for inspiration. Let Veto find the project that
          matches your skills, your goals, and your ambition.
        </p>
        <Link
          href="/generate"
          className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 glow transition-all"
        >
          Generate Your Ideas
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </section>
  );
}
