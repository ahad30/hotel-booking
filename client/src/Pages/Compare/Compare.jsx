import { Link } from "react-router-dom";
import { LuArrowRight, LuCheck, LuGitCompareArrows, LuMinus, LuX } from "react-icons/lu";
import { useCompare } from "../../utils/localCollections";
import { useAllHotels } from "../../utils/useAllHotels";
import SmartImage from "../../components/ui/SmartImage";
import { getAmenityIcon } from "../../components/ui/amenities";
import { formatTaka } from "../../utils/format";

const priceRange = (rooms = []) => {
  const prices = rooms.map((r) => r.price).filter(Boolean);
  if (!prices.length) return "—";
  const [lo, hi] = [Math.min(...prices), Math.max(...prices)];
  return lo === hi ? formatTaka(lo) : `${formatTaka(lo)} – ${formatTaka(hi)}`;
};

const maxGuests = (rooms = []) => (rooms.length ? Math.max(...rooms.map((r) => (r.capacity || 0) + (r.child || 0))) : "—");
const totalRooms = (rooms = []) => rooms.reduce((s, r) => s + (r.roomQty || 0), 0) || "—";

const Compare = () => {
  const compare = useCompare();
  const { byId, isLoading } = useAllHotels();
  const hotels = compare.ids.map((id) => byId.get(id)).filter(Boolean);

  // The cheapest "from" price is highlighted when two or more hotels have one.
  const priced = hotels.filter((h) => h.fromPrice);
  const cheapestId = priced.length > 1 ? priced.reduce((a, b) => (a.fromPrice <= b.fromPrice ? a : b)).id : null;
  const amenities = [...new Set(hotels.flatMap((h) => h.amenities || []))].sort((a, b) => a.localeCompare(b));

  const rows = [
    { label: "Location", render: (h) => h.location },
    { label: "From / night", render: (h) => (h.fromPrice ? formatTaka(h.fromPrice) : "—"), highlight: true },
    { label: "Room prices", render: (h) => priceRange(h.rooms) },
    { label: "Room types", render: (h) => h.rooms?.map((r) => r.type).join(", ") || "—" },
    { label: "Rooms in total", render: (h) => totalRooms(h.rooms) },
    { label: "Most guests per room", render: (h) => maxGuests(h.rooms) },
  ];

  return (
    <div className="pb-28 lg:pb-16">
      <div className="border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
        <div className="container-x py-10 sm:py-12">
          <p className="eyebrow">Compare</p>
          <h1 className="heading-xl mt-2">Compare hotels side by side</h1>
          <p className="mt-2 text-ink-500">Prices, rooms and amenities at a glance. Add hotels with the compare button on any hotel card.</p>
        </div>
      </div>

      <div className="container-x mt-10">
        {isLoading ? (
          <div className="skeleton h-96 rounded-3xl" />
        ) : hotels.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <LuGitCompareArrows className="h-7 w-7" />
            </span>
            <p className="text-lg font-bold text-ink-900">Nothing to compare yet</p>
            <p className="max-w-sm text-sm text-ink-500">Tap the compare icon on up to three hotels, then come back here.</p>
            <Link to="/hotels" className="btn-primary mt-2">
              Browse hotels <LuArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[480px] table-fixed border-collapse text-left text-sm sm:min-w-[640px]">
              <caption className="sr-only">Hotel comparison</caption>
              {/* Equal hotel columns regardless of image or text length. */}
              <colgroup>
                <col className="w-28 sm:w-48" />
                {hotels.map((h) => (
                  <col key={h.id} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-10 bg-white p-3 align-bottom text-xs font-bold uppercase tracking-wider text-ink-400 sm:p-5">
                    {hotels.length < 2 && <span className="normal-case tracking-normal text-ink-500">Add one more hotel to compare.</span>}
                  </th>
                  {hotels.map((h) => (
                    <th key={h.id} scope="col" className="p-3 align-top font-normal sm:p-5">
                      <div className="relative">
                        <SmartImage src={h.image} alt={h.name} className="aspect-[4/3] rounded-2xl" />
                        <button
                          onClick={() => compare.remove(h.id)}
                          aria-label={`Remove ${h.name}`}
                          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-700 shadow-soft hover:bg-white"
                        >
                          <LuX className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-3 text-base font-bold text-ink-950">{h.name}</p>
                      <Link to={`/hotel-details/${h.id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
                        View rooms <LuArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-ink-100">
                    <th scope="row" className="sticky left-0 z-10 bg-white p-3 text-[10px] font-bold uppercase tracking-wider text-ink-400 sm:p-5 sm:text-xs">
                      {row.label}
                    </th>
                    {hotels.map((h) => (
                      <td key={h.id} className="p-3 font-medium text-ink-800 sm:p-5">
                        <span className={row.highlight && h.id === cheapestId ? "rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 ring-1 ring-emerald-100" : ""}>
                          {row.render(h)}
                        </span>
                        {row.highlight && h.id === cheapestId && <span className="ml-2 text-xs font-semibold text-emerald-700">Best price</span>}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-ink-100 bg-ink-50/60">
                  <th scope="row" colSpan={hotels.length + 1} className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">
                    Amenities
                  </th>
                </tr>
                {amenities.map((a) => {
                  const Icon = getAmenityIcon(a);
                  return (
                    <tr key={a} className="border-t border-ink-100">
                      <th scope="row" className="sticky left-0 z-10 bg-white p-3 font-medium text-ink-700 sm:p-4 sm:pl-5">
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-brand-600" /> {a}
                        </span>
                      </th>
                      {hotels.map((h) => (
                        <td key={h.id} className="p-3 sm:p-4 sm:pl-5">
                          {h.amenities?.includes(a) ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700">
                              <LuCheck className="h-4 w-4" /> <span className="text-xs font-semibold">Yes</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-ink-300">
                              <LuMinus className="h-4 w-4" /> <span className="text-xs font-semibold">No</span>
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
