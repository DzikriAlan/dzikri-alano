"use client";

// 1. Import External Library
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

// 5. Import Reusable Component
import { Button } from "@/components/ui/button";
import ParticleFieldLazy from "@/shared/components/ParticleFieldLazy";
import { PARTICLE_THEME } from "@/shared/components/ParticleField";

// 7. Static Data
import { landingSkills, landingTestimonials } from "../static/landingData";

const frontendSkills = landingSkills.filter((skill) =>
  [
    "Vue.js",
    "Nuxt.js",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "HTML",
    "CSS",
  ].includes(skill.label),
);

const AI_PROFICIENCY_SCORE = 90;

export default function LandingOverview() {
  // 8. State
  const [now, setNow] = useState<Date | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // 9. Effects
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 11. Methods / Handlers
  const handlePrevTestimonial = () => {
    setActiveTestimonial(
      (index) => (index - 1 + landingTestimonials.length) % landingTestimonials.length,
    );
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((index) => (index + 1) % landingTestimonials.length);
  };

  const testimonial = landingTestimonials[activeTestimonial];

  const dateLabel = now?.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Jakarta",
  });

  const timeLabel = now?.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Jakarta",
  });

  return (
    <section id="overview" className="relative scroll-mt-28 overflow-hidden pb-20 pt-8 sm:pt-12 lg:py-20">
      <ParticleFieldLazy
        {...PARTICLE_THEME}
        density={700}
        speed={0.4}
        particleSize={0.022}
        withCube
        cubeSeed={1}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Intro card */}
          <div className="flex flex-col justify-between rounded-2xl border border-surface-border bg-black p-6 lg:col-span-1">
            <div>
              <p className="text-xl font-semibold leading-snug text-brand">
                Frontend Developer experienced in taking products from
                concept to launch.
              </p>
              <p className="mt-4 text-sm text-neutral-300">
                If you&apos;re looking to build a scalable, AI-driven web
                product, get in touch to discuss your requirements with me
                in more detail.
              </p>
              <Button asChild className="mt-6 rounded-full">
                <a
                  href="https://wa.me/6282123339099"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  Say hello
                </a>
              </Button>
            </div>

            <div className="mt-10">
              <p className="text-sm text-neutral-300">{dateLabel ?? " "}</p>
              <p className="font-mono text-2xl font-semibold text-foreground">
                {timeLabel ?? "--:--:--"}
              </p>
            </div>
          </div>

          {/* Testimonial carousel */}
          <div className="flex flex-col justify-between rounded-2xl border border-surface-border bg-black p-6 lg:col-span-2">
            <div>
              <span className="mb-4 block text-3xl font-serif text-brand">
                &ldquo;
              </span>
              <p className="text-lg leading-relaxed text-foreground sm:text-xl">
                {testimonial.quote}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <a
                href={testimonial.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <p className="text-sm font-semibold text-foreground group-hover:text-brand group-hover:underline">
                  {testimonial.name}
                </p>
                <p className="text-xs text-neutral-300">{testimonial.role}</p>
              </a>

              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {landingTestimonials.map((item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      aria-label={`Show testimonial from ${item.name}`}
                      onClick={() => setActiveTestimonial(index)}
                      className={`size-1.5 rounded-full transition-colors ${
                        index === activeTestimonial
                          ? "bg-brand"
                          : "bg-neutral-600"
                      }`}
                    />
                  ))}
                </div>
                <div className="hidden gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={handlePrevTestimonial}
                    aria-label="Previous testimonial"
                    className="flex size-8 items-center justify-center rounded-full border border-surface-border text-foreground hover:bg-surface-hover"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTestimonial}
                    aria-label="Next testimonial"
                    className="flex size-8 items-center justify-center rounded-full border border-surface-border text-foreground hover:bg-surface-hover"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Skill highlight cards */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="rounded-2xl border border-surface-border bg-black p-6">
              <h3 className="font-semibold text-foreground">
                Frontend Engineering
              </h3>
              <p className="mt-2 text-sm text-neutral-300">
                Building scalable, maintainable interfaces with Vue, Nuxt,
                Next.js, and React.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {frontendSkills.map((skill) => (
                  <div
                    key={skill.label}
                    className="flex size-9 items-center justify-center rounded-lg border border-surface-border bg-neutral-900"
                    title={skill.label}
                  >
                    <div className="relative size-4">
                      <Image
                        src={skill.icon}
                        alt={skill.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-2xl border border-surface-border bg-black p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-foreground">
                  Frontend AI Application Specialist
                </h3>
                <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                  {AI_PROFICIENCY_SCORE}/100
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${AI_PROFICIENCY_SCORE}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-neutral-300">
                Prompt and context engineering, LLM integration, and
                AI-driven code generation across chat interfaces, semantic
                search, and MCP servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
