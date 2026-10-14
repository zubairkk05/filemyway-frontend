import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy – FileMyWay",
  description:
    "How FileMyWay handles your files and data. Files are erased after download, we never read your content, and there is no sign-up.",
  alternates: { canonical: canonical("/privacy-policy") },
};

export default function PrivacyPage() {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="text-[clamp(36px,5vw,56px)] font-extrabold">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-[20px] leading-[1.6]">
        <p>We keep things simple. Your file is only sent to us when you press the orange button, and it is erased a few minutes after you download it.</p>
        <p>We never read the content of your files. We do not ask you to sign up and we do not sell your data.</p>
        <p>Some tools run entirely on your device. Those tools do not upload your file at all.</p>
        <p>We may collect anonymous counts of which tools are used, without file names or content.</p>
      </div>
    </article>
  );
}
