import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, isVisible, visibleTools } from "@/config/tools.config";
import { copy } from "@/config/copy";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ToolWidget } from "@/components/tool/ToolWidget";
import { ActionRow } from "@/components/ui/ActionRow";
import { Banner } from "@/components/ui/Banner";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, howToJsonLd, toolJsonLd, toolMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return visibleTools().map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool || !isVisible(tool)) return {};
  return toolMetadata(tool);
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool || !isVisible(tool) || !tool.seo) notFound();

  const seo = tool.seo;
  const related = tool.related
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => !!t && isVisible(t))
    .slice(0, 6);

  return (
    <>
      <JsonLd data={toolJsonLd(tool)} />
      <JsonLd data={breadcrumbJsonLd(tool)} />
      <JsonLd data={howToJsonLd(tool)} />
      <JsonLd data={faqJsonLd(tool)} />

      <div className="container-page pt-8">
        <Link href="/" className="inline-flex min-h-[48px] items-center gap-2 text-[24px] font-bold underline-offset-[5px] hover:underline">
          <Icon name="arrowLeft" size={28} />
          Back to all tools
        </Link>

        <div className="mt-4">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: seo.h1 }]} />
        </div>

        <header className="mt-4 max-w-3xl">
          <h1 className="font-display text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            {seo.h1}
          </h1>
          <p className="mt-3 text-[22px] text-muted">{seo.subtitle}</p>
        </header>

        {tool.status === "beta" && tool.betaNote && (
          <div className="mt-5 max-w-3xl">
            <Banner tone="info">Beta: {tool.betaNote}</Banner>
          </div>
        )}

        <div className="mt-8 max-w-3xl">
          <ToolWidget tool={tool} compact />
        </div>

        {/* Ad slot placeholder (disabled in v1). */}
        <div className="mt-10 h-[250px] max-w-3xl rounded border-2 border-dashed border-line" aria-hidden="true" />

        <section className="mt-12 max-w-3xl" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-[32px] font-bold">
            How it works
          </h2>
          <ol className="mt-4 space-y-3">
            {seo.howToSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-helper font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-[20px]">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 max-w-3xl space-y-4" aria-label="About this tool">
          {seo.longCopy.map((para, i) => (
            <p key={i} className="text-[20px] leading-[1.6]">
              {para}
            </p>
          ))}
        </section>

        {related.length > 0 && (
          <section className="mt-14 max-w-3xl" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-[32px] font-bold">
              What else would you like to do?
            </h2>
            <div className="mt-4 grid gap-3">
              {related.map((t) => (
                <ActionRow key={t.slug} href={`/${t.slug}`} title={t.plainLabel} description={t.seo?.subtitle} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 max-w-3xl">
          <Accordion items={seo.faq} heading="Questions" />
        </div>
      </div>
    </>
  );
}
