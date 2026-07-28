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
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
