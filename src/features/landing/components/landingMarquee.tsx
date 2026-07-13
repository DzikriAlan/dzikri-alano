// 1. Import External Library
import Image from "next/image";

// 7. Static Data
import { landingSkills } from "../static/landingData";

const track = [...landingSkills, ...landingSkills];

const dotGridIds = [
  "a1", "a2", "a3", "a4",
  "b1", "b2", "b3", "b4",
  "c1", "c2", "c3", "c4",
  "d1", "d2", "d3", "d4",
];

export default function LandingMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-surface-border/60 bg-neutral-950 py-8">
      {/* Decorative grid backdrop, consistent with the Hero/Services seam. bg-fixed keeps the
          48px grid locked to viewport coordinates so it lines up with Hero/Services' identical grid. */}
      <div className="pointer-events-none absolute inset-0 bg-fixed [background-image:linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Corner dot accents, top-left and bottom-left */}
      <div className="pointer-events-none absolute left-8 top-4 hidden grid-cols-4 gap-2 lg:grid">
        {dotGridIds.map((id) => (
          <span key={id} className="size-1 rounded-full bg-foreground/15" />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-4 left-8 hidden grid-cols-4 gap-2 lg:grid">
        {dotGridIds.map((id) => (
          <span key={`${id}-b`} className="size-1 rounded-full bg-foreground/15" />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-neutral-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-neutral-950 to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-10 [animation-play-state:running] hover:[animation-play-state:paused]">
        {track.map((skill, index) => (
          <div
            key={`${skill.label}-${index}`}
            className="flex shrink-0 items-center gap-3 rounded-full border border-surface-border bg-black px-5 py-2.5"
          >
            <div className="relative size-5 shrink-0">
              <Image
                src={skill.icon}
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <span className="whitespace-nowrap text-sm font-medium text-neutral-300">
              {skill.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
