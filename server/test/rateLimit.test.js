const { test } = require("node:test");
const assert = require("node:assert/strict");
const rateLimit = require("../src/middleware/rateLimit");

const hit = (mw, ip, res = { setHeader() {} }) => new Promise((resolve) => mw({ headers: {}, ip }, res, resolve));

test("allows up to max requests per window, then returns 429 with Retry-After", async () => {
    const mw = rateLimit({ windowMs: 60_000, max: 3 });
    for (let i = 0; i < 3; i++) assert.equal(await hit(mw, "1.1.1.1"), undefined);

    const headers = {};
    const err = await hit(mw, "1.1.1.1", { setHeader: (k, v) => (headers[k] = v) });
    assert.equal(err.statusCode, 429);
    assert.ok(headers["Retry-After"] > 0);
});

test("counts each client separately", async () => {
    const mw = rateLimit({ windowMs: 60_000, max: 1 });
    assert.equal(await hit(mw, "2.2.2.2"), undefined);
    assert.equal(await hit(mw, "3.3.3.3"), undefined);
    assert.equal((await hit(mw, "2.2.2.2")).statusCode, 429);
});

test("starts a new window after windowMs", async () => {
    const mw = rateLimit({ windowMs: 20, max: 1 });
    await hit(mw, "4.4.4.4");
    await new Promise((r) => setTimeout(r, 30));
    assert.equal(await hit(mw, "4.4.4.4"), undefined);
});
