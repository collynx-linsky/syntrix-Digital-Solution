"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import { IMAGES } from "@/lib/images";
import type { HeroSection } from "./types";

export function Hero({ content }: { content: HeroSection }) {
  const { eyebrow, titleLine1, titleLine2, subtitle, primaryCta, secondaryCta, trustBadge } = content;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={IMAGES.heroTeam}
          alt="Syntrix engineering team collaborating on a client project"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/85 to-brand-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/40 to-transparent" />
      </div>

      <div className="container-page relative py-28 lg:py-40">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300 backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            {eyebrow}
          </span>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-white">{titleLine1}</span>
            <span className="block text-gold-400">{titleLine2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-ink-200">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-400"
            >
              {primaryCta}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              {secondaryCta}
            </Link>
          </div>
          <p className="mt-8 text-xs font-medium uppercase tracking-wider text-ink-300">{trustBadge}</p>
        </div>
      </div>
    </section>
  );
}
