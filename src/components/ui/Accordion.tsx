import type { FaqItem } from "@/config/tools.config";

interface AccordionProps {
  items: FaqItem[];
  heading?: string;
}

export function Accordion({ items, heading = "Questions" }: AccordionProps) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-4 text-[32px] font-bold">
        {heading}
      </h2>
      <div className="divide-y-2 divide-line rounded border-2 border-ink bg-surface">
        {items.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[20px] font-bold hover:bg-highlight">
              {item.q}
              <span className="text-[28px] leading-none group-open:hidden" aria-hidden="true">
                +
              </span>
              <span className="hidden text-[28px] leading-none group-open:inline" aria-hidden="true">
                −
              </span>
            </summary>
            <p className="px-5 pb-5 text-helper text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
