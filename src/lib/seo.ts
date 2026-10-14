import type { Metadata } from "next";
import type { ToolConfig } from "@/config/tools.config";
import { visibleTools } from "@/config/tools.config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://filemyway.com";

export function canonical(path: string): string {
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}${clean}`;
}

export function toolMetadata(tool: ToolConfig): Metadata {
  const seo = tool.seo!;
  return {
    title: seo.title,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: { canonical: canonical(`/${tool.slug}`) },
    openGraph: {
      title: seo.title,
      description: seo.metaDescription,
      url: canonical(`/${tool.slug}`),
      siteName: "FileMyWay",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.metaDescription },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FileMyWay",
    url: SITE_URL,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FileMyWay",
    url: SITE_URL,
  };
}

export function itemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: visibleTools().map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.seo?.h1 ?? tool.plainLabel,
      url: canonical(`/${tool.slug}`),
    })),
  };
}

export function toolJsonLd(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.seo?.h1 ?? tool.plainLabel,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    url: canonical(`/${tool.slug}`),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function breadcrumbJsonLd(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: tool.seo?.h1 ?? tool.plainLabel, item: canonical(`/${tool.slug}`) },
    ],
  };
}

export function howToJsonLd(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tool.seo?.h1 ?? tool.plainLabel,
    step: (tool.seo?.howToSteps ?? []).map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
  };
}

export function faqJsonLd(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (tool.seo?.faq ?? []).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
