// 1. Import External Library
import type { NextPage } from "next";
import Head from "next/head";

// 5. Import Feature Components
import LandingHero from "@/features/landing/components/landingHero";
import LandingOverview from "@/features/landing/components/landingOverview";
import LandingStrategy from "@/features/landing/components/landingStrategy";
import LandingFaq from "@/features/landing/components/landingFaq";
import LandingWork from "@/features/landing/components/landingWork";
import LandingFooter from "@/features/landing/components/landingFooter";
import { useScrollSpy } from "@/features/landing/hooks/useScrollSpy";
import ParticleFieldLazy from "@/shared/components/ParticleFieldLazy";
import { PARTICLE_THEME } from "@/shared/components/ParticleField";

const SECTION_IDS = ["home", "work"];

const Home: NextPage = () => {
  useScrollSpy(SECTION_IDS);

  return (
    <>
      <Head>
        <title>DzikriAlan | Frontend Developer</title>
        <meta
          name="description"
          content="Dzikri Alan is a Frontend Developer who builds modern, fast and scalable web applications."
        />
      </Head>
      <main className="min-h-screen bg-neutral-950">
        <LandingHero />
        <LandingOverview />
        <LandingWork />
        <div className="relative overflow-hidden">
          <ParticleFieldLazy
            {...PARTICLE_THEME}
            density={1800}
            speed={0.4}
            particleSize={0.022}
            withCube
            cubeSeed={2}
          />
          <LandingStrategy />
          <LandingFaq />
          <LandingFooter />
        </div>
      </main>
    </>
  );
};

export default Home;
