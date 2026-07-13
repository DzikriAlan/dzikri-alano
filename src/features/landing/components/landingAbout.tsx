// 1. Import External Library
import Image from "next/image";
import { Download } from "lucide-react";

// 5. Import Reusable Component
import { Button } from "@/components/ui/button";

// 5. Import Reusable Component (cont.)
import LandingStatCounter from "./landingStatCounter";

// 7. Static Data
import { landingStats } from "../static/landingData";
import aboutArt from "@/shared/assets/about.webp";

export default function LandingAbout() {
  return (
    <section id="about" className="scroll-mt-28 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 md:grid-cols-2 lg:px-12 xl:px-20">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-surface-border bg-black">
          <Image
            src={aboutArt}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="mb-2 font-mono text-sm font-medium uppercase tracking-widest text-brand">ABOUT ME</p>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Get to know me <span className="text-brand">better</span>.
          </h2>
          <p className="mt-4 text-sm text-neutral-300 sm:text-base">
            Experienced Frontend Developer with 3 years in tech solutions and
            digital products. Proven success in optimizing developer
            workflows and engineering advanced AI-driven web applications,
            including interactive AI chat interfaces, data visualization for
            statistics, and fact-checking platforms.
          </p>
          <p className="mt-4 text-sm text-neutral-300 sm:text-base">
            Deeply skilled in Next.js, Nuxt, Vue, and React (TypeScript),
            with a strong focus on UI architecture, real-time data streaming
            (SSE/WebSockets), and high-performance API integration.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {landingStats.map((stat) => (
              <div key={stat.label}>
                <LandingStatCounter value={stat.value} />
                <p className="text-xs text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button variant="outline">
              Download CV
              <Download />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
