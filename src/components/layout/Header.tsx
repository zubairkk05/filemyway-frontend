import Link from "next/link";
import { copy } from "@/config/copy";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[28px] font-extrabold tracking-[-0.03em] ${className}`}>
      {copy.siteName}
      <span className="text-orange">.</span>
    </span>
  );
}

export function Header() {
  return (
    <header className="border-b-2 border-ink bg-ground">
      <div className="flex min-h-[72px] w-full items-center justify-between gap-4 px-4 py-3 sm:px-7">
        <Link href="/" aria-label="FileMyWay home" className="rounded">
          <Wordmark />
        </Link>
        <Link href="/help" className="rounded text-[20px] font-bold underline underline-offset-[5px]">
          {copy.headerHelp}
        </Link>
      </div>
    </header>
  );
}
