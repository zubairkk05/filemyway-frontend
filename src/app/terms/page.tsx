import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Use – FileMyWay",
  description:
    "The simple rules for using FileMyWay. Free tools, no sign-up, and you should only upload files you have the right to use.",
  alternates: { canonical: canonical("/terms") },
};

export default function TermsPage() {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="text-[clamp(36px,5vw,56px)] font-extrabold">Terms of Use</h1>
      <div className="mt-6 space-y-4 text-[20px] leading-[1.6]">
        <p>FileMyWay is provided as-is. The tools are free and we try to keep them working well.</p>
        <p>Only upload files that you own or have permission to use. Do not use the tools for anything unlawful.</p>
        <p>We cannot recover a password you set or forgot. Keep your passwords safe.</p>
      </div>
    </article>
  );
}
