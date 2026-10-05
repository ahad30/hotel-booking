const { test } = require("node:test");
const assert = require("node:assert/strict");
const { ruleParse } = require("../src/services/Assistant/ruleParser");

const divisions = ["Dhaka", "Chattagram", "Sylhet", "Khulna", "Barisal", "Rajshahi", "Rangpur", "Mymensingh"].map((name) => ({ name }));
// Monday 5 Oct 2026
const today = new Date("2026-10-05T00:00:00Z");
const parse = (q) => ruleParse(q, { divisions, today });

test("family, division alias, budget, amenity and weekend", () => {
    const f = parse("Family of 4 in Chattogram under ৳6,000 with a pool this weekend");
    assert.equal(f.divisionName, "Chattagram");
    assert.equal(f.maxPrice, 6000);
    assert.equal(f.adults, 2);
    assert.equal(f.children, 2);
    assert.deepEqual(f.amenities, ["Swimming Pool"]);
    // Bangladesh's weekend starts on Friday.
    assert.equal(f.checkIn, "2026-10-09");
    assert.equal(f.checkOut, "2026-10-11");
});

test("couple, explicit date and nights", () => {
    const f = parse("Couple in Sylhet, 3 nights from 12 Oct, with spa");
    assert.equal(f.divisionName, "Sylhet");
    assert.equal(f.adults, 2);
    assert.equal(f.checkIn, "2026-10-12");
    assert.equal(f.checkOut, "2026-10-15");
    assert.deepEqual(f.amenities, ["Spa"]);
});

test("price ranges with k suffix", () => {
    const f = parse("somewhere in dhaka between 2k and 5k");
    assert.equal(f.divisionName, "Dhaka");
    assert.equal(f.minPrice, 2000);
    assert.equal(f.maxPrice, 5000);
});

test("adults, a kid, tomorrow", () => {
    const f = parse("2 adults and a kid tomorrow under 3000 with WiFi");
    assert.equal(f.adults, 2);
    assert.equal(f.children, 1);
    assert.equal(f.checkIn, "2026-10-06");
    assert.equal(f.checkOut, "2026-10-07");
    assert.deepEqual(f.amenities, ["Free WiFi"]);
});

test("next weekend skips the coming one", () => {
    assert.equal(parse("next weekend in barishal").checkIn, "2026-10-16");
    assert.equal(parse("next weekend in barishal").divisionName, "Barisal");
});

test("leaves unknown fields empty", () => {
    const f = parse("somewhere nice");
    assert.equal(f.divisionName, "");
    assert.equal(f.maxPrice, 0);
    assert.equal(f.checkIn, "");
    assert.deepEqual(f.amenities, []);
});
