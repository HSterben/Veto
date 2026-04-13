"use client";

import { motion } from "motion/react";
import { ClipboardList, Sparkles, Layers, Rocket } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Answer a few questions",
    description:
      "Tell us what you want to build, your skill level, tech preferences, and what matters most to you.",
  },
  {
    icon: Sparkles,
    title: "AI generates ideas",
    description:
      "Our AI analyzes your answers and returns ranked, unique project ideas, not generic suggestions.",
  },
  {
    icon: Layers,
    title: "Expand into a blueprint",
    description:
      "Click any idea to get a full project plan: features, schema, API routes, architecture, and a roadmap.",
  },
  {
    icon: Rocket,
    title: "Start building",
    description:
      "Save your blueprint, export it as markdown, remix it to fit your style, and start shipping.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            From zero to <span className="gradient-text">blueprint</span> in minutes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four steps between you and a project idea worth committing to.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative"
            >
              <div className="glass rounded-xl p-6 h-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-base">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
