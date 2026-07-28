import { useTranslations } from "next-intl";
import { Facebook, Linkedin, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Reveal } from "@/components/motion/reveal";

const SOCIAL_LINKS = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/syntrixdigitalsolutions", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/syntrixdigital", label: "Twitter / X" },
  { icon: Facebook, href: "https://www.facebook.com/syntrixdigitalsolutions", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/syntrixdigitalsolutions", label: "Instagram" },
];

type FooterProps = {
  services: { slug: string; title: string }[];
  solutions: { slug: string; title: string }[];
};

export function Footer({ services, solutions }: FooterProps) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-brand-900 bg-brand-950 text-ink-300">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gold-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative border-b border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-6 py-12 text-center lg:flex-row lg:text-start">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{t("cta.title")}</h2>
            <p className="mt-2 max-w-xl text-sm text-ink-400">{t("cta.description")}</p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-gold-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-500"
          >
            {t("cta.button")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>

      <Reveal className="relative container-page py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="group flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-black text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                S
              </span>
              Syntrix Digital Solutions
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">{t("description")}</p>
            <div className="mt-6 flex gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-900 text-ink-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="text-sm font-semibold text-white">{t("columns.company")}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/about" className="transition-colors hover:text-gold-400">{t("links.about")}</Link></li>
                <li><Link href="/careers" className="transition-colors hover:text-gold-400">{t("links.careers")}</Link></li>
                <li><Link href="/blog" className="transition-colors hover:text-gold-400">{t("links.blog")}</Link></li>
                <li><Link href="/contact" className="transition-colors hover:text-gold-400">{t("links.contact")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t("columns.services")}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {services.slice(0, 3).map((service) => (
                  <li key={service.slug}>
                    <Link href={{ pathname: "/services/[slug]", params: { slug: service.slug } }} className="transition-colors hover:text-gold-400">
                      {service.title}
                    </Link>
                  </li>
                ))}
                <li><Link href="/services" className="transition-colors hover:text-gold-400">{t("links.sitemap")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t("columns.solutions")}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {solutions.slice(0, 3).map((solution) => (
                  <li key={solution.slug}>
                    <Link href={{ pathname: "/solutions/[slug]", params: { slug: solution.slug } }} className="transition-colors hover:text-gold-400">
                      {solution.title}
                    </Link>
                  </li>
                ))}
                <li><Link href="/portfolio" className="transition-colors hover:text-gold-400">{t("links.portfolio")}</Link></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white">{t("newsletter.title")}</h3>
            <p className="mt-4 text-sm text-ink-400">{t("newsletter.description")}</p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                required
                placeholder={t("newsletter.placeholder")}
                className="w-full min-w-0 rounded-lg border border-brand-800 bg-brand-900 px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:border-gold-500 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-500"
              >
                {t("newsletter.cta")}
              </button>
            </form>

            <div className="mt-6 space-y-2.5 text-sm text-ink-400">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-gold-400" /> {t("contactInfo.office")}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-gold-400" /> info@syntrixdigitalsolutions.com</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-gold-400" /> +255 700 000 000</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-brand-900 pt-8 text-xs text-ink-500 sm:flex-row">
          <p>{t("copyright", { year })}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink-300">{t("links.privacy")}</Link>
            <Link href="/terms" className="hover:text-ink-300">{t("links.terms")}</Link>
            <span>{t("madeIn")}</span>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
