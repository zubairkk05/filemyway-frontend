/**
 * Plain-language copy (doc 12). All user-facing strings live here so they can be
 * edited without touching components. No technical codes ever reach the visitor.
 */

export const copy = {
  siteName: "filemyway",
  headerHelp: "Need help?",
  skipToContent: "Skip to main content",

  hero: {
    h1: "What would you like to do?",
    h1Mark: "do?",
    subline: "Free online PDF and image tools. Merge, split, compress and convert in seconds. No sign-up.",
  },

  drop: {
    home: "Drop a file here",
    homeHelp: "PDF, pictures, Excel or CSV files. We will show you what you can do with it.",
    tool: (thing: string) => `Drop your ${thing} here`,
    chooseFile: "Choose a file",
    chooseFileAlt: "Or choose a file",
    inputLabel: "Choose a file to upload",
    dragOver: "Let go to upload",
    analysing: "Looking at your file…",
    question: "What do you want to do with this file?",
    chooseAction: "Choose what to do",
    bestMatch: "Best match",
    more: "More things you can do",
    privacyLine: "Nothing leaves your device until you press the orange button.",
    limits: (mb: number) => `Files up to ${mb} MB`,
    startOver: "Start over",
    chooseDifferent: "Choose a different file",
    remove: "Remove",
    lookAtFile: "Looking at your file…",
  },

  groups: {
    convert: "Change a PDF into something else",
    make: "Make a PDF",
    fix: "Fix up a PDF",
    pictures: "Pictures",
  },

  groupsIntro: "Or pick what you want to do",

  steps: {
    step1: "Choose your file",
    step2: "Press the orange button",
    step3: "Download your file",
    working: "Working on it… Please keep this page open. This usually takes less than a minute.",
    sending: "Sending your file…",
    ready: "Your file is ready",
    expires: (minutes: number) => `Ready for another ${minutes} minutes`,
    deleteNow: "Delete my file now",
    another: "Change another file",
    reconvert: "Convert again",
    stopAndRestart: "Stop and start again",
    keepOpen: "Please keep this page open",
    takingLonger: "This is taking longer than usual.",
    keepWaiting: "Keep waiting",
    alreadySmall: "This PDF is already about as small as it can get.",
  },

  ocr: {
    ready: "Your words are ready",
    pagesRead: (n: number) => `${n} ${n === 1 ? "page" : "pages"} read on your device`,
    copy: "Copy text",
    copied: "Copied",
    download: "Download .txt",
    empty: "We could not read any words. Try a clearer scan or a different file.",
    notice: "Anything we could read is shown below. Check it before you use it.",
  },

  trust: {
    free: "It is free.",
    erased: "Your file is erased after you download it.",
    neverRead: "We never read your files.",
  },

  errors: {
    FILE_TOO_LARGE: (p: Record<string, unknown>) => `This file is too big. The limit is ${String(p.limit)}.`,
    TOO_MANY_FILES: (p: Record<string, unknown>) => `You can add up to ${String(p.max)} files at a time.`,
    UNSUPPORTED_TYPE: (p: Record<string, unknown>) =>
      `We cannot use this kind of file here. We accept: ${String(p.list)}.`,
    FILE_CORRUPT: "We could not open this file. Try saving it again, then upload it.",
    PDF_ENCRYPTED: "This PDF has a password. Type the password below, or use Unlock PDF.",
    PDF_TOO_MANY_PAGES: (p: Record<string, unknown>) =>
      `This PDF has too many pages for this tool. The limit is ${String(p.max)}. Try Cut a PDF apart first.`,
    NO_TABLES_FOUND:
      "We could not find tables in this PDF. It may be a scan. Tables can only be read from PDFs with real text.",
    ENGINE_UNAVAILABLE: "This tool is busy right now. Please try again in a few minutes.",
    ENGINE_FAILED:
      "Something went wrong with this file. Please try again. If it keeps happening, try a different file.",
    TIMEOUT: "This took too long. Try a smaller file or fewer pages.",
    RATE_LIMITED: "Please wait a minute and try again.",
    JOB_NOT_FOUND: "This file is no longer here. Files are erased after you download them. Please start again.",
    JOB_EXPIRED: "This file is no longer here. Files are erased after you download them. Please start again.",
    INVALID_OPTIONS: "Please check your choices and try again.",
    NETWORK: "Your connection dropped. We will keep trying.",
  } as Record<string, string | ((p: Record<string, unknown>) => string)>,

  smartDrop: {
    folder: "Please drop files, not folders.",
    zip: "We cannot open zip files yet.",
    wordPpt: "We cannot change Word or PowerPoint files yet. Try saving it as a PDF, then drop it here.",
    wrongExtension: (ext: string, kind: string) =>
      `This file is named .${ext} but looks like a ${kind}. We used what is inside.`,
    mixedKinds: "You added different kinds of files. Which ones do you want to work with?",
    encrypted: "This PDF is locked. Unlock it first, then you can do more.",
    scanDetected: "This PDF looks like a scan. We can read the words for you.",
    wrongFileOnTool: (kind: string, suggestedAction: string) =>
      `That looks like a ${kind}. Did you want to ${suggestedAction}?`,
    duplicate: "You already added this file.",
    unsupported: "We cannot use this kind of file yet.",
    unknownList: "We accept PDFs, pictures (JPG, PNG, WEBP), iPhone photos (HEIC), Excel and CSV files.",
  },
};

export type CopyKey = keyof typeof copy;
