const { test } = require("node:test");
const assert = require("node:assert/strict");
const BookingService = require("../src/services/Booking/BookingService");

// Pure helper; no database needed.
const bookedQuantity = (bookings, roomId) => BookingService.prototype.bookedQuantity.call(null, bookings, roomId);

// Callers pass only the overlapping bookings that include the room type.
test("sums the quantity booked for a room type", () => {
    const both = { roomIds: ["r1", "r2"], bookingItem: [{ roomId: "r1", quantity: 2 }, { roomId: "r2", quantity: 1 }] };
    const r1Only = { roomIds: ["r1"], bookingItem: [{ roomId: "r1", quantity: 3 }] };
    assert.equal(bookedQuantity([both, r1Only], "r1"), 5);
    assert.equal(bookedQuantity([both], "r2"), 1);
});

test("older bookings without bookingItem count as one room", () => {
    assert.equal(bookedQuantity([{ roomIds: ["r1"] }, { bookingItem: [] }], "r1"), 2);
});

test("missing or invalid quantity counts as one", () => {
    assert.equal(bookedQuantity([{ bookingItem: [{ roomId: "r1" }, { roomId: "r1", quantity: "x" }] }], "r1"), 2);
});
