import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

function kebabToPascal(name: string): string {
  return name
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/** Resolves an admin-entered lucide-react icon name (kebab-case, e.g.
 * "code-2") to its component. Falls back gracefully if the name is blank
 * or doesn't match a real icon — admin-entered strings aren't validated
 * against the icon set at write time. */
export function getLucideIcon(name: string, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback;
  const component = (icons as unknown as Record<string, LucideIcon>)[kebabToPascal(name)];
  return component ?? fallback;
}
