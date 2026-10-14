import { copy } from "@/config/copy";

/** Maps an API error code to a plain-language sentence (doc 12). */
export function errorText(code: string, params: Record<string, unknown> = {}): string {
  const entry = copy.errors[code];
  if (typeof entry === "string") return entry;
  if (typeof entry === "function") {
    try {
      return (entry as (p: Record<string, unknown>) => string)(params);
    } catch {
      return copy.errors.ENGINE_FAILED as string;
    }
  }
  return copy.errors.ENGINE_FAILED as string;
}
