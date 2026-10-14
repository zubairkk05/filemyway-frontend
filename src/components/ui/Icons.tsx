import type { SVGProps } from "react";

export type IconName =
  | "upload"
  | "file"
  | "check"
  | "arrowRight"
  | "arrowLeft"
  | "close"
  | "lock"
  | "unlock"
  | "help"
  | "download"
  | "trash"
  | "rotateLeft"
  | "rotateRight"
  | "dragHandle"
  | "plus"
  | "minus"
  | "warning"
  | "scissors"
  | "shrink"
  | "hash"
  | "watermark"
  | "image"
  | "text"
  | "table"
  | "chevronDown";

const PATHS: Record<IconName, string> = {
  upload: "M12 16V4M12 4l-4 4M12 4l4 4M5 20h14",
  file: "M6 3h8l4 4v14H6zM14 3v4h4",
  check: "M5 13l4 4L19 7",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 18l-6-6 6-6",
  close: "M6 6l12 12M18 6L6 18",
  lock: "M6 11h12v10H6zM9 11V8a3 3 0 016 0v3",
  unlock: "M6 11h12v10H6zM9 11V8a3 3 0 015-2",
  help: "M12 18h.01M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4",
  download: "M12 4v12M8 12l4 4 4-4M5 20h14",
  trash: "M4 7h16M9 7V5h6v2M6 7l1 14h10l1-14",
  rotateLeft: "M9 7L4 12l5 5M4 12h11a5 5 0 010 10h-1",
  rotateRight: "M15 7l5 5-5 5M20 12H9a5 5 0 000 10h1",
  dragHandle: "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  warning: "M12 3l9 16H3zM12 10v4M12 17h.01",
  scissors: "M7 4l8 10M17 4L9 14M8.5 9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM8.5 15a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  shrink: "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5",
  hash: "M9 4L7 20M17 4l-2 16M4 9h16M3 15h16",
  watermark: "M12 3.5s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z",
  image: "M4 5h16v14H4zM9.5 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM4 15l4.5-4.5L12 14l3-2.5L20 16",
  text: "M5 6h14M5 10h14M5 14h9M5 18h6",
  table: "M4 5h16v14H4zM4 10h16M4 15h16M10 5v14",
  chevronDown: "M6 9l6 6 6-6",
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
