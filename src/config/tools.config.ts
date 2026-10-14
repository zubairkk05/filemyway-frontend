/**
 * THE single source of truth (doc 04). Home page, footer, smart-drop suggestions,
 * tool pages, metadata, JSON-LD and sitemap ALL read from this array.
 * Never hardcode tool names, labels or lists anywhere else.
 */

export type ToolStatus = "live" | "beta" | "hidden";
export type ToolGroup = "convert" | "make" | "fix" | "pictures";
export type RunsOn = "server" | "browser";
export type FileKind = "pdf" | "image" | "heic" | "excel" | "word" | "powerpoint" | "unknown";

export type OptionType =
  | "radio"
  | "select"
  | "toggle"
  | "text"
  | "number"
  | "pages-range"
  | "password"
  | "page-picker";

export interface OptionChoice {
  value: string;
  label: string;
  helper?: string;
}

export interface ToolOption {
  id: string;
  type: OptionType;
  label: string;
  helper?: string;
  default: string | number | boolean;
  required?: boolean;
  choices?: OptionChoice[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolSeo {
  /** ≤ 60 chars, keyword first, ends with " | FileMyWay". */
  title: string;
  /** 120–160 chars. */
  metaDescription: string;
  h1: string;
  subtitle: string;
  keywords: string[];
  /** Exactly 3, matches the visible "How it works". */
  howToSteps: string[];
  faq: FaqItem[];
  /** 500–800 word long-form content (plain text paragraphs). */
  longCopy: string[];
}

export interface ToolLimits {
  maxFileMB: number;
  maxTotalMB: number;
  maxFiles: number;
  maxPages: number;
}

export interface ToolAccepts {
  kinds: FileKind[];
  extensions: string[];
  minFiles: number;
  maxFiles: number;
  multiple: boolean;
}

/** Data that drives the smart-drop matrix (doc 05). */
export interface SuggestRule {
  kinds: FileKind[];
  /** Lower = shown higher. First three applicable become "Most likely". */
  priority: number;
  minFiles?: number;
  maxFiles?: number;
  /** Only suggested for PDFs that have a real text layer. */
  requiresText?: boolean;
  /** Only suggested for PDFs that look like scans. */
  requiresScan?: boolean;
  /** Only suggested when the PDF is encrypted. */
  encryptedOnly?: boolean;
  /** One-line reason shown on the action row. */
  reason: string;
}

export interface ToolConfig {
  /** URL slug and default API tool name. */
  slug: string;
  /** API tool name when it differs from the slug (image-converter). */
  apiTool: string;
  status: ToolStatus;
  runsOn: RunsOn;
  group: ToolGroup;
  plainLabel: string;
  actionLabel: string;
  resultLabel: string;
  betaNote?: string;
  seo?: ToolSeo;
  accepts: ToolAccepts;
  limits: ToolLimits;
  options: ToolOption[];
  suggest?: SuggestRule;
  aliases?: string[];
  related: string[];
}

const DEFAULT_LIMITS: ToolLimits = {
  maxFileMB: 50,
  maxTotalMB: 200,
  maxFiles: 20,
  maxPages: 100,
};

const pdfAccept = (minFiles = 1, maxFiles = 1): ToolAccepts => ({
  kinds: ["pdf"],
  extensions: ["pdf"],
  minFiles,
  maxFiles,
  multiple: maxFiles > 1,
});

const imageAccept = (maxFiles = 20): ToolAccepts => ({
  kinds: ["image"],
  extensions: ["jpg", "jpeg", "png", "webp"],
  minFiles: 1,
  maxFiles,
  multiple: true,
});

export const TOOLS: ToolConfig[] = [
  /* ---------------------------- Fix up a PDF ---------------------------- */
  {
    slug: "merge-pdf",
    apiTool: "merge-pdf",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Join PDFs together",
    actionLabel: "Join PDFs",
    resultLabel: "Download your PDF",
    accepts: pdfAccept(2, 20),
    limits: { ...DEFAULT_LIMITS, maxFiles: 20 },
    options: [],
    suggest: { kinds: ["pdf"], minFiles: 2, priority: 0, reason: "Put several PDFs into one file" },
    related: ["split-pdf", "compress-pdf", "reorder-pdf-pages", "pdf-to-jpg"],
    seo: {
      title: "Merge PDF – Join PDF Files Free Online | FileMyWay",
      metaDescription:
        "Join two or more PDF files into one document. Free, no sign-up and files are erased after download. Drag your PDFs, arrange the order and merge.",
      h1: "Merge PDF files free",
      subtitle: "Put several PDFs into one file, in the order you choose.",
      keywords: ["merge pdf", "join pdf", "combine pdf", "merge pdf files"],
      howToSteps: [
        "Add two or more PDF files.",
        "Drag them into the order you want.",
        "Press Join PDFs and download the single file.",
      ],
      faq: [
        { q: "Is it free?", a: "Yes. No sign-up and no watermark." },
        { q: "How many PDFs can I join?", a: "Up to 20 files at a time." },
        { q: "Are my files safe?", a: "They are erased after download and never read by us." },
      ],
      longCopy: [
        "Merging PDF files should not need an account or a download. Add your PDFs, arrange them, and get one tidy document back in seconds.",
        "You can join scans, reports, receipts or tickets. The order in the list is the order in the finished file, so drag and drop until it reads the way you want.",
        "Nothing is uploaded until you press the orange button. When you are finished, the file is ready to download and is erased from our servers a few minutes after you download it.",
      ],
    },
  },
  {
    slug: "split-pdf",
    apiTool: "split-pdf",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Cut a PDF apart",
    actionLabel: "Cut the PDF",
    resultLabel: "Download your PDFs",
    accepts: pdfAccept(),
    limits: { ...DEFAULT_LIMITS, maxPages: 300 },
    options: [
      {
        id: "mode",
        type: "radio",
        label: "How do you want to cut it?",
        default: "range",
        choices: [
          { value: "range", label: "By range", helper: "Keep the pages you type" },
          { value: "every", label: "Every N pages", helper: "Make equal parts" },
          { value: "pick", label: "Pick pages", helper: "Choose single pages" },
        ],
      },
      {
        id: "range",
        type: "text",
        label: "Page ranges",
        placeholder: "e.g. 1-3, 5, 7-9",
        helper: "Use commas between ranges.",
        default: "",
      },
      { id: "every", type: "number", label: "Every how many pages?", default: 2, min: 1, max: 200 },
      { id: "pages", type: "text", label: "Pages to keep", placeholder: "e.g. 1, 4, 9", default: "" },
    ],
    suggest: { kinds: ["pdf"], priority: 2, reason: "Make smaller files from one PDF" },
    related: ["merge-pdf", "delete-pdf-pages", "reorder-pdf-pages", "compress-pdf"],
    seo: {
      title: "Split PDF – Cut a PDF Into Parts Free | FileMyWay",
      metaDescription:
        "Split one PDF into several files. Choose page ranges, cut every N pages or pick single pages. Free, no sign-up, files erased after download.",
      h1: "Split PDF files free",
      subtitle: "Turn one PDF into the exact pages you need.",
      keywords: ["split pdf", "cut pdf", "divide pdf", "split pdf pages"],
      howToSteps: [
        "Add your PDF file.",
        "Choose ranges, equal parts or single pages.",
        "Press Cut the PDF and download the results.",
      ],
      faq: [
        { q: "Can I split into many files?", a: "Yes, each range or page becomes its own file in a ZIP." },
        { q: "Is there a page limit?", a: "Up to 300 pages for best results." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "A long PDF often contains several documents. Splitting it lets you keep only what you need, share a single chapter or send one page to a client.",
        "Choose a page range to extract, cut the file into equal parts, or pick individual pages. Every part stays exactly as it looked in the original.",
        "Your file is not uploaded until you press the orange button, and it is erased after download.",
      ],
    },
  },
  {
    slug: "compress-pdf",
    apiTool: "compress-pdf",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Make a PDF smaller",
    actionLabel: "Make smaller",
    resultLabel: "Download your PDF",
    accepts: pdfAccept(),
    limits: { ...DEFAULT_LIMITS, maxFileMB: 100, maxPages: 300 },
    options: [
      {
        id: "level",
        type: "radio",
        label: "How small do you need it?",
        default: "recommended",
        choices: [
          { value: "less", label: "Less", helper: "Best quality" },
          { value: "recommended", label: "Recommended", helper: "Good balance" },
          { value: "smallest", label: "Smallest", helper: "Smallest file" },
        ],
      },
    ],
    suggest: { kinds: ["pdf"], priority: 1, reason: "Make the file easier to send" },
    related: ["merge-pdf", "split-pdf", "pdf-to-jpg", "protect-pdf"],
    seo: {
      title: "Compress PDF – Make a PDF Smaller Free | FileMyWay",
      metaDescription:
        "Make PDF files smaller so they are easier to email and upload. Choose how much to shrink. Free, no sign-up, files erased after download.",
      h1: "Compress PDF files free",
      subtitle: "Make a PDF smaller so it fits in an email or form.",
      keywords: ["compress pdf", "make pdf smaller", "reduce pdf size", "shrink pdf"],
      howToSteps: [
        "Add the PDF you want to shrink.",
        "Choose Less, Recommended or Smallest.",
        "Press Make smaller and download the lighter file.",
      ],
      faq: [
        { q: "Will it look worse?", a: "It can, a little. Recommended keeps a good balance." },
        { q: "How much smaller?", a: "It depends on the file. We never promise a set amount." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Big PDFs are hard to email and slow to upload. Compressing a file removes hidden extra data and can shrink large images inside it.",
        "Pick the level that suits you. Less keeps the most detail, Smallest makes the smallest file, and Recommended sits in between.",
        "We show you the size before and after so you can decide. The file is erased from our servers a few minutes after you download it.",
      ],
    },
  },
  {
    slug: "rotate-pdf",
    apiTool: "rotate-pdf",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Turn PDF pages",
    actionLabel: "Save turned pages",
    resultLabel: "Download your PDF",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "angle",
        type: "select",
        label: "Turn all pages",
        default: "90",
        choices: [
          { value: "90", label: "90° right" },
          { value: "180", label: "180°" },
          { value: "270", label: "90° left" },
        ],
      },
    ],
    suggest: { kinds: ["pdf"], priority: 4, reason: "Fix pages that are sideways" },
    related: ["reorder-pdf-pages", "delete-pdf-pages", "split-pdf", "compress-pdf"],
    seo: {
      title: "Rotate PDF – Turn PDF Pages Free Online | FileMyWay",
      metaDescription:
        "Turn PDF pages the right way up. Rotate all pages at once or one at a time. Free, no sign-up, files erased after download.",
      h1: "Rotate PDF pages free",
      subtitle: "Fix pages that are sideways or upside down.",
      keywords: ["rotate pdf", "turn pdf pages", "pdf sideways", "rotate pdf online"],
      howToSteps: [
        "Add the PDF with the wrong pages.",
        "Turn each page or turn them all.",
        "Press Save turned pages and download.",
      ],
      faq: [
        { q: "Can I turn one page only?", a: "Yes, use the buttons on each page." },
        { q: "Does it change my text?", a: "No, it only changes the direction of the page." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Scanned pages often come out sideways. Rotating fixes the reading direction without changing anything else in the file.",
        "Turn a single page or all of them. The result keeps the same text and pictures, just the right way up.",
        "Your file stays private until you press the orange button and is erased after download.",
      ],
    },
  },
  {
    slug: "delete-pdf-pages",
    apiTool: "delete-pdf-pages",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Remove pages from a PDF",
    actionLabel: "Remove pages",
    resultLabel: "Download your PDF",
    accepts: pdfAccept(),
    limits: { ...DEFAULT_LIMITS, maxPages: 300 },
    options: [],
    suggest: { kinds: ["pdf"], priority: 5, reason: "Take out pages you do not need" },
    related: ["split-pdf", "reorder-pdf-pages", "rotate-pdf", "merge-pdf"],
    seo: {
      title: "Delete PDF Pages – Remove Pages Free | FileMyWay",
      metaDescription:
        "Remove pages from a PDF and keep the rest. Click the pages you do not want and delete them. Free, no sign-up, files erased after download.",
      h1: "Remove PDF pages free",
      subtitle: "Take out the pages you do not need.",
      keywords: ["remove pdf pages", "delete pdf pages", "drop pdf page", "erase pdf page"],
      howToSteps: [
        "Add your PDF file.",
        "Click the pages you want to remove.",
        "Press Remove pages and download the result.",
      ],
      faq: [
        { q: "Can I remove all pages?", a: "No, at least one page must stay." },
        { q: "Is it permanent?", a: "Only in the new file. Your original stays untouched." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Sometimes a PDF has blank pages, duplicates or pages meant for someone else. Removing them keeps the document clean.",
        "Click each page to mark it, then remove them all at once. The remaining pages keep their order and quality.",
        "Nothing is uploaded until you press the orange button, and the file is erased after download.",
      ],
    },
  },
  {
    slug: "reorder-pdf-pages",
    apiTool: "reorder-pdf-pages",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Change the order of pages",
    actionLabel: "Save new order",
    resultLabel: "Download your PDF",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [],
    suggest: { kinds: ["pdf"], priority: 6, reason: "Move pages into the right order" },
    related: ["delete-pdf-pages", "rotate-pdf", "split-pdf", "merge-pdf"],
    seo: {
      title: "Reorder PDF Pages – Sort Pages Free | FileMyWay",
      metaDescription:
        "Change the order of pages in a PDF. Drag pages where you want them or reverse the whole file. Free, no sign-up, files erased after download.",
      h1: "Reorder PDF pages free",
      subtitle: "Move pages into the order you need.",
      keywords: ["reorder pdf", "rearrange pdf pages", "sort pdf", "move pdf pages"],
      howToSteps: [
        "Add your PDF file.",
        "Drag the pages into place, or reverse the order.",
        "Press Save new order and download.",
      ],
      faq: [
        { q: "Can I reverse the whole file?", a: "Yes, there is a Reverse order button." },
        { q: "Do the pages change?", a: "No, only their order." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "A page in the wrong place makes a document confusing. Reordering puts every page exactly where it belongs.",
        "Drag pages around or use the move buttons for keyboard control. Reverse the whole file in one click when the order is backwards.",
        "The file is not uploaded until you press the orange button and is erased after download.",
      ],
    },
  },
  {
    slug: "add-page-numbers",
    apiTool: "add-page-numbers",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Add page numbers",
    actionLabel: "Add numbers",
    resultLabel: "Download your PDF",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "position",
        type: "select",
        label: "Where should the numbers go?",
        default: "bottom-center",
        choices: [
          { value: "bottom-center", label: "Bottom centre" },
          { value: "bottom-right", label: "Bottom right" },
          { value: "bottom-left", label: "Bottom left" },
          { value: "top-center", label: "Top centre" },
          { value: "top-right", label: "Top right" },
          { value: "top-left", label: "Top left" },
        ],
      },
      {
        id: "format",
        type: "select",
        label: "Number style",
        default: "n",
        choices: [
          { value: "n", label: "1, 2, 3" },
          { value: "n-total", label: "1 of 10" },
          { value: "page-n", label: "Page 1" },
        ],
      },
      { id: "start", type: "number", label: "Start at number", default: 1, min: 1 },
      { id: "skipFirst", type: "toggle", label: "Skip the first page", default: false },
    ],
    suggest: { kinds: ["pdf"], priority: 7, reason: "Add numbers for easy reference" },
    related: ["watermark-pdf", "reorder-pdf-pages", "merge-pdf", "split-pdf"],
    seo: {
      title: "Add Page Numbers to PDF Free | FileMyWay",
      metaDescription:
        "Add page numbers to a PDF. Choose the corner, the style and where to start. Free, no sign-up, files erased after download.",
      h1: "Add page numbers to a PDF free",
      subtitle: "Put tidy numbers on every page.",
      keywords: ["add page numbers pdf", "number pdf pages", "pdf page numbers"],
      howToSteps: [
        "Add your PDF file.",
        "Choose the position and style.",
        "Press Add numbers and download.",
      ],
      faq: [
        { q: "Can I skip the first page?", a: "Yes, turn on Skip the first page." },
        { q: "Can I start at another number?", a: "Yes, set any start number." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Page numbers help people find their place in a report, a contract or a book.",
        "Choose a corner or the top or bottom centre, pick a style and set the start number. Title pages can be left unnumbered.",
        "Your file stays on your device until you press the orange button and is erased after download.",
      ],
    },
  },
  {
    slug: "watermark-pdf",
    apiTool: "watermark-pdf",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Put a watermark on a PDF",
    actionLabel: "Add watermark",
    resultLabel: "Download your PDF",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      { id: "text", type: "text", label: "Watermark text", placeholder: "e.g. Confidential", default: "" },
      { id: "size", type: "number", label: "Text size", default: 48, min: 12, max: 120 },
      { id: "opacity", type: "number", label: "See-through amount", helper: "0 is invisible, 100 is solid.", default: 30, min: 5, max: 100 },
      { id: "angle", type: "number", label: "Angle", default: 45, min: 0, max: 90 },
      {
        id: "colour",
        type: "select",
        label: "Colour",
        default: "grey",
        choices: [
          { value: "grey", label: "Grey" },
          { value: "black", label: "Black" },
          { value: "red", label: "Red" },
          { value: "blue", label: "Blue" },
        ],
      },
    ],
    suggest: { kinds: ["pdf"], priority: 8, reason: "Mark the file as private or draft" },
    related: ["add-page-numbers", "protect-pdf", "compress-pdf", "merge-pdf"],
    seo: {
      title: "Add a Watermark to PDF Free Online | FileMyWay",
      metaDescription:
        "Put a text watermark on every page of a PDF. Choose the size, colour and see-through amount. Free, no sign-up, files erased after download.",
      h1: "Add a watermark to a PDF free",
      subtitle: "Mark your pages as draft, private or confidential.",
      keywords: ["pdf watermark", "add watermark pdf", "watermark pdf online"],
      howToSteps: [
        "Add your PDF file.",
        "Type your watermark text and style it.",
        "Press Add watermark and download.",
      ],
      faq: [
        { q: "Can I make it faint?", a: "Yes, use the see-through slider." },
        { q: "Does it cover my text?", a: "It is behind nothing, so keep it faint to stay readable." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "A watermark tells everyone the state of a document at a glance. Use it for drafts, confidential papers or your own branding.",
        "Type your text, then set how big, how dark and how slanted you want it. A light grey diagonal mark is a safe default.",
        "Your file is private until you press the orange button and is erased after download.",
      ],
    },
  },
  {
    slug: "protect-pdf",
    apiTool: "protect-pdf",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Lock a PDF with a password",
    actionLabel: "Lock the PDF",
    resultLabel: "Download your locked PDF",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      { id: "password", type: "password", label: "Password", required: true, default: "", helper: "Use at least 6 characters." },
      { id: "confirm", type: "password", label: "Repeat the password", required: true, default: "" },
    ],
    suggest: { kinds: ["pdf"], priority: 9, reason: "Keep the file private" },
    related: ["unlock-pdf", "watermark-pdf", "compress-pdf", "merge-pdf"],
    seo: {
      title: "Protect PDF With a Password Free | FileMyWay",
      metaDescription:
        "Lock a PDF with a password so only the right people can open it. Free, no sign-up, files erased after download. Keep your password safe.",
      h1: "Protect a PDF with a password free",
      subtitle: "Lock your file so only the right people can open it.",
      keywords: ["protect pdf", "password protect pdf", "lock pdf", "encrypt pdf"],
      howToSteps: [
        "Add your PDF file.",
        "Type and repeat your password.",
        "Press Lock the PDF and download.",
      ],
      faq: [
        { q: "Can you recover a lost password?", a: "No. If you forget it, we cannot open the file for you." },
        { q: "What if my PDF is already locked?", a: "Use Unlock PDF first." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Locking a PDF with a password stops other people opening it. It is useful for payslips, contracts and personal documents.",
        "Type a password you will remember and repeat it. There is no recovery, so keep it somewhere safe before you lock the file.",
        "Because nothing is uploaded until you press the orange button, your password and file stay in your control.",
      ],
    },
  },
  {
    slug: "unlock-pdf",
    apiTool: "unlock-pdf",
    status: "live",
    runsOn: "server",
    group: "fix",
    plainLabel: "Unlock a PDF",
    actionLabel: "Unlock the PDF",
    resultLabel: "Download your PDF",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      { id: "password", type: "password", label: "Password", default: "", helper: "Only if the PDF asks for it." },
      {
        id: "own",
        type: "toggle",
        label: "I own this file or have permission to unlock it",
        required: true,
        default: false,
      },
    ],
    suggest: { kinds: ["pdf"], encryptedOnly: true, priority: 0, reason: "This PDF is locked" },
    related: ["protect-pdf", "merge-pdf", "compress-pdf", "pdf-to-jpg"],
    seo: {
      title: "Unlock PDF – Remove a PDF Password | FileMyWay",
      metaDescription:
        "Unlock a PDF you own by removing its password. Type the password and the file opens freely. Free, no sign-up, files erased after download.",
      h1: "Unlock a PDF free",
      subtitle: "Remove the password from a PDF you own.",
      keywords: ["unlock pdf", "remove pdf password", "pdf password remover"],
      howToSteps: [
        "Add your locked PDF file.",
        "Type the password and confirm you have permission.",
        "Press Unlock the PDF and download.",
      ],
      faq: [
        { q: "Can you guess a password?", a: "No. You must know it. We never guess." },
        { q: "Is it allowed?", a: "Only unlock files you own or have permission to open." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "A password you set long ago can be a nuisance when you need the file open. Unlocking removes it so the PDF opens without a prompt.",
        "Type the current password and confirm that you own the file or have permission. We cannot guess passwords and will not try.",
        "Until you press the orange button, nothing leaves your device, and the file is erased after download.",
      ],
    },
  },

  /* ------------------- Change a PDF into something else ------------------- */
  {
    slug: "pdf-to-jpg",
    apiTool: "pdf-to-jpg",
    status: "live",
    runsOn: "server",
    group: "convert",
    plainLabel: "PDF into pictures (JPG)",
    actionLabel: "Change to JPG",
    resultLabel: "Download your pictures",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "quality",
        type: "radio",
        label: "Picture quality",
        default: "good",
        choices: [
          { value: "small", label: "Small", helper: "Smallest pictures" },
          { value: "good", label: "Good", helper: "Balanced" },
          { value: "best", label: "Best", helper: "Largest pictures" },
        ],
      },
      { id: "pages", type: "pages-range", label: "Pages", default: "all", placeholder: "All pages, or e.g. 1-3, 5" },
    ],
    suggest: { kinds: ["pdf"], priority: 3, reason: "Turn pages into pictures" },
    related: ["pdf-to-png", "jpg-to-pdf", "compress-pdf", "split-pdf"],
    seo: {
      title: "PDF to JPG – Convert PDF to Images Free | FileMyWay",
      metaDescription:
        "Turn PDF pages into JPG pictures online. Choose the quality and the pages you need. Free, no sign-up, files erased after download.",
      h1: "PDF to JPG converter free",
      subtitle: "Turn each PDF page into a picture.",
      keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg", "pdf to picture"],
      howToSteps: [
        "Add your PDF file.",
        "Choose the quality and pages.",
        "Press Change to JPG and download.",
      ],
      faq: [
        { q: "Do I get one picture or many?", a: "One page gives one picture. Many pages arrive as a ZIP." },
        { q: "Can I choose a range?", a: "Yes, type the pages you want." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Sometimes you need a picture of a page, not the page itself. Converting a PDF to JPG is handy for slides, thumbnails and sharing.",
        "Pick the quality and the pages, and every page becomes its own JPG picture. Long documents are bundled into one ZIP to download.",
        "The file is not uploaded until you press the orange button and is erased after download.",
      ],
    },
  },
  {
    slug: "pdf-to-png",
    apiTool: "pdf-to-png",
    status: "live",
    runsOn: "server",
    group: "convert",
    plainLabel: "PDF into pictures (PNG)",
    actionLabel: "Change to PNG",
    resultLabel: "Download your pictures",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "quality",
        type: "radio",
        label: "Picture quality",
        default: "good",
        choices: [
          { value: "small", label: "Small" },
          { value: "good", label: "Good" },
          { value: "best", label: "Best" },
        ],
      },
      { id: "pages", type: "pages-range", label: "Pages", default: "all", placeholder: "All pages, or e.g. 1-3, 5" },
      { id: "transparent", type: "toggle", label: "See-through background", default: false },
    ],
    suggest: { kinds: ["pdf"], priority: 10, reason: "Turn pages into sharp pictures" },
    related: ["pdf-to-jpg", "jpg-to-pdf", "compress-pdf", "png-to-jpg"],
    seo: {
      title: "PDF to PNG – Convert PDF to PNG Free | FileMyWay",
      metaDescription:
        "Turn PDF pages into sharp PNG pictures, with an optional see-through background. Free, no sign-up, files erased after download.",
      h1: "PDF to PNG converter free",
      subtitle: "Turn pages into sharp pictures with clear edges.",
      keywords: ["pdf to png", "convert pdf to png", "pdf to image png"],
      howToSteps: [
        "Add your PDF file.",
        "Choose the quality and pages.",
        "Press Change to PNG and download.",
      ],
      faq: [
        { q: "Why choose PNG?", a: "PNG keeps sharp edges and can have a see-through background." },
        { q: "Are PNG files bigger?", a: "Yes, usually bigger than JPG." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "PNG is best when you need clean lines or a see-through background, such as a signature or a logo lifted from a page.",
        "Choose the quality and the pages, and each page becomes a PNG picture. Long documents arrive as a single ZIP.",
        "Nothing is uploaded until you press the orange button, and the file is erased after download.",
      ],
    },
  },
  {
    slug: "pdf-to-text",
    apiTool: "pdf-to-text",
    status: "live",
    runsOn: "server",
    group: "convert",
    plainLabel: "Copy the text out of a PDF",
    actionLabel: "Get the text",
    resultLabel: "Download your text",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      { id: "pageBreak", type: "toggle", label: "Add a line between pages", default: true },
    ],
    suggest: { kinds: ["pdf"], requiresText: true, priority: 11, reason: "Copy the words into another app" },
    related: ["pdf-to-excel", "pdf-to-jpg", "ocr-pdf", "split-pdf"],
    seo: {
      title: "PDF to Text – Extract Text From PDF Free | FileMyWay",
      metaDescription:
        "Copy or extract the text out of a PDF as plain text you can edit anywhere. Free, no sign-up, files erased after download.",
      h1: "PDF to text converter free",
      subtitle: "Pull the words out of a PDF so you can reuse them.",
      keywords: ["pdf to text", "extract text from pdf", "pdf to txt", "copy pdf text"],
      howToSteps: [
        "Add your PDF file.",
        "Choose whether to add page breaks.",
        "Press Get the text and copy or download it.",
      ],
      faq: [
        { q: "What about scans?", a: "Scans have no text. Use Read a scanned PDF." },
        { q: "Can I edit the result?", a: "Yes, it is plain text you can edit anywhere." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "PDFs are easy to read and hard to edit. Turning a page into plain text lets you reuse the words in a document or email.",
        "We read the real text inside the PDF. If the file is a scan, there is no text to copy, so use Read a scanned PDF instead.",
        "Your file is private until you press the orange button and is erased after download.",
      ],
    },
  },
  {
    slug: "pdf-to-excel",
    apiTool: "pdf-to-excel",
    status: "beta",
    runsOn: "server",
    group: "convert",
    plainLabel: "PDF into Excel",
    actionLabel: "Change to Excel",
    resultLabel: "Download your spreadsheet",
    betaNote: "Works with PDFs that have real text and tables. Scans are not supported.",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "layout",
        type: "radio",
        label: "How should the sheets look?",
        default: "per-page",
        choices: [
          { value: "per-page", label: "One sheet per page" },
          { value: "one-sheet", label: "All tables on one sheet" },
        ],
      },
    ],
    suggest: { kinds: ["pdf"], requiresText: true, priority: 12, reason: "Turn tables into a spreadsheet" },
    related: ["excel-to-pdf", "pdf-to-text", "pdf-to-jpg", "compress-pdf"],
    seo: {
      title: "PDF to Excel – Convert PDF to XLSX Free | FileMyWay",
      metaDescription:
        "Turn tables in a PDF into an editable Excel spreadsheet. Works with real text. Free, no sign-up, files erased after download.",
      h1: "PDF to Excel converter free",
      subtitle: "Turn tables in a PDF into an editable spreadsheet.",
      keywords: ["pdf to excel", "pdf to xlsx", "convert pdf tables to excel"],
      howToSteps: [
        "Add a PDF that has a table.",
        "Choose the sheet layout.",
        "Press Change to Excel and download.",
      ],
      faq: [
        { q: "Does it work on scans?", a: "No. Tables can only be read from PDFs with real text." },
        { q: "Where are the tables?", a: "Each detected table becomes rows and columns." },
        { q: "Is it free?", a: "Yes. This tool is in beta." },
      ],
      longCopy: [
        "Numbers trapped in a PDF are hard to work with. Converting to Excel turns them into rows and columns you can calculate with.",
        "This tool reads the real text and finds tables. Scans and pictures are not supported, so if your file is a scan, use Read a scanned PDF first.",
        "Nothing is uploaded until you press the orange button, and the file is erased after download.",
      ],
    },
  },
  {
    slug: "pdf-to-ppt",
    apiTool: "pdf-to-ppt",
    status: "beta",
    runsOn: "server",
    group: "convert",
    plainLabel: "PDF into PowerPoint",
    actionLabel: "Change to PowerPoint",
    resultLabel: "Download your slides",
    betaNote: "Each slide is a picture of your page. The text is not editable.",
    accepts: pdfAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "quality",
        type: "radio",
        label: "Picture quality",
        default: "good",
        choices: [
          { value: "small", label: "Small" },
          { value: "good", label: "Good" },
          { value: "best", label: "Best" },
        ],
      },
    ],
    suggest: { kinds: ["pdf"], priority: 13, reason: "Show the pages as slides" },
    related: ["pdf-to-jpg", "pdf-to-excel", "jpg-to-pdf", "compress-pdf"],
    seo: {
      title: "PDF to PowerPoint – Convert PDF to PPTX | FileMyWay",
      metaDescription:
        "Turn each PDF page into a PowerPoint slide. Slides are pictures of your pages. Free, no sign-up, files erased after download.",
      h1: "PDF to PowerPoint converter free",
      subtitle: "Turn your pages into slides you can present.",
      keywords: ["pdf to powerpoint", "pdf to pptx", "convert pdf to slides"],
      howToSteps: [
        "Add your PDF file.",
        "Choose the picture quality.",
        "Press Change to PowerPoint and download.",
      ],
      faq: [
        { q: "Can I edit the slide text?", a: "No. Each slide is a picture of the page." },
        { q: "How many slides?", a: "One slide per page." },
        { q: "Is it free?", a: "Yes. This tool is in beta." },
      ],
      longCopy: [
        "If you need to present a PDF, turning its pages into slides is quick. Each page becomes a full-slide picture.",
        "The text is not editable, so use this when you want to show the pages exactly as they look. For editable content, start from the original document.",
        "Your file stays private until you press the orange button and is erased after download.",
      ],
    },
  },
  {
    slug: "ocr-pdf",
    apiTool: "ocr-pdf",
    status: "beta",
    runsOn: "browser",
    group: "convert",
    plainLabel: "Read a scanned PDF",
    actionLabel: "Read the words",
    resultLabel: "Download your text",
    betaNote: "Runs on your device. Your file is not uploaded. Large scans can be slow on phones.",
    accepts: {
      kinds: ["pdf", "image"],
      extensions: ["pdf", "jpg", "jpeg", "png"],
      minFiles: 1,
      maxFiles: 1,
      multiple: false,
    },
    limits: { maxFileMB: 25, maxTotalMB: 25, maxFiles: 1, maxPages: 20 },
    options: [
      {
        id: "language",
        type: "select",
        label: "Language",
        default: "eng",
        choices: [
          { value: "eng", label: "English" },
          { value: "spa", label: "Spanish" },
          { value: "fra", label: "French" },
          { value: "deu", label: "German" },
        ],
      },
      {
        id: "output",
        type: "radio",
        label: "What do you want back?",
        default: "text",
        choices: [
          { value: "text", label: "Plain text" },
          { value: "txt", label: "Text file (.txt)" },
        ],
      },
    ],
    suggest: { kinds: ["pdf"], requiresScan: true, priority: 14, reason: "This looks like a scan" },
    related: ["pdf-to-text", "pdf-to-jpg", "pdf-to-excel", "compress-pdf"],
    seo: {
      title: "OCR PDF – Read a Scanned PDF Free | FileMyWay",
      metaDescription:
        "Read the words in a scanned PDF or picture. Runs on your device, so your file is not uploaded. Free, no sign-up, easy to use.",
      h1: "Read a scanned PDF free",
      subtitle: "Pull the words out of a scan, right on your device.",
      keywords: ["ocr pdf", "read scanned pdf", "scan to text", "pdf ocr"],
      howToSteps: [
        "Add a scanned PDF or picture.",
        "Choose the language.",
        "Press Read the words and copy the text.",
      ],
      faq: [
        { q: "Is my file uploaded?", a: "No. This tool runs on your device." },
        { q: "Is there a limit?", a: "Up to 20 pages and 25 MB." },
        { q: "Why is it slow?", a: "Large scans take time, especially on phones." },
      ],
      longCopy: [
        "A scan is just a picture of paper, so there is no text to copy. OCR reads the letters in that picture and turns them into words.",
        "This tool runs in your browser, so nothing is uploaded and your file stays on your device. It works best on clear, straight scans.",
        "Large scans can be slow on phones. Start with a few pages if you are unsure.",
      ],
    },
  },

  /* ----------------------------- Make a PDF ----------------------------- */
  {
    slug: "jpg-to-pdf",
    apiTool: "jpg-to-pdf",
    status: "live",
    runsOn: "server",
    group: "make",
    plainLabel: "Pictures into PDF",
    actionLabel: "Make the PDF",
    resultLabel: "Download your PDF",
    accepts: imageAccept(50),
    limits: { ...DEFAULT_LIMITS, maxFiles: 50, maxFileMB: 25 },
    options: [
      {
        id: "pageSize",
        type: "select",
        label: "Page size",
        default: "a4",
        choices: [
          { value: "a4", label: "A4" },
          { value: "letter", label: "Letter" },
          { value: "fit", label: "Fit the picture" },
        ],
      },
      {
        id: "margin",
        type: "select",
        label: "Margin",
        default: "small",
        choices: [
          { value: "none", label: "None" },
          { value: "small", label: "Small" },
          { value: "big", label: "Big" },
        ],
      },
    ],
    suggest: { kinds: ["image"], priority: 1, reason: "Put your pictures into one PDF" },
    related: ["png-to-jpg", "pdf-to-jpg", "heic-to-jpg", "merge-pdf"],
    seo: {
      title: "JPG to PDF – Pictures Into a PDF Free | FileMyWay",
      metaDescription:
        "Turn JPG, PNG and WEBP pictures into one PDF. Arrange the order, pick a page size and make your file. Free, no sign-up, erased after download.",
      h1: "Pictures into PDF free",
      subtitle: "Put your pictures into one tidy PDF.",
      keywords: ["jpg to pdf", "image to pdf", "png to pdf", "pictures to pdf"],
      howToSteps: [
        "Add one or more pictures.",
        "Arrange the order and choose page size.",
        "Press Make the PDF and download.",
      ],
      faq: [
        { q: "Which picture types work?", a: "JPG, PNG and WEBP. Use the HEIC tool for iPhone photos." },
        { q: "Can I order the pictures?", a: "Yes, drag them or use the move buttons." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Photos and screenshots are easy to share one by one, but a single PDF keeps them together in the right order.",
        "Add your pictures, drag them into place, and choose the page size and margin. Each picture becomes a page.",
        "Nothing is uploaded until you press the orange button, and the file is erased after download.",
      ],
    },
  },
  {
    slug: "excel-to-pdf",
    apiTool: "excel-to-pdf",
    status: "beta",
    runsOn: "server",
    group: "make",
    plainLabel: "Excel or CSV into PDF",
    actionLabel: "Make the PDF",
    resultLabel: "Download your PDF",
    betaNote: "Simple tables only. Charts and pictures are not included.",
    accepts: {
      kinds: ["excel"],
      extensions: ["xlsx", "csv"],
      minFiles: 1,
      maxFiles: 1,
      multiple: false,
    },
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "orientation",
        type: "radio",
        label: "Page direction",
        default: "auto",
        choices: [
          { value: "auto", label: "Auto" },
          { value: "tall", label: "Tall" },
          { value: "wide", label: "Wide" },
        ],
      },
      { id: "fitWidth", type: "toggle", label: "Fit columns to the page width", default: true },
      {
        id: "sheets",
        type: "select",
        label: "Which sheets?",
        default: "all",
        choices: [
          { value: "all", label: "All sheets" },
          { value: "first", label: "First sheet only" },
        ],
      },
    ],
    suggest: { kinds: ["excel"], priority: 1, reason: "Share your table as a PDF" },
    related: ["pdf-to-excel", "jpg-to-pdf", "merge-pdf", "compress-pdf"],
    seo: {
      title: "Excel to PDF – Convert XLSX or CSV Free | FileMyWay",
      metaDescription:
        "Turn a simple Excel or CSV table into a PDF. Choose the direction and sheets. Free, no sign-up, files erased after download.",
      h1: "Excel or CSV into PDF free",
      subtitle: "Share your table as a clean PDF.",
      keywords: ["excel to pdf", "xlsx to pdf", "csv to pdf", "convert spreadsheet to pdf"],
      howToSteps: [
        "Add an Excel or CSV file.",
        "Choose the direction and sheets.",
        "Press Make the PDF and download.",
      ],
      faq: [
        { q: "Are charts included?", a: "No. Only simple tables are included." },
        { q: "Do all sheets fit?", a: "Yes, choose all sheets or just the first." },
        { q: "Is it free?", a: "Yes. This tool is in beta." },
      ],
      longCopy: [
        "A spreadsheet is made to be edited, but sometimes you need a fixed copy to send. Converting the table to PDF keeps the layout safe.",
        "This tool handles simple tables. Charts, pictures and complex formatting are not included, so check the result before sharing.",
        "Your file is private until you press the orange button and is erased after download.",
      ],
    },
  },

  /* ------------------------------ Pictures ------------------------------ */
  {
    slug: "png-to-jpg",
    apiTool: "image-converter",
    status: "live",
    runsOn: "server",
    group: "pictures",
    plainLabel: "PNG into JPG",
    actionLabel: "Change picture type",
    resultLabel: "Download your pictures",
    accepts: imageAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "format",
        type: "select",
        label: "New picture type",
        default: "jpg",
        choices: [
          { value: "jpg", label: "JPG" },
          { value: "png", label: "PNG" },
          { value: "webp", label: "WEBP" },
        ],
      },
      { id: "quality", type: "number", label: "Quality", helper: "Higher is clearer but bigger.", default: 85, min: 40, max: 100 },
    ],
    suggest: { kinds: ["image"], priority: 2, reason: "Switch to another picture type" },
    related: ["jpg-to-png", "webp-to-jpg", "jpg-to-pdf", "heic-to-jpg"],
    seo: {
      title: "PNG to JPG – Convert PNG Images Free | FileMyWay",
      metaDescription:
        "Change PNG pictures into JPG. Pick the quality and convert several at once. Free, no sign-up, files erased after download.",
      h1: "PNG to JPG converter free",
      subtitle: "Change your pictures to the type you need.",
      keywords: ["png to jpg", "convert png to jpg", "change picture type"],
      howToSteps: ["Add your pictures.", "Choose the new type and quality.", "Press Change picture type and download."],
      faq: [
        { q: "Can I convert several at once?", a: "Yes, up to 20 pictures." },
        { q: "Will I lose transparency?", a: "JPG has no see-through background. It becomes white." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Different apps want different picture types. Changing PNG to JPG is quick and keeps your pictures looking sharp.",
        "Add your pictures, choose the new type and quality, and download them together. See-through parts become white in JPG.",
        "Nothing is uploaded until you press the orange button, and the files are erased after download.",
      ],
    },
  },
  {
    slug: "jpg-to-png",
    apiTool: "image-converter",
    status: "live",
    runsOn: "server",
    group: "pictures",
    plainLabel: "JPG into PNG",
    actionLabel: "Change picture type",
    resultLabel: "Download your pictures",
    accepts: imageAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "format",
        type: "select",
        label: "New picture type",
        default: "png",
        choices: [
          { value: "jpg", label: "JPG" },
          { value: "png", label: "PNG" },
          { value: "webp", label: "WEBP" },
        ],
      },
    ],
    suggest: { kinds: ["image"], priority: 2, reason: "Switch to another picture type" },
    related: ["png-to-jpg", "webp-to-png", "jpg-to-pdf", "heic-to-jpg"],
    seo: {
      title: "JPG to PNG – Convert JPG Images Free | FileMyWay",
      metaDescription:
        "Change JPG pictures into PNG. Good for clear edges and images you want to edit later. Free, no sign-up, files erased after download.",
      h1: "JPG to PNG converter free",
      subtitle: "Change your pictures to the type you need.",
      keywords: ["jpg to png", "convert jpg to png", "change picture type"],
      howToSteps: ["Add your pictures.", "Choose the new type.", "Press Change picture type and download."],
      faq: [
        { q: "Why use PNG?", a: "PNG keeps sharp edges and supports a see-through background." },
        { q: "Are PNG files bigger?", a: "Yes, usually bigger than JPG." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "PNG is a good choice when you need clean lines, logos or images you plan to edit again.",
        "Add your pictures, choose PNG, and download them together. PNG files are usually larger than JPG because they keep more detail.",
        "Your files stay private until you press the orange button and are erased after download.",
      ],
    },
  },
  {
    slug: "webp-to-jpg",
    apiTool: "image-converter",
    status: "live",
    runsOn: "server",
    group: "pictures",
    plainLabel: "WEBP into JPG",
    actionLabel: "Change picture type",
    resultLabel: "Download your pictures",
    accepts: imageAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "format",
        type: "select",
        label: "New picture type",
        default: "jpg",
        choices: [
          { value: "jpg", label: "JPG" },
          { value: "png", label: "PNG" },
        ],
      },
      { id: "quality", type: "number", label: "Quality", default: 85, min: 40, max: 100 },
    ],
    suggest: { kinds: ["image"], priority: 2, reason: "Switch to another picture type" },
    related: ["webp-to-png", "png-to-jpg", "jpg-to-pdf", "heic-to-jpg"],
    seo: {
      title: "WEBP to JPG – Convert WEBP Images Free | FileMyWay",
      metaDescription:
        "Change WEBP pictures into JPG or PNG that every app can open. Free online, with no sign-up and files erased after download.",
      h1: "WEBP to JPG converter free",
      subtitle: "Change WEBP pictures into a type every app can open.",
      keywords: ["webp to jpg", "convert webp", "webp to png"],
      howToSteps: ["Add your WEBP pictures.", "Choose JPG or PNG.", "Press Change picture type and download."],
      faq: [
        { q: "What is WEBP?", a: "A modern picture type often used on websites." },
        { q: "Why convert it?", a: "Some apps still cannot open WEBP." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "WEBP is great for the web but not every program opens it. Converting to JPG or PNG makes your pictures easy to use anywhere.",
        "Add your pictures, choose JPG for small files or PNG for sharp edges, and download them together.",
        "Nothing is uploaded until you press the orange button, and the files are erased after download.",
      ],
    },
  },
  {
    slug: "webp-to-png",
    apiTool: "image-converter",
    status: "live",
    runsOn: "server",
    group: "pictures",
    plainLabel: "WEBP into PNG",
    actionLabel: "Change picture type",
    resultLabel: "Download your pictures",
    accepts: imageAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "format",
        type: "select",
        label: "New picture type",
        default: "png",
        choices: [
          { value: "jpg", label: "JPG" },
          { value: "png", label: "PNG" },
        ],
      },
    ],
    suggest: { kinds: ["image"], priority: 2, reason: "Switch to another picture type" },
    related: ["webp-to-jpg", "jpg-to-png", "jpg-to-pdf", "heic-to-jpg"],
    seo: {
      title: "WEBP to PNG – Convert WEBP to PNG Free | FileMyWay",
      metaDescription:
        "Change WEBP pictures into PNG with clear edges. Free, no sign-up, files erased after download. Easy to use on any device.",
      h1: "WEBP to PNG converter free",
      subtitle: "Change WEBP pictures into sharp PNG files.",
      keywords: ["webp to png", "convert webp to png"],
      howToSteps: ["Add your WEBP pictures.", "Choose PNG.", "Press Change picture type and download."],
      faq: [
        { q: "Why choose PNG?", a: "PNG keeps sharp edges and a see-through background." },
        { q: "Are files bigger?", a: "Yes, PNG is usually bigger than WEBP." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "If an app will not open your WEBP file, converting to PNG solves it while keeping the picture sharp.",
        "Add your pictures, choose PNG, and download them together. PNG keeps detail well but makes larger files.",
        "Your files stay private until you press the orange button and are erased after download.",
      ],
    },
  },
  {
    slug: "jpg-to-webp",
    apiTool: "image-converter",
    status: "live",
    runsOn: "server",
    group: "pictures",
    plainLabel: "JPG into WEBP",
    actionLabel: "Change picture type",
    resultLabel: "Download your pictures",
    accepts: imageAccept(),
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "format",
        type: "select",
        label: "New picture type",
        default: "webp",
        choices: [
          { value: "jpg", label: "JPG" },
          { value: "png", label: "PNG" },
          { value: "webp", label: "WEBP" },
        ],
      },
      { id: "quality", type: "number", label: "Quality", default: 80, min: 40, max: 100 },
    ],
    suggest: { kinds: ["image"], priority: 2, reason: "Switch to another picture type" },
    related: ["webp-to-jpg", "png-to-jpg", "jpg-to-pdf", "heic-to-jpg"],
    seo: {
      title: "JPG to WEBP – Convert JPG to WEBP Free | FileMyWay",
      metaDescription:
        "Change JPG pictures into much smaller WEBP files that load faster on the web. Free, no sign-up, files erased after download.",
      h1: "JPG to WEBP converter free",
      subtitle: "Make your pictures smaller for the web.",
      keywords: ["jpg to webp", "convert jpg to webp"],
      howToSteps: ["Add your pictures.", "Choose WEBP and quality.", "Press Change picture type and download."],
      faq: [
        { q: "Why WEBP?", a: "WEBP files are usually smaller than JPG." },
        { q: "Can every app open it?", a: "Most modern browsers can, but some older apps cannot." },
        { q: "Is it free?", a: "Yes, with no sign-up." },
      ],
      longCopy: [
        "Smaller pictures load faster. Converting JPG to WEBP shrinks the file while keeping it looking good.",
        "Add your pictures, choose WEBP and a quality level, and download them together. Test in your browser to be sure it looks right.",
        "Nothing is uploaded until you press the orange button, and the files are erased after download.",
      ],
    },
  },
  {
    slug: "heic-to-jpg",
    apiTool: "heic-to-jpg",
    status: "beta",
    runsOn: "server",
    group: "pictures",
    plainLabel: "iPhone photo (HEIC) into JPG",
    actionLabel: "Change to JPG",
    resultLabel: "Download your pictures",
    betaNote: "Beta. If it does not work, tell us.",
    accepts: {
      kinds: ["heic"],
      extensions: ["heic", "heif"],
      minFiles: 1,
      maxFiles: 20,
      multiple: true,
    },
    limits: DEFAULT_LIMITS,
    options: [
      {
        id: "quality",
        type: "radio",
        label: "Picture quality",
        default: "good",
        choices: [
          { value: "small", label: "Small" },
          { value: "good", label: "Good" },
          { value: "best", label: "Best" },
        ],
      },
    ],
    suggest: { kinds: ["heic"], priority: 1, reason: "Turn iPhone photos into JPG" },
    related: ["jpg-to-pdf", "png-to-jpg", "webp-to-jpg", "jpg-to-png"],
    seo: {
      title: "HEIC to JPG – Convert iPhone Photos Free | FileMyWay",
      metaDescription:
        "Change your iPhone HEIC photos into JPG files that every device and app can open. Free, no sign-up, erased after download.",
      h1: "HEIC to JPG converter free",
      subtitle: "Turn iPhone photos into JPG files everyone can open.",
      keywords: ["heic to jpg", "convert heic", "iphone photo to jpg", "heif to jpg"],
      howToSteps: ["Add your HEIC photos.", "Choose the quality.", "Press Change to JPG and download."],
      faq: [
        { q: "What is HEIC?", a: "The photo type iPhones use by default." },
        { q: "Why convert?", a: "Many apps and websites cannot open HEIC." },
        { q: "Is it free?", a: "Yes. This tool is in beta." },
      ],
      longCopy: [
        "iPhones save photos in HEIC, a compact type that some devices cannot open. Converting to JPG makes them work everywhere.",
        "Add your photos, choose the quality, and download them together. The pictures keep their size and look.",
        "Your photos stay private until you press the orange button and are erased after download.",
      ],
    },
  },

  /* -------------------- Hidden until Phase 2 (no pages) -------------------- */
  { slug: "word-to-pdf", apiTool: "word-to-pdf", status: "hidden", runsOn: "server", group: "make", plainLabel: "Word into PDF", actionLabel: "Make the PDF", resultLabel: "Download your PDF", accepts: { kinds: ["word"], extensions: ["doc", "docx"], minFiles: 1, maxFiles: 1, multiple: false }, limits: DEFAULT_LIMITS, options: [], related: [] },
  { slug: "ppt-to-pdf", apiTool: "ppt-to-pdf", status: "hidden", runsOn: "server", group: "make", plainLabel: "PowerPoint into PDF", actionLabel: "Make the PDF", resultLabel: "Download your PDF", accepts: { kinds: ["powerpoint"], extensions: ["ppt", "pptx"], minFiles: 1, maxFiles: 1, multiple: false }, limits: DEFAULT_LIMITS, options: [], related: [] },
  { slug: "pdf-to-word", apiTool: "pdf-to-word", status: "hidden", runsOn: "server", group: "convert", plainLabel: "PDF into Word", actionLabel: "Change to Word", resultLabel: "Download your document", accepts: pdfAccept(), limits: DEFAULT_LIMITS, options: [], related: [] },
];

/* ------------------------------ Helpers ------------------------------ */

export const GROUP_ORDER: ToolGroup[] = ["convert", "make", "fix", "pictures"];

export const GROUP_LABELS: Record<ToolGroup, string> = {
  convert: "Change a PDF into something else",
  make: "Make a PDF",
  fix: "Fix up a PDF",
  pictures: "Pictures",
};

export function isVisible(tool: ToolConfig): boolean {
  return tool.status === "live" || tool.status === "beta";
}

export function visibleTools(): ToolConfig[] {
  return TOOLS.filter(isVisible);
}

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolByAliasOrSlug(value: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.slug === value || t.aliases?.includes(value));
}

export function toolsByGroup(group: ToolGroup): ToolConfig[] {
  return visibleTools().filter((t) => t.group === group);
}
