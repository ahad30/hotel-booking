// Deterministic parser for trip requests. Used when Claude is not configured,
// errors, or declines, so the assistant always returns something useful.

const AMENITY_WORDS = [
    [/\b(pool|swimming)\b/, "Swimming Pool"],
    [/\b(wi-?fi|internet)\b/, "Free WiFi"],
    [/\b(gym|fitness)\b/, "Gym"],
    [/\bspa\b/, "Spa"],
    [/\bparking|car park\b/, "Parking"],
    [/\b(restaurant|dining)\b/, "Restaurant"],
    [/\b(ac|a\/c|air[- ]?condition(ed|ing)?)\b/, "Air Conditioning"],
    [/\bbalcony\b/, "Balcony"],
    [/\b(tv|television)\b/, "TV"],
    [/\bmini ?bar\b/, "Mini Bar"],
    [/\bsafe\b/, "Safe"],
];

const DIVISION_ALIASES = {
    chittagong: "Chattagram",
    chattogram: "Chattagram",
    ctg: "Chattagram",
    barishal: "Barisal",
    dhaka: "Dhaka",
};

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const toNumber = (raw, k) => Math.round(Number(String(raw).replace(/,/g, "")) * (k ? 1000 : 1));
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));

// Bangladesh's weekend is Friday and Saturday.
const nextFriday = (today, skipThisWeek) => {
    const day = today.getUTCDay(); // 0 Sun ... 5 Fri
    let diff = (5 - day + 7) % 7;
    if (skipThisWeek) diff += 7;
    return addDays(today, diff);
};

const parseExplicitDate = (text, today) => {
    // 2026-10-12
    const isoMatch = text.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
    if (isoMatch) return new Date(Date.UTC(+isoMatch[1], +isoMatch[2] - 1, +isoMatch[3]));
    // 12 oct / oct 12 / 12th october
    const m =
        text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/) ||
        text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?\b/);
    if (!m) return null;
    const [day, mon] = /\d/.test(m[1]) ? [+m[1], m[2]] : [+m[2], m[1]];
    let date = new Date(Date.UTC(today.getUTCFullYear(), MONTHS.indexOf(mon), day));
    if (date < today) date = new Date(Date.UTC(today.getUTCFullYear() + 1, MONTHS.indexOf(mon), day));
    return date;
};

const ruleParse = (query, { divisions = [], today = new Date() }) => {
    const text = query.toLowerCase();
    const base = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const out = {
        divisionName: "",
        keywords: "",
        minPrice: 0,
        maxPrice: 0,
        adults: 0,
        children: 0,
        rooms: 0,
        amenities: [],
        checkIn: "",
        checkOut: "",
        summary: "",
    };

    for (const d of divisions) {
        if (text.includes(d.name.toLowerCase())) out.divisionName = d.name;
    }
    for (const [alias, name] of Object.entries(DIVISION_ALIASES)) {
        if (new RegExp(`\\b${alias}\\b`).test(text) && divisions.some((d) => d.name === name)) out.divisionName = name;
    }

    const between = text.match(/between\s*(?:৳|tk|bdt)?\s*([\d,.]+)\s*(k)?\s*(?:and|-|to)\s*(?:৳|tk|bdt)?\s*([\d,.]+)\s*(k)?/);
    if (between) {
        out.minPrice = toNumber(between[1], between[2]);
        out.maxPrice = toNumber(between[3], between[4]);
    } else {
        const max = text.match(/(?:under|below|less than|max(?:imum)?|up ?to|within|budget(?: of)?|cheaper than)\s*(?:৳|tk|bdt)?\s*([\d,.]+)\s*(k)?/);
        if (max) out.maxPrice = toNumber(max[1], max[2]);
        const min = text.match(/(?:over|above|more than|at least|min(?:imum)?)\s*(?:৳|tk|bdt)?\s*([\d,.]+)\s*(k)?/);
        if (min) out.minPrice = toNumber(min[1], min[2]);
    }

    const adults = text.match(/(\d+)\s*(?:adults?|people|persons?|guests?|pax)/);
    const kids = text.match(/(\d+|a|one)\s*(?:kids?|children|child|baby|babies)/);
    if (adults) out.adults = +adults[1];
    if (kids) out.children = /\d/.test(kids[1]) ? +kids[1] : 1;
    if (!adults && /\bcouple\b|\bhoneymoon\b|\bmy (wife|husband|partner)\b/.test(text)) out.adults = 2;
    const family = text.match(/family of\s*(\d+)/);
    if (family && !adults) {
        out.adults = Math.min(2, +family[1]);
        out.children = Math.max(0, +family[1] - 2);
    }
    if (!out.adults && /\bsolo\b|\bjust me\b|\balone\b/.test(text)) out.adults = 1;
    const rooms = text.match(/(\d+)\s*rooms?\b/);
    if (rooms) out.rooms = +rooms[1];

    out.amenities = AMENITY_WORDS.filter(([re]) => re.test(text)).map(([, name]) => name);

    let checkIn = null;
    let nights = 0;
    const nightsMatch = text.match(/(\d+)\s*nights?/);
    if (nightsMatch) nights = +nightsMatch[1];
    if (/\b(tonight|today)\b/.test(text)) checkIn = base;
    else if (/\btomorrow\b/.test(text)) checkIn = addDays(base, 1);
    else if (/\bnext weekend\b/.test(text)) checkIn = nextFriday(base, true);
    else if (/\b(this )?weekend\b/.test(text)) checkIn = nextFriday(base, false);
    else checkIn = parseExplicitDate(text, base);
    if (checkIn) {
        if (!nights) nights = /\bweekend\b/.test(text) ? 2 : 1;
        out.checkIn = iso(checkIn);
        out.checkOut = iso(addDays(checkIn, nights));
    }

    // Leftover hotel-name style words, e.g. "radisson".
    const named = text.match(/\b(?:at|the)\s+([a-z][a-z ]{2,30}?)\s+(?:hotel|resort|inn)\b/);
    if (named) out.keywords = named[1].trim();

    return out;
};

module.exports = { ruleParse };
