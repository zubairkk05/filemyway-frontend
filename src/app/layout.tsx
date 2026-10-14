import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PendingFilesProvider } from "@/state/pendingFiles";
import { copy } from "@/config/copy";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-atkinson",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
  variable: "--font-bricolage",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://filemyway.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Online PDF Tools – Merge, Split, Compress & Convert | FileMyWay",
    template: "%s",
  },
  description:
    "Free online PDF and image tools. Merge, split, compress, rotate and convert files in seconds. No sign-up, files deleted automatically.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${atkinson.variable} ${bricolage.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:border-2 focus:border-ink focus:bg-highlight focus:px-4 focus:py-2 focus:font-bold"
        >
          {copy.skipToContent}
        </a>
        <PendingFilesProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </PendingFilesProvider>
      </body>
    </html>
  );
}
