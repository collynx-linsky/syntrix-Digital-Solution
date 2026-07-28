"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", key: "about" },
  { href: "/solutions", key: "solutions" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/gallery", key: "gallery" },
  { href: "/blog", key: "blog" },
  { href: "/team", key: "team" },
  { href: "/careers", key: "careers" },
] as const;

type NavbarProps = {
  services: { slug: string; title: string }[];
  pages: { slug: string; title: string }[];
};

export function Navbar({ services, pages }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-pale-50/95 backdrop-blur transition-shadow duration-300 dark:bg-brand-950/95",
        scrolled
          ? "border-ink-100 shadow-md dark:border-ink-800"
          : "border-transparent shadow-none dark:border-transparent"
      )}
    >
      <nav
        className={cn(
          "container-page flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
        )}
      >
        <Link href="/" className="group flex items-center gap-2 font-display text-lg font-bold text-ink-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-black text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            S
          </span>
          Syntrix
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-950 dark:text-ink-200 dark:hover:bg-ink-800 dark:hover:text-white"
            >
              {t("services")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {servicesOpen && (
              <div className="absolute start-0 top-full w-96 pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-ink-100 bg-pale-50 p-3 shadow-glow dark:border-ink-800 dark:bg-ink-900">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      href={{ pathname: "/services/[slug]", params: { slug: service.slug } }}
                      className="rounded-lg px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-gold-50 hover:text-gold-700 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-gold-300"
                    >
                      {service.title}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    className="col-span-2 mt-1 flex items-center justify-between rounded-lg border-t border-ink-100 px-3 pt-3 text-sm font-semibold text-gold-600 dark:border-ink-800 dark:text-gold-400"
                  >
                    {t("services")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-950 dark:text-ink-200 dark:hover:bg-ink-800 dark:hover:text-white",
                pathname === link.href && "bg-ink-100 text-ink-950 dark:bg-ink-800 dark:text-white"
              )}
            >
              {t(link.key)}
            </Link>
          ))}

          {pages.map((page) => (
            <Link
              key={page.slug}
              href={{ pathname: "/[slug]", params: { slug: page.slug } }}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-950 dark:text-ink-200 dark:hover:bg-ink-800 dark:hover:text-white",
                pathname === `/${page.slug}` && "bg-ink-100 text-ink-950 dark:bg-ink-800 dark:text-white"
              )}
            >
              {page.title}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/contact"
            className="ms-2 rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-500"
          >
            {t("getQuote")}
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="ms-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 dark:text-ink-200"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-pale-50 px-6 py-4 dark:border-ink-800 dark:bg-brand-950 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/services" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 dark:text-ink-200">
              {t("services")}
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 dark:text-ink-200"
              >
                {t(link.key)}
              </Link>
            ))}
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={{ pathname: "/[slug]", params: { slug: page.slug } }}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 dark:text-ink-200"
              >
                {page.title}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg bg-gold-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              {t("getQuote")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
