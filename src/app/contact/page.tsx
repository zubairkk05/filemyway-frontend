import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact FileMyWay",
  description:
    "Get in touch with the FileMyWay team. Tell us if a tool did not work or if you have an idea for a new one.",
  alternates: { canonical: canonical("/contact") },
};

export default function ContactPage() {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="text-[clamp(36px,5vw,56px)] font-extrabold">Contact us</h1>
      <div className="mt-6 space-y-4 text-[20px] leading-[1.6]">
        <p>Did a tool not work? Have an idea for a new one? We would like to hear from you.</p>
        <p>
          Email:{" "}
          <a className="underline underline-offset-[5px]" href="mailto:hello@filemyway.com">
            hello@filemyway.com
          </a>
        </p>
      </div>
    </article>
  );
}
