import { useEffect, useRef, useState } from "react";

interface LandingStatCounterProps {
  value: string;
}

const parseStatValue = (value: string) => {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { target: 0, prefix: "", suffix: value };
  return { target: parseFloat(match[1]), prefix: "", suffix: match[2] };
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function LandingStatCounter({ value }: LandingStatCounterProps) {
  const { target, suffix } = parseStatValue(value);
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLParagraphElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const duration = 1200;
        const startTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          setCount(target * easeOutExpo(progress));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const displayValue = Number.isInteger(target)
    ? Math.round(count)
    : count.toFixed(1);

  return (
    <p ref={elementRef} className="text-2xl font-bold text-brand">
      {displayValue}
      {suffix}
    </p>
  );
}
