import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog – FileMyWay",
  description:
    "Tips and guides for working with PDFs, pictures and spreadsheets. Coming soon from the FileMyWay team.",
  alternates: { canonical: canonical("/blog") },
  robots: { index: false, follow: true },
};

export default function BlogPage() {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="text-[clamp(36px,5vw,56px)] font-extrabold">Blog</h1>
      <p className="mt-4 text-[20px] text-muted">Guides and tips are on the way.</p>
    </article>
  );
}
