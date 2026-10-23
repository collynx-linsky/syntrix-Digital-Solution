import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalizes admin-entered slugs to lowercase-hyphenated form. Slug
 * fields aren't validated/normalized server-side, and several public
 * routes (e.g. generic pages) put the slug directly in the URL — an
 * unnormalized slug like "FAQ" is reachable only at that exact case,
 * silently 404ing for the natural lowercase URL. */
/** WhatsApp click-to-chat link for a display phone number. wa.me wants
 * the full international number as digits only — no "+", spaces or
 * dashes — so "+255 789 236 338" becomes wa.me/255789236338. */
export function whatsappUrl(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
