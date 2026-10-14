import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Help – How to Use FileMyWay",
  description:
    "Answers to common questions about using FileMyWay. How to add a file, change it and download the result. Free, no sign-up.",
  alternates: { canonical: canonical("/help") },
};

const FAQ = [
  { q: "How do I add a file?", a: "Drop it on the big box, or press Choose a file and pick it from your device." },
  { q: "Is anything uploaded straight away?", a: "No. Nothing is uploaded until you press the orange button." },
  { q: "How long do you keep my file?", a: "A few minutes after you download it, then it is erased automatically." },
  { q: "What file types can I use?", a: "PDFs, pictures (JPG, PNG, WEBP), iPhone photos (HEIC), Excel and CSV files." },
  { q: "Why can't I change Word files?", a: "Word and PowerPoint conversions are not available yet." },
];

export default function HelpPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-[clamp(36px,5vw,56px)] font-extrabold">Need help?</h1>
      <p className="mt-4 text-[20px] text-muted">Here are the questions people ask most. If yours is not here, contact us.</p>
      <div className="mt-8">
        <Accordion items={FAQ} heading="Common questions" />
      </div>
    </div>
  );
}
