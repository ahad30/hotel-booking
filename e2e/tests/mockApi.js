const path = require("path");
const fs = require("fs");

const fixture = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, "../fixtures", name), "utf8"));
const hotels = fixture("hotels.json");
const hotel = fixture("hotel.json");
const rooms = fixture("rooms.json");
const ok = (data, message = "ok") => ({ success: true, message, data });

const iso = (d) => d.toISOString().slice(0, 10);

// Every room is free except on the 10th night, which is fully booked.
const availability = (url) => {
  const from = new Date(`${url.searchParams.get("from")}T00:00:00Z`);
  const days = Number(url.searchParams.get("days") || 42);
  const types = rooms.data.map(({ id, type, price, roomQty }) => ({ id, type, price, roomQty }));
  const nights = Array.from({ length: days }, (_, i) => ({
    date: iso(new Date(from.getTime() + i * 864e5)),
    free: Object.fromEntries(types.map((r) => [r.id, i === 9 ? 0 : r.roomQty])),
  }));
  return ok({ hotelId: hotel.data.id, from: iso(from), days, rooms: types, nights });
};

const assistantResult = (query) => {
  const room = rooms.data[0];
  return ok({
    query,
    interpretedBy: "rules",
    filters: {
      divisionName: "Chattagram",
      keywords: "",
      minPrice: 0,
      maxPrice: 6000,
      adults: 2,
      children: 2,
      rooms: 1,
      amenities: ["Swimming Pool"],
      checkIn: "2026-10-09",
      checkOut: "2026-10-11",
      nights: 2,
      summary: "",
    },
    results: [
      {
        id: hotel.data.id,
        name: hotel.data.name,
        location: hotel.data.location,
        image: hotel.data.image,
        amenities: hotel.data.amenities,
        matchingRoomTypes: 1,
        availabilityChecked: true,
        bestRoom: { id: room.id, type: room.type, price: room.price, sleeps: 4, total: room.price * 2 },
      },
    ],
  });
};

// Answers every API call from fixtures and stubs third-party assets so tests are fast and offline.
async function mockApi(page) {
  await page.route(/^https?:\/\/(?!localhost)/, (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.host !== "api.test") {
      return request.resourceType() === "image"
        ? route.fulfill({ status: 200, contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg"/>' })
        : route.abort();
    }

    const p = url.pathname.replace(/^\/api\/v1/, "");
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

    if (p === "/division") return json(fixture("divisions.json"));
    if (p === "/sliders") return json(fixture("sliders.json"));
    if (p === "/hotel") return json(hotels);
    if (p === `/hotel/${hotel.data.id}`) return json(hotel);
    if (p === `/hotel/${hotel.data.id}/rooms`) return json(rooms);
    if (p === `/hotel/${hotel.data.id}/availability`) return json(availability(url));
    if (p === "/booking/check-availability") return json(ok({ available: true, remaining: 5 }));
    if (p === "/assistant/search") return json(assistantResult(request.postDataJSON()?.query));
    return json({ success: false, message: `No mock for ${p}` }, 404);
  });
}

module.exports = { mockApi, hotel, hotels };
