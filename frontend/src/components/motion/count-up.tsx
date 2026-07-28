"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Animates a numeric prefix (e.g. "50+", "99.9%", "4") counting up once visible. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]!) : null;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1]!.includes(".") ? match[1]!.split(".")[1]!.length : 0;

  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(target === null ? value : (0).toFixed(decimals));

  useEffect(() => {
    if (!inView || target === null) return;
    const finalTarget = target;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((finalTarget * eased).toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target, decimals]);

  return (
    <p ref={ref} className={className}>
      {display}
      {suffix}
    </p>
  );
}
