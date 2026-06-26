import jwt from "jsonwebtoken";

const {
  generateJWT,
  encodePassword,
  validatePassword,
  generateConfirmCode,
  getAccessTokenTTL,
  getRefreshTokenTTL,
} = await import("../utils/auth-utils.js").then((m) => m.default ?? m);

const TEST_SECRET = "test-secret-key";
const TEST_USER_ID = "abc123";

describe("generateJWT", () => {
  it("returns a string", () => {
    const token = generateJWT(TEST_USER_ID, TEST_SECRET, "1h");
    expect(typeof token).toBe("string");
  });

  it("encodes the userId in the payload", () => {
    const token = generateJWT(TEST_USER_ID, TEST_SECRET, "1h");
    const decoded = jwt.verify(token, TEST_SECRET);
    expect(decoded.userId).toBe(TEST_USER_ID);
  });

  it("sets an expiry on the token", () => {
    const token = generateJWT(TEST_USER_ID, TEST_SECRET, "1h");
    const decoded = jwt.verify(token, TEST_SECRET);
    expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});

describe("encodePassword", () => {
  it("returns a string", async () => {
    const hash = await encodePassword("mypassword");
    expect(typeof hash).toBe("string");
  });

  it("does not return the original password", async () => {
    const hash = await encodePassword("mypassword");
    expect(hash).not.toBe("mypassword");
  });

  it("returns a bcrypt hash", async () => {
    const hash = await encodePassword("mypassword");
    expect(hash.startsWith("$2b$")).toBe(true);
  });
});

describe("validatePassword", () => {
  it("returns true when password matches the hash", async () => {
    const hash = await encodePassword("correctpassword");
    const result = await validatePassword("correctpassword", hash);
    expect(result).toBe(true);
  });

  it("returns false when password does not match", async () => {
    const hash = await encodePassword("correctpassword");
    const result = await validatePassword("wrongpassword", hash);
    expect(result).toBe(false);
  });
});

describe("generateConfirmCode", () => {
  it("returns a string", async () => {
    const code = await generateConfirmCode(6);
    expect(typeof code).toBe("string");
  });

  it("returns the correct number of characters", async () => {
    const code = await generateConfirmCode(6);
    expect(code).toHaveLength(6);
  });

  it("contains only numeric characters", async () => {
    const code = await generateConfirmCode(6);
    expect(/^\d+$/.test(code)).toBe(true);
  });
});

describe("getAccessTokenTTL", () => {
  it("returns a positive number when ACCESS_TOKEN_LIFE is set", () => {
    process.env.ACCESS_TOKEN_LIFE = "15m";
    const ttl = getAccessTokenTTL();
    expect(typeof ttl).toBe("number");
    expect(ttl).toBeGreaterThan(0);
  });
});

describe("getRefreshTokenTTL", () => {
  it("returns a positive number when REFRESH_TOKEN_LIFE is set", () => {
    process.env.REFRESH_TOKEN_LIFE = "7d";
    const ttl = getRefreshTokenTTL();
    expect(typeof ttl).toBe("number");
    expect(ttl).toBeGreaterThan(0);
  });
});
