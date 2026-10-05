process.env.JWT_SECRET = "test-secret";
process.env.DEMO_ADMIN_PHONE = "01000000000";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { auth, optionalAuth, selfOrAdmin, signToken } = require("../src/middleware/auth");

// Runs a middleware and resolves with whatever it passed to next().
const run = (mw, req) => new Promise((resolve) => mw({ headers: {}, params: {}, method: "GET", ...req }, {}, resolve));
const bearer = (user) => ({ authorization: `Bearer ${signToken(user)}` });

const user = { id: "u1", phone: "01700000000", role: "user" };
const admin = { id: "a1", phone: "01800000000", role: "admin" };
const demo = { id: "d1", phone: "01000000000", role: "admin" };

test("rejects requests without a token", async () => {
    const err = await run(auth(), {});
    assert.equal(err.statusCode, 401);
});

test("rejects a token signed with another secret", async () => {
    const forged = jwt.sign({ id: "x", role: "admin" }, "not-the-secret");
    const err = await run(auth(), { headers: { authorization: `Bearer ${forged}` } });
    assert.equal(err.statusCode, 401);
});

test("rejects an expired token", async () => {
    const expired = jwt.sign({ ...admin, exp: Math.floor(Date.now() / 1000) - 10 }, "test-secret");
    const err = await run(auth(), { headers: { authorization: `Bearer ${expired}` } });
    assert.equal(err.statusCode, 401);
});

test("enforces roles", async () => {
    assert.equal((await run(auth("admin"), { headers: bearer(user) })).statusCode, 403);
    assert.equal(await run(auth("admin"), { headers: bearer(admin) }), undefined);
});

test("demo admin can read but not write", async () => {
    assert.equal(await run(auth("admin"), { headers: bearer(demo), method: "GET" }), undefined);
    const err = await run(auth("admin"), { headers: bearer(demo), method: "DELETE" });
    assert.equal(err.statusCode, 403);
});

test("optionalAuth attaches the user and ignores bad tokens", async () => {
    const req = { headers: bearer(user), params: {} };
    await new Promise((r) => optionalAuth(req, {}, r));
    assert.equal(req.user.id, "u1");

    const anon = { headers: { authorization: "Bearer garbage" } };
    assert.equal(await new Promise((r) => optionalAuth(anon, {}, r)), undefined);
    assert.equal(anon.user, undefined);
});

test("selfOrAdmin allows owners and admins only", async () => {
    const mw = selfOrAdmin("userId");
    assert.equal(await run(mw, { user, params: { userId: "u1" } }), undefined);
    assert.equal(await run(mw, { user: admin, params: { userId: "u1" } }), undefined);
    assert.equal((await run(mw, { user, params: { userId: "someone-else" } })).statusCode, 403);
});
