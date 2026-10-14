import Link from "next/link";
import { Icon } from "./Icons";

interface ActionRowProps {
  href?: string;
  onClick?: () => void;
  title: string;
  description?: string;
  tag?: "Best match" | "Beta";
  emphasis?: boolean;
  titleAttr?: string;
}

export function ActionRow({ href, onClick, title, description, tag, emphasis, titleAttr }: ActionRowProps) {
  const className = `group flex min-h-[92px] w-full items-center gap-4 rounded border-2 border-ink bg-surface px-5 py-4 text-left transition-colors hover:bg-highlight focus-visible:bg-highlight ${
    emphasis ? "ring-2 ring-orange" : ""
  }`;

  const inner = (
    <>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[22px] font-bold sm:text-[24px]">{title}</span>
          {tag === "Best match" && (
            <span className="rounded bg-orange px-2 py-0.5 text-[14px] font-bold text-ink">Best match</span>
          )}
          {tag === "Beta" && <span className="rounded border-2 border-ink px-2 py-0.5 text-[14px] font-bold">Beta</span>}
        </span>
        {description && <span className="mt-1 block text-helper text-muted">{description}</span>}
      </span>
      <span className="arrow-circle transition-colors group-hover:border-orange group-hover:text-orange" aria-hidden="true">
        <Icon name="arrowRight" size={24} />
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href!} title={titleAttr ?? title} className={className}>
      {inner}
    </Link>
  );
}
