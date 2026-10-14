import { TOOLS, isVisible, getToolBySlug, type ToolConfig } from "@/config/tools.config";

export interface ValidationIssue {
  slug: string;
  field: string;
  message: string;
}

/**
 * Build-time config validation (doc 04). Fails the build when a live tool lacks
 * SEO fields, a title exceeds 60 chars, a meta description is outside 120–160
 * chars, or a related slug does not exist or is hidden.
 */
export function validateTools(tools: ToolConfig[] = TOOLS): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const tool of tools) {
    if (seen.has(tool.slug)) {
      issues.push({ slug: tool.slug, field: "slug", message: "Duplicate slug" });
    }
    seen.add(tool.slug);

    if (!isVisible(tool)) continue;

    const seo = tool.seo;
    if (!seo) {
      issues.push({ slug: tool.slug, field: "seo", message: "Visible tool is missing SEO fields" });
      continue;
    }

    if (seo.title.length > 60) {
      issues.push({ slug: tool.slug, field: "seo.title", message: `Title is ${seo.title.length} chars (max 60)` });
    }
    const descLen = seo.metaDescription.length;
    if (descLen < 120 || descLen > 160) {
      issues.push({
        slug: tool.slug,
        field: "seo.metaDescription",
        message: `Description is ${descLen} chars (must be 120–160)`,
      });
    }
    if (seo.howToSteps.length !== 3) {
      issues.push({ slug: tool.slug, field: "seo.howToSteps", message: "Must have exactly 3 steps" });
    }
    if (!seo.h1 || !seo.subtitle) {
      issues.push({ slug: tool.slug, field: "seo", message: "Missing H1 or subtitle" });
    }

    for (const related of tool.related) {
      const target = getToolBySlug(related);
      if (!target) {
        issues.push({ slug: tool.slug, field: "related", message: `Unknown related slug "${related}"` });
      } else if (!isVisible(target)) {
        issues.push({ slug: tool.slug, field: "related", message: `Related slug "${related}" is hidden` });
      }
    }
  }

  return issues;
}
