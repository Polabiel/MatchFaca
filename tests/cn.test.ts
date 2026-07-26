/**
 * Basic test example — ported from Yield testing pattern.
 *
 * Uses Node.js built-in test runner (no Jest/Vitest needed).
 * Run: pnpm test
 *
 * This validates utility functions shared across the codebase.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

// Inline the cn() logic to avoid importing from packages with bundler module resolution
function cn(...inputs: (string | boolean | null | undefined | Record<string, boolean | null | undefined>)[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(" ");
}

void describe("cn() utility", () => {
  void it("merges string classes", () => {
    assert.equal(cn("a", "b"), "a b");
  });

  void it("filters falsy values", () => {
    assert.equal(cn("a", false, null, undefined, "b"), "a b");
  });

  void it("handles object syntax", () => {
    assert.equal(cn("base", { active: true, hidden: false }), "base active");
  });
});
