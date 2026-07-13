// 1. Import External Library
import Image from "next/image";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";

// 6. Import Assets
import guyPhoto from "@/shared/assets/guey.webp";

// 7. Static Data
const socialLinks = [
  { href: "https://github.com/DzikriAlan", label: "Github", icon: Github },
  { href: "https://www.linkedin.com/in/dzikri-alan/", label: "LinkedIn", icon: Linkedin },
  { href: "https://www.instagram.com/_dzikrialan/", label: "Instagram", icon: Instagram },
  { href: "mailto:dzikrialan0@gmail.com", label: "Email", icon: Mail },
];

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-surface-border/60 bg-black py-24 sm:py-32">
      <div className="pointer-events-none absolute bottom-0 right-6 h-64 w-56 sm:right-10 sm:h-80 sm:w-72 lg:right-20 lg:h-96 lg:w-80">
        <Image src={guyPhoto} alt="" fill className="object-contain object-bottom" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-20">
        <h2 className="max-w-2xl text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-5xl">
          It&apos;s time to build your next web project. Let&apos;s work
          together and deliver success.
        </h2>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <a
            href="mailto:dzikrialan0@gmail.com"
            className="inline-block text-2xl font-medium text-brand underline-offset-4 hover:underline sm:text-3xl"
          >
            dzikrialan0@gmail.com
          </a>

          <div className="flex gap-4 text-neutral-400">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="hover:text-foreground"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
