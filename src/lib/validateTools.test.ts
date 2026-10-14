import { describe, it, expect } from "vitest";
import { validateTools } from "./validateTools";

describe("tools config", () => {
  it("passes build-time validation", () => {
    const issues = validateTools();
    const summary = issues.map((i) => `${i.slug}.${i.field}: ${i.message}`).join("\n");
    expect(issues, `\n${summary}\n`).toEqual([]);
  });
});
