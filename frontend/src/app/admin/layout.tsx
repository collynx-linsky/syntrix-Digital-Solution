import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "../globals.css";

// Own root layout — /admin is a sibling of [locale], not nested under it,
// so it must render its own <html>/<body> and stays deliberately
// decoupled from NextIntlClientProvider/ThemeProvider/Navbar/Footer.
// English-only strings throughout /admin, by design (internal tooling
// doesn't go through the public i18n pipeline).

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin | Syntrix Digital Solutions",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${grotesk.variable} min-h-screen bg-pale-50 font-sans text-ink-900 dark:bg-ink-950 dark:text-white`}>
        {children}
      </body>
    </html>
  );
}
