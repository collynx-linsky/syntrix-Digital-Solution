import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type Props = { params: Promise<{ locale: string }> };

export const metadata = { title: "Terms of Service", robots: { index: true, follow: true } };

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />
      <div className="container-page max-w-3xl py-20">
        <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-white">Terms of Service</h1>
        <div className="prose prose-ink mt-8 max-w-none dark:prose-invert">
          <p>
            These terms govern your use of the Syntrix Digital Solutions website. By using this site, you agree
            to these terms.
          </p>
          <p>
            <strong>Placeholder content.</strong> Replace this page with terms reviewed by qualified legal
            counsel before production launch, covering acceptable use, intellectual property, liability, and
            service engagement terms.
          </p>
        </div>
      </div>
    </>
  );
}
