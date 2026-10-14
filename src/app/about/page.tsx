import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About FileMyWay – Free Online File Tools",
  description:
    "FileMyWay is a free, simple place to change, join, split and shrink PDFs and pictures. No sign-up and files are erased after download.",
  alternates: { canonical: canonical("/about") },
};

export default function AboutPage() {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="text-[clamp(36px,5vw,56px)] font-extrabold">About FileMyWay</h1>
      <div className="mt-6 space-y-4 text-[20px] leading-[1.6]">
        <p>FileMyWay is a small set of free tools for everyday files. You drop a file, we tell you what it is, and we show you what you can do with it.</p>
        <p>There is no sign-up. Your file is not uploaded until you press the orange button, and it is erased from our servers a few minutes after you download it.</p>
        <p>We keep the wording plain so anyone, at any age, can use it.</p>
      </div>
    </article>
  );
}
