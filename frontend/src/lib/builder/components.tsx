import type { RegisteredComponent } from "@builder.io/sdk-react";
import { Hero } from "@/components/home/hero";
import { Cta } from "@/components/home/cta";

// Pilot slice — 2 of the Homepage's 11 sections, to validate the mechanical
// integration (registration, RSC boundary, RTL) before registering the rest.
// `content` mirrors HeroSection/CtaSection from components/home/types.ts
// exactly, so Hero/Cta need no changes to work as Builder blocks.
export const builderCustomComponents: RegisteredComponent[] = [
  {
    component: Hero,
    name: "Hero",
    inputs: [
      {
        name: "content",
        type: "object",
        subFields: [
          { name: "eyebrow", type: "string" },
          { name: "titleLine1", type: "string" },
          { name: "titleLine2", type: "string" },
          { name: "subtitle", type: "string" },
          { name: "primaryCta", type: "string" },
          { name: "secondaryCta", type: "string" },
          { name: "trustBadge", type: "string" },
        ],
      },
    ],
  },
  {
    component: Cta,
    name: "Cta",
    inputs: [
      {
        name: "content",
        type: "object",
        subFields: [
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "primary", type: "string" },
          { name: "secondary", type: "string" },
        ],
      },
    ],
  },
];
