import { vi } from "vitest";

// Mock winston before importing the middleware
vi.mock("winston", () => ({
  default: {
    loggers: {
      get: vi.fn(() => ({ error: vi.fn() })),
    },
  },
  loggers: {
    get: vi.fn(() => ({ error: vi.fn() })),
  },
}));

const { default: catchError } = await import("../middleware/catchError.js");

function makeMocks() {
  const req = {};
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  const next = vi.fn();
  return { req, res, next };
}

describe("catchError middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the error's .status code when present", async () => {
    const { req, res, next } = makeMocks();
    const err = { status: 400, message: "Bad Request" };

    await catchError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("falls back to .statusCode when .status is absent", async () => {
    const { req, res, next } = makeMocks();
    const err = { statusCode: 404, message: "Not Found" };

    await catchError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("defaults to 500 when neither .status nor .statusCode is present", async () => {
    const { req, res, next } = makeMocks();
    const err = new Error("Something exploded");

    await catchError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("never returns HTTP 200 for an error", async () => {
    const { req, res, next } = makeMocks();
    const err = { status: 401, message: "Unauthorized" };

    await catchError(err, req, res, next);

    expect(res.status).not.toHaveBeenCalledWith(200);
  });

  it("preserves the response envelope structure", async () => {
    const { req, res, next } = makeMocks();
    const err = { status: 403, message: "Forbidden" };

    await catchError(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      content: {
        target: [],
        meta: { total: 0, success: false },
        error: { status: 403, message: "Forbidden", type: "api" },
      },
    });
  });

  it("sets error.status in the body to match the HTTP status code", async () => {
    const { req, res, next } = makeMocks();
    const err = { statusCode: 422, message: "Unprocessable" };

    await catchError(err, req, res, next);

    const body = res.json.mock.calls[0][0];
    expect(body.content.error.status).toBe(422);
    expect(res.status).toHaveBeenCalledWith(422);
  });
});
