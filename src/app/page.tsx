import type { Metadata } from "next";
import Link from "next/link";
import { GROUP_LABELS, GROUP_ORDER, getToolBySlug, isVisible, toolsByGroup } from "@/config/tools.config";
import { copy } from "@/config/copy";
import { HomeToolFlow } from "@/components/tool/HomeToolFlow";
import { ToolTile } from "@/components/tool/ToolTile";
import { Icon } from "@/components/ui/Icons";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolIcon } from "@/lib/toolIcons";
import { canonical, itemListJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Online PDF Tools – Merge, Split, Compress & Convert | FileMyWay",
  description:
    "Free online PDF and image tools. Merge, split, compress, rotate and convert files in seconds. No sign-up, files deleted automatically.",
  alternates: { canonical: canonical("/") },
};

const FAQ = [
  { q: "Is it free?", a: "Yes. Every tool is free and you do not need an account." },
  { q: "Is it safe?", a: "Your file is erased a few minutes after you download it and we never read your files." },
  { q: "How long are files kept?", a: "Files are erased a few minutes after you download them, and automatically if you never download." },
  { q: "What file types can I use?", a: "PDFs, pictures (JPG, PNG, WEBP), iPhone photos (HEIC), Excel and CSV files." },
  { q: "Why can't I change Word files?", a: "Word and PowerPoint conversions are not available yet." },
  { q: "Does it work on my phone?", a: "Yes, it works in your browser on a phone, tablet or computer." },
];

const POPULAR = ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-jpg", "jpg-to-pdf", "rotate-pdf"];

export default function HomePage() {
  const popular = POPULAR.map((slug) => getToolBySlug(slug)).filter(
    (t): t is NonNullable<typeof t> => !!t && isVisible(t)
  );

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={itemListJsonLd()} />

      {/* Hero + smart drop */}
      <section className="pt-10 sm:pt-14">
        <div className="container-page">
          <div className="max-w-3xl">
            <span className="text-[15px] font-bold">Free · No sign-up · Files erased after download</span>
            <h1 className="mt-4 font-display text-[clamp(34px,4.8vw,58px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              What would you like to <span className="marker">do?</span>
            </h1>
            <p className="mt-3 text-[19px] text-muted">{copy.hero.subline}</p>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl px-4 sm:px-7">
          <HomeToolFlow />
        </div>
      </section>

      {/* Popular tools */}
      <section className="container-page mt-10" aria-label="Popular tools">
        <h2 className="text-helper font-bold uppercase tracking-[0.14em] text-muted">Popular</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {popular.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              title={tool.seo?.keywords[0] ?? tool.plainLabel}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-ink bg-surface px-5 text-[18px] font-bold transition-colors hover:bg-highlight focus-visible:bg-highlight"
            >
              <Icon name={toolIcon(tool.slug)} size={20} />
              {tool.plainLabel}
            </Link>
          ))}
        </div>
      </section>

      {/* Tool groups */}
      <section className="container-page mt-14" aria-labelledby="groups-heading">
        <h2 id="groups-heading" className="text-[28px] font-bold">
          {copy.groupsIntro}
        </h2>
        <div className="mt-6 space-y-10">
          {GROUP_ORDER.map((group, i) => (
            <div key={group}>
              <h3 className="flex items-center gap-3 text-[22px] font-bold">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[16px] text-white">
                  {i + 1}
                </span>
                {GROUP_LABELS[group]}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {toolsByGroup(group).map((tool) => (
                  <ToolTile key={tool.slug} tool={tool} group={group} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="mt-16 bg-ink py-9 text-white" aria-label="Our promises">
        <div className="container-page grid gap-5 sm:grid-cols-3">
          {[copy.trust.free, copy.trust.erased, copy.trust.neverRead].map((line, idx) => (
            <div key={line} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon name={idx === 0 ? "check" : idx === 1 ? "trash" : "lock"} size={22} />
              </span>
              <p className="text-[20px] font-bold">{line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page mt-16">
        <Accordion items={FAQ} heading="Questions" />
      </section>
    </>
  );
}
