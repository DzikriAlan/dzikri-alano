"use client";

// 1. Import External Library
import { useEffect, useRef, useState, type ComponentProps } from "react";
import dynamic from "next/dynamic";

// 2. Import Types
import type { ClickTarget } from "./ParticleField";

// 5. Import Reusable Component
import type ParticleFieldComponent from "./ParticleField";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

// 7. Props
type Props = ComponentProps<typeof ParticleFieldComponent>;

export default function ParticleFieldLazy(props: Props) {
  // 8. State
  const containerRef = useRef<HTMLDivElement>(null);
  const clickIdRef = useRef(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clickTarget, setClickTarget] = useState<ClickTarget | null>(null);

  // 9. Effects
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasEnteredView(true);
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!props.withCube) return;

    const handleClick = (event: MouseEvent) => {
      const node = containerRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const withinBounds =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!withinBounds) return;

      clickIdRef.current += 1;
      setClickTarget({
        xNorm: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        yNorm: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
        id: clickIdRef.current,
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [props.withCube]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {hasEnteredView && <ParticleField {...props} active={isVisible} clickTarget={clickTarget} />}
    </div>
  );
}
