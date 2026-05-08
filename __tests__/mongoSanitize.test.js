import { vi } from "vitest";
import mongoSanitize from "express-mongo-sanitize";

function sanitize(input) {
  // Replicate what express-mongo-sanitize does to req.body / req.query
  const req = { body: input, query: input };
  const res = {};
  const next = vi.fn();
  mongoSanitize()(req, res, next);
  return { body: req.body, query: req.query };
}

describe("express-mongo-sanitize middleware", () => {
  it("strips top-level keys starting with $", () => {
    const { body } = sanitize({ $gt: "" });
    expect(body).not.toHaveProperty("$gt");
  });

  it("strips nested keys starting with $", () => {
    const { body } = sanitize({ password: { $gt: "" } });
    expect(body.password).not.toHaveProperty("$gt");
  });

  it("strips keys containing a dot", () => {
    const { body } = sanitize({ "user.email": "test@test.com" });
    expect(body).not.toHaveProperty("user.email");
  });

  it("preserves safe string values", () => {
    const { body } = sanitize({
      username: "alice",
      email: "alice@example.com",
    });
    expect(body.username).toBe("alice");
    expect(body.email).toBe("alice@example.com");
  });

  it("sanitizes req.query as well as req.body", () => {
    const { query } = sanitize({ $where: "this.password == ''" });
    expect(query).not.toHaveProperty("$where");
  });

  it("does not mutate safe nested objects", () => {
    const { body } = sanitize({ address: { city: "New York", zip: "10001" } });
    expect(body.address.city).toBe("New York");
    expect(body.address.zip).toBe("10001");
  });
});
