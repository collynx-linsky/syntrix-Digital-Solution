// Mirrors the shape of PageTranslation.sections for slug="homepage"
// (backend/apps/pages/models.py) — each key matches a section component.

export type HeroSection = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  trustBadge: string;
};

export type IntroSection = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  badgeValue: string;
  badgeLabel: string;
};

export type OverviewSection = {
  eyebrow: string;
  title: string;
  description: string;
  pillars: { title: string; description: string }[];
};

export type FeaturedProjectsSection = {
  eyebrow: string;
  title: string;
  description: string;
};

export type ServicesSection = {
  eyebrow: string;
  title: string;
  description: string;
  viewAll: string;
};

export type TechStackSection = {
  eyebrow: string;
  title: string;
  description: string;
  categories: { label: string; items: string[] }[];
};

export type WhyChooseUsSection = {
  eyebrow: string;
  title: string;
  reasons: { title: string; description: string }[];
};

export type IndustriesSection = {
  eyebrow: string;
  title: string;
  items: { title: string; description: string }[];
};

export type StatsSection = {
  eyebrow: string;
  items: { value: string; label: string }[];
};

export type TestimonialsSection = {
  eyebrow: string;
  title: string;
  items: { quote: string; name: string; role: string }[];
};

export type CtaSection = {
  title: string;
  description: string;
  primary: string;
  secondary: string;
};

export type HomeSections = {
  hero: HeroSection;
  intro: IntroSection;
  overview: OverviewSection;
  featuredProjects: FeaturedProjectsSection;
  services: ServicesSection;
  techStack: TechStackSection;
  whyChooseUs: WhyChooseUsSection;
  industries: IndustriesSection;
  stats: StatsSection;
  testimonials: TestimonialsSection;
  cta: CtaSection;
};
