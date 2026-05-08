import { describe, it, expect } from "vitest";
import { selectTier } from "../middleware/rateLimit";

describe("selectTier", () => {
  describe("read methods → general tier", () => {
    it.each(["GET", "HEAD", "OPTIONS"])(
      "%s /api/users returns 'general'",
      (method) => {
        expect(selectTier(method, "/api/users")).toBe("general");
      },
    );
  });

  describe("strict paths → strict tier", () => {
    it.each(["/api/login", "/api/signup", "/api/contact"])(
      "POST %s returns 'strict'",
      (path) => {
        expect(selectTier("POST", path)).toBe("strict");
      },
    );
  });

  describe("non-strict mutations → strong tier", () => {
    it.each([
      ["POST", "/api/tasks"],
      ["PUT", "/api/resume"],
      ["DELETE", "/api/tasks/123"],
      ["PATCH", "/api/user/profile"],
    ])("%s %s returns 'strong'", (method, path) => {
      expect(selectTier(method, path)).toBe("strong");
    });
  });
});
