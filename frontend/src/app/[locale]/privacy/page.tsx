import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type Props = { params: Promise<{ locale: string }> };

export const metadata = { title: "Privacy Policy", robots: { index: true, follow: true } };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
      <div className="container-page max-w-3xl py-20">
        <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-white">Privacy Policy</h1>
        <div className="prose prose-ink mt-8 max-w-none dark:prose-invert">
          <p>
            Syntrix Digital Solutions (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. This policy explains what
            information we collect through this website — including contact forms, the newsletter, and job
            applications — and how it is used, stored, and protected.
          </p>
          <p>
            <strong>Placeholder content.</strong> Replace this page with a policy reviewed by qualified legal
            counsel before production launch, covering data retention, third-party processors, cookie usage,
            and user rights under applicable Tanzanian and international data protection law.
          </p>
        </div>
      </div>
    </>
  );
}
