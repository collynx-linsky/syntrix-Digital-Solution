import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, description, align = "start", light }: Props) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-600 dark:text-gold-400">
        {eyebrow}
      </span>
      <h2
        className={cn(
          "mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-ink-950 dark:text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-balance text-base leading-relaxed", light ? "text-ink-300" : "text-ink-600 dark:text-ink-300")}>
          {description}
        </p>
      )}
    </div>
  );
}
