# 09 — API Client and State

## API (from the backend pack, `02-backend-nestjs.md`)
Base `NEXT_PUBLIC_API_BASE`. Endpoints used: `GET /tools`, `POST /jobs/:tool` (multipart `files` + `options` JSON), `GET /jobs/:id`, `GET /jobs/:id/download?token=`, `DELETE /jobs/:id`. Error shape `{error:{code,message}}`. Error codes map to plain-language texts in `12-copy-and-error-messages.md`.

## Client responsibilities
- Fetch `/tools` once per session (cache in memory); fall back to the build-time config if the call fails.
- Upload with progress (XHR or fetch streams with progress events) and abort support.
- Poll job status with easing; stop on unmount; show timeout help after 5 minutes.
- Keep `deleteToken` in memory only; send DELETE on "Delete my file now" and when the user cancels.
- Never put file names in URLs or analytics. Never log file content.
- Handle 429 (rate limited) with a calm "Please wait a minute and try again" using Retry-After.
- Handle offline/online events; retry polling automatically.

## State
- Pending Files store (05): in-memory only.
- Tool session state machine (07): idle → fileChosen → uploading → processing → done | error, one instance per tool page, reset on "Change another file".
- No global state library required; React context + reducers are enough.
- Nothing stored in localStorage/cookies in v1 except none. (If analytics need consent later, add a consent banner then.)

## Result handling
Result object: fileName, size, downloadUrl, expiresAt, stats (e.g. compress before/after). Render the download button from it; show expiry countdown.

## Mock mode
Provide a mock API mode (env flag) that simulates uploads, progress, success and each error code, used for UI development and automated tests without the backend.

## Security
No secrets in frontend. Validate and escape file names before rendering. Use `rel=noopener` on external links. Set a strict Content-Security-Policy that allows only your own scripts, the API domain, and (if used) analytics; self-host fonts and WASM assets.
