import Link from "next/link";
import { GROUP_LABELS, GROUP_ORDER, toolsByGroup } from "@/config/tools.config";
import { Wordmark } from "./Header";

const STATIC_LINKS = [
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink bg-ground">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {GROUP_ORDER.map((group) => (
          <nav key={group} aria-label={GROUP_LABELS[group]}>
            <h2 className="mb-3 text-[20px] font-bold">{GROUP_LABELS[group]}</h2>
            <ul className="space-y-2">
              {toolsByGroup(group).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-helper text-muted underline-offset-[5px] hover:text-ink hover:underline"
                  >
                    {tool.plainLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t-2 border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-6">
          <Wordmark />
          <nav aria-label="Site">
            <ul className="flex flex-wrap gap-4">
              {STATIC_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-helper underline-offset-[5px] hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
