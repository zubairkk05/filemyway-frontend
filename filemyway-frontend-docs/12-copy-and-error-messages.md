# 12 — Copy and Error Messages (plain language)

Keep sentences short. Say what happened and what to do. Never show codes. Strings live in `config/copy` so they can be edited without touching components.

## Core strings
| Key | Text |
|---|---|
| dropHome | Drop a file here |
| dropHomeHelp | PDF, pictures, Excel or CSV files. We will show you what you can do with it. |
| dropTool | Drop your {thing} here |
| chooseFile | Choose a file |
| chooseFileAlt | Or choose a file |
| dragOver | Let go to upload |
| analysing | Looking at your file… |
| question | What do you want to do with this file? |
| bestMatch | Best match |
| more | More things you can do |
| privacyLine | Nothing leaves your device until you press the orange button. |
| step1 / step2 / step3 | Choose your file / Press the orange button / Download your file |
| working | Working on it… Please keep this page open. This usually takes less than a minute. |
| ready | Your file is ready |
| expires | Ready for another {minutes} minutes |
| deleteNow | Delete my file now |
| another | Change another file |
| startOver | Start over |
| help | Need help? |

## Errors (error code → message and next step)
| Code | Message |
|---|---|
| FILE_TOO_LARGE | This file is too big. The limit is {limit}. |
| TOO_MANY_FILES | You can add up to {max} files at a time. |
| UNSUPPORTED_TYPE | We cannot use this kind of file here. We accept: {list}. |
| FILE_CORRUPT | We could not open this file. Try saving it again, then upload it. |
| PDF_ENCRYPTED | This PDF has a password. Type the password below, or use Unlock PDF. |
| PDF_TOO_MANY_PAGES | This PDF has too many pages for this tool. The limit is {max}. Try Cut a PDF apart first. |
| NO_TABLES_FOUND | We could not find tables in this PDF. It may be a scan. Tables can only be read from PDFs with real text. |
| ENGINE_UNAVAILABLE | This tool is busy right now. Please try again in a few minutes. |
| ENGINE_FAILED | Something went wrong with this file. Please try again. If it keeps happening, try a different file. |
| TIMEOUT | This took too long. Try a smaller file or fewer pages. |
| RATE_LIMITED | Please wait a minute and try again. |
| JOB_NOT_FOUND / JOB_EXPIRED | This file is no longer here. Files are erased after 1 hour. Please start again. |
| INVALID_OPTIONS | Please check your choices and try again. (Show the specific field message when available.) |
| NETWORK | Your connection dropped. We will keep trying. |

## Smart drop messages
| Situation | Message |
|---|---|
| Folder dropped | Please drop files, not folders. |
| Zip file | We cannot open zip files yet. |
| Word / PowerPoint | We cannot change Word or PowerPoint files yet. Here is what we can do. |
| Wrong extension | This file is named .{ext} but looks like a {kind}. We used what is inside. |
| Mixed kinds | You added different kinds of files. Which ones do you want to work with? |
| Encrypted PDF | This PDF is locked. Unlock it first, then you can do more. |
| Scan detected | This PDF looks like a scan. We can read the words for you. |
| Wrong file on tool page | That looks like a {kind}. Did you want to {suggestedAction}? |
| Duplicate | You already added this file. |

## Beta notes (one sentence each, from the config)
PDF into Excel: Works with PDFs that have real text and tables. Scans are not supported.
PDF into PowerPoint: Each slide is a picture of your page. The text is not editable.
Excel or CSV into PDF: Simple tables only. Charts and pictures are not included.
Read a scanned PDF: Runs on your device. Your file is not uploaded. Large scans can be slow on phones.
iPhone photo (HEIC) into JPG: Beta. If it does not work, tell us.
