const Anthropic = require("@anthropic-ai/sdk");
const BookingService = require("../Booking/BookingService");
const { ruleParse } = require("./ruleParser");

const MODEL = "claude-opus-5-5";
const MAX_RESULTS = 6;

const DAY = 24 * 60 * 60 * 1000;
const isoDay = (d) => d.toISOString().slice(0, 10);
const validDay = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || "") && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

// Turns a natural-language trip request into filters (Claude, with a rule-based
// fallback), then matches it against real hotels and live room availability.
class AssistantService {
    constructor(prismaClient) {
        this.prisma = prismaClient;
        this.bookings = new BookingService();
        // Only call the API when a key is configured; otherwise use the rules.
        this.client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
    }

    async context() {
        const [divisions, hotels] = await Promise.all([
            this.prisma.division.findMany({ select: { serialId: true, name: true, bn_name: true } }),
            this.prisma.hotel.findMany({
                where: { isActive: true },
                include: { rooms: { where: { isAvailable: true } } },
            }),
        ]);
        const amenities = [...new Set(hotels.flatMap((h) => [...(h.amenities || []), ...h.rooms.flatMap((r) => r.amenities || [])]))].sort();
        return { divisions, hotels, amenities };
    }

    schema(divisions, amenities) {
        return {
            type: "object",
            additionalProperties: false,
            required: ["divisionName", "keywords", "minPrice", "maxPrice", "adults", "children", "rooms", "amenities", "checkIn", "checkOut", "summary"],
            properties: {
                divisionName: { type: "string", enum: ["", ...divisions.map((d) => d.name)], description: "Division the guest wants, or empty" },
                keywords: { type: "string", description: "Hotel or area name the guest mentioned, or empty" },
                minPrice: { type: "integer", description: "Minimum nightly price per room in BDT, 0 if not given" },
                maxPrice: { type: "integer", description: "Maximum nightly price per room in BDT, 0 if not given" },
                adults: { type: "integer", description: "Number of adults, 0 if not given" },
                children: { type: "integer", description: "Number of children, 0 if not given" },
                rooms: { type: "integer", description: "Rooms wanted, 0 if not given" },
                amenities: { type: "array", items: amenities.length ? { type: "string", enum: amenities } : { type: "string" }, description: "Amenities the guest asked for" },
                checkIn: { type: "string", description: "YYYY-MM-DD or empty" },
                checkOut: { type: "string", description: "YYYY-MM-DD or empty" },
                summary: { type: "string", description: "One short sentence restating the request" },
            },
        };
    }

    async parseWithClaude(query, ctx, today) {
        const weekday = today.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Dhaka" });
        const response = await this.client.beta.messages.create({
            model: MODEL,
            max_tokens: 2048,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "low", format: { type: "json_schema", schema: this.schema(ctx.divisions, ctx.amenities) } },
            system:
                `You turn hotel-booking requests for BEHB, a hotel booking site in Bangladesh, into search filters. ` +
                `Today is ${weekday}, ${isoDay(today)} (Asia/Dhaka). The weekend in Bangladesh is Friday and Saturday, so "this weekend" means the coming Friday to Sunday checkout. ` +
                `Prices are in Bangladeshi Taka per room per night; "5k" means 5000. ` +
                `Only use the divisions and amenities allowed by the schema; leave a field empty or 0 when the guest did not say it. Never invent dates.`,
            messages: [{ role: "user", content: query }],
        });

        if (response.stop_reason === "refusal") return null;
        const text = response.content.find((b) => b.type === "text")?.text;
        return text ? JSON.parse(text) : null;
    }

    async parse(query, ctx) {
        const today = new Date();
        if (this.client) {
            try {
                const filters = await this.parseWithClaude(query, ctx, today);
                if (filters) return { filters, interpretedBy: "claude" };
            } catch (error) {
                if (error instanceof Anthropic.RateLimitError) console.warn("Assistant: Claude rate limited, using rules");
                else if (error instanceof Anthropic.APIError) console.warn(`Assistant: Claude API error ${error.status}, using rules`);
                else console.warn("Assistant: could not use Claude, using rules:", error.message);
            }
        }
        return { filters: ruleParse(query, { divisions: ctx.divisions, today }), interpretedBy: "rules" };
    }

    normalize(f) {
        const out = { ...f };
        out.adults = Math.max(1, Math.min(20, Number(f.adults) || (f.children ? 1 : 2)));
        out.children = Math.max(0, Math.min(20, Number(f.children) || 0));
        out.rooms = Math.max(1, Math.min(10, Number(f.rooms) || 1));
        out.minPrice = Math.max(0, Number(f.minPrice) || 0);
        out.maxPrice = Math.max(0, Number(f.maxPrice) || 0);
        out.amenities = Array.isArray(f.amenities) ? f.amenities : [];

        const today = isoDay(new Date());
        if (!validDay(f.checkIn) || f.checkIn < today) {
            out.checkIn = "";
            out.checkOut = "";
        } else if (!validDay(f.checkOut) || f.checkOut <= f.checkIn) {
            out.checkOut = isoDay(new Date(Date.parse(`${f.checkIn}T00:00:00Z`) + DAY));
        }
        out.nights = out.checkIn ? Math.round((Date.parse(out.checkOut) - Date.parse(out.checkIn)) / DAY) : 0;
        return out;
    }

    async search(query) {
        const ctx = await this.context();
        const { filters: raw, interpretedBy } = await this.parse(query, ctx);
        const f = this.normalize(raw);
        const division = ctx.divisions.find((d) => d.name === f.divisionName);
        const keyword = (f.keywords || "").toLowerCase().trim();
        const guests = f.adults + f.children;

        const candidates = ctx.hotels
            .filter((h) => !division || String(h.divisionId) === String(division.serialId))
            .filter((h) => !keyword || `${h.name} ${h.location}`.toLowerCase().includes(keyword))
            .map((h) => {
                const hotelAmenities = new Set(h.amenities || []);
                const rooms = h.rooms
                    .filter((r) => (!f.maxPrice || r.price <= f.maxPrice) && (!f.minPrice || r.price >= f.minPrice))
                    .filter((r) => f.rooms <= (r.roomQty || 0) && (r.capacity + r.child) * f.rooms >= guests)
                    .filter((r) => f.amenities.every((a) => hotelAmenities.has(a) || (r.amenities || []).includes(a)))
                    .sort((a, b) => a.price - b.price);
                return { hotel: h, rooms };
            })
            .filter((c) => c.rooms.length);

        // With dates, keep only room types that are actually free for the whole stay.
        if (f.checkIn) {
            for (const c of candidates) {
                const free = [];
                for (const r of c.rooms) {
                    const a = await this.bookings.checkAvailability({ roomId: r.id, checkIn: f.checkIn, checkOut: f.checkOut, quantity: f.rooms });
                    if (a.available) free.push(r);
                }
                c.rooms = free;
            }
        }

        const results = candidates
            .filter((c) => c.rooms.length)
            .sort((a, b) => a.rooms[0].price - b.rooms[0].price)
            .slice(0, MAX_RESULTS)
            .map(({ hotel, rooms }) => {
                const best = rooms[0];
                return {
                    id: hotel.id,
                    name: hotel.name,
                    location: hotel.location,
                    image: hotel.image,
                    amenities: hotel.amenities,
                    matchingRoomTypes: rooms.length,
                    availabilityChecked: Boolean(f.checkIn),
                    bestRoom: {
                        id: best.id,
                        type: best.type,
                        price: best.price,
                        sleeps: (best.capacity + best.child) * f.rooms,
                        total: f.nights ? best.price * f.rooms * f.nights : null,
                    },
                };
            });

        return { query, interpretedBy, filters: f, results };
    }
}

module.exports = AssistantService;
