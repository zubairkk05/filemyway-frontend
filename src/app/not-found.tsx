import Link from "next/link";
import { visibleTools } from "@/config/tools.config";
import { SmartDrop } from "@/components/tool/SmartDrop";
import { ActionRow } from "@/components/ui/ActionRow";

export default function NotFound() {
  const popular = visibleTools().slice(0, 4);

  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-[clamp(40px,7vw,72px)] font-extrabold">We could not find that page</h1>
      <p className="mt-4 text-[22px] text-muted">
        The page may have moved. You can still drop a file below and we will show you what you can do with it.
      </p>

      <div className="mt-8">
        <SmartDrop />
      </div>

      <h2 className="mt-14 text-[32px] font-bold">Popular tools</h2>
      <div className="mt-4 grid gap-3">
        {popular.map((tool) => (
          <ActionRow key={tool.slug} href={`/${tool.slug}`} title={tool.plainLabel} description={tool.seo?.subtitle} />
        ))}
      </div>

      <p className="mt-8">
        <Link href="/" className="font-bold underline underline-offset-[5px]">
          Back to all tools
        </Link>
      </p>
    </div>
  );
}
