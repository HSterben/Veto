import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MockCards } from "@/components/landing/MockCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Navbar />
      <Hero />
      <MockCards />
      <HowItWorks />
      <CTA />
      <footer className="py-8 px-6 border-t border-border">
        <div className="mx-auto max-w-7xl flex items-center justify-between text-sm text-muted-foreground">
          <span>Veto</span>
          <span>Built for developers who ship.</span>
        </div>
      </footer>
    </main>
  );
}
