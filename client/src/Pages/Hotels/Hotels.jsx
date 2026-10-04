import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LuSearch, LuSearchX, LuSlidersHorizontal, LuX } from "react-icons/lu";
import { useAllHotels } from "../../utils/useAllHotels";
import { useGetDivisionsQuery } from "../../redux/Feature/User/place/placeApi";
import HotelCard, { HotelCardSkeleton } from "../../components/ui/HotelCard";
import Modal from "../../components/ui/Modal";
import SelectField from "../../components/ui/SelectField";
import PriceRange from "./PriceRange";
import { getAmenityIcon } from "../../components/ui/amenities";
import { formatTaka, pluralize } from "../../utils/format";

const SORTS = {
  recommended: { label: "Recommended", fn: () => 0 },
  "price-asc": { label: "Price: low to high", fn: (a, b) => (a.fromPrice ?? Infinity) - (b.fromPrice ?? Infinity) },
  "price-desc": { label: "Price: high to low", fn: (a, b) => (b.fromPrice ?? -1) - (a.fromPrice ?? -1) },
  rooms: { label: "Most room types", fn: (a, b) => (b.rooms?.length || 0) - (a.rooms?.length || 0) },
  name: { label: "Name (A–Z)", fn: (a, b) => a.name.localeCompare(b.name) },
};

// Filters live in the URL, so a filtered view can be shared or bookmarked.
const useFilters = () => {
  const [params, setParams] = useSearchParams();
  const get = (k) => params.get(k) || "";
  const filters = {
    q: get("q"),
    division: get("division"),
    sort: SORTS[get("sort")] ? get("sort") : "recommended",
    min: params.get("min") ? Number(params.get("min")) : null,
    max: params.get("max") ? Number(params.get("max")) : null,
    amenities: params.getAll("amenity"),
  };
  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => {
      next.delete(k);
      if (Array.isArray(v)) v.forEach((x) => next.append(k, x));
      else if (v !== null && v !== "" && v !== undefined) next.set(k, v);
    });
    // preventScrollReset: changing a filter must not jump the page back to the top.
    setParams(next, { replace: true, preventScrollReset: true });
  };
  return { filters, update, reset: () => setParams({}, { replace: true, preventScrollReset: true }) };
};

const FilterPanel = ({ filters, update, divisions, amenityOptions, priceBounds }) => {
  const [lo, hi] = priceBounds;

  const toggleAmenity = (a) =>
    update({ amenity: filters.amenities.includes(a) ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a] });

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold text-ink-950">Division</h3>
        <div className="mt-3">
          <SelectField
            showSearch
            ariaLabel="Division"
            value={filters.division}
            onChange={(v) => update({ division: v })}
            options={[{ value: "", label: "All divisions" }, ...divisions.map((d) => ({ value: String(d.serialId), label: d.name, hint: d.bn_name }))]}
          />
        </div>
      </div>

      {hi > lo && (
        <div>
          <PriceRange bounds={priceBounds} value={[filters.min, filters.max]} onCommit={update} />
        </div>
      )}

      {amenityOptions.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-ink-950">Amenities</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {amenityOptions.map((a) => {
              const Icon = getAmenityIcon(a);
              const on = filters.amenities.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    on ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-brand-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {a}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Hotels = () => {
  const { hotels, isLoading, isError, refetch } = useAllHotels();
  const { data: divisionData } = useGetDivisionsQuery();
  const divisions = divisionData?.data || [];
  const { filters, update, reset } = useFilters();
  const [sheetOpen, setSheetOpen] = useState(false);

  const amenityOptions = useMemo(
    () => [...new Set(hotels.flatMap((h) => h.amenities || []))].sort((a, b) => a.localeCompare(b)),
    [hotels]
  );

  const priceBounds = useMemo(() => {
    const prices = hotels.map((h) => h.fromPrice).filter(Boolean);
    return prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0];
  }, [hotels]);

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return hotels
      .filter((h) => !q || h.name.toLowerCase().includes(q) || h.location?.toLowerCase().includes(q))
      .filter((h) => !filters.division || String(h.divisionId) === filters.division)
      .filter((h) => filters.amenities.every((a) => h.amenities?.includes(a)))
      .filter((h) => (filters.min === null && filters.max === null) || (h.fromPrice !== null && h.fromPrice >= (filters.min ?? 0) && h.fromPrice <= (filters.max ?? Infinity)))
      .sort(SORTS[filters.sort].fn);
  }, [hotels, filters]);

  const activeCount =
    (filters.division ? 1 : 0) + filters.amenities.length + (filters.min !== null || filters.max !== null ? 1 : 0);
  const panel = <FilterPanel filters={filters} update={update} divisions={divisions} amenityOptions={amenityOptions} priceBounds={priceBounds} />;

  return (
    <div className="pb-28 lg:pb-16">
      <div className="border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
        <div className="container-x py-10 sm:py-12">
          <p className="eyebrow">Explore</p>
          <h1 className="heading-xl mt-2">Find your hotel</h1>
          <p className="mt-2 text-ink-500">Filter by price, amenities and location. Results update as you go.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Hotel name or location"
                aria-label="Search hotels"
                className="w-full rounded-full border border-ink-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
            </label>
            <div className="sm:w-56">
              <SelectField
                ariaLabel="Sort hotels"
                value={filters.sort}
                onChange={(v) => update({ sort: v === "recommended" ? "" : v })}
                options={Object.entries(SORTS).map(([k, { label }]) => ({ value: k, label }))}
              />
            </div>
            <button onClick={() => setSheetOpen(true)} className="btn-ghost justify-center py-3.5 lg:hidden">
              <LuSlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>
        </div>
      </div>

      <div className="container-x mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-ink-950">Filters</h2>
              {activeCount > 0 && (
                <button onClick={() => update({ division: "", amenity: [], min: null, max: null })} className="text-xs font-semibold text-brand-700 hover:underline">
                  Clear
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <section aria-live="polite">
          <p className="mb-5 text-sm font-semibold text-ink-500">
            {isLoading ? "Loading hotels…" : `${pluralize(results.length, "hotel")} found`}
          </p>

          {filters.amenities.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {filters.amenities.map((a) => (
                <button
                  key={a}
                  onClick={() => update({ amenity: filters.amenities.filter((x) => x !== a) })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800 ring-1 ring-brand-100"
                >
                  {a} <LuX className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          )}

          {isError ? (
            <div className="card px-6 py-14 text-center">
              <p className="font-bold text-ink-900">We couldn&apos;t load hotels.</p>
              <button onClick={refetch} className="btn-primary mt-4">
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <LuSearchX className="h-7 w-7" />
              </span>
              <p className="text-lg font-bold text-ink-900">No hotels match these filters</p>
              <p className="max-w-sm text-sm text-ink-500">Try a wider price range or fewer amenities.</p>
              <button onClick={reset} className="btn-primary mt-2">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
              {results.map((h, i) => (
                <HotelCard key={h.id} hotel={h} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        size="md"
        footer={
          <div className="flex gap-3">
            <button onClick={() => update({ division: "", amenity: [], min: null, max: null })} className="btn-ghost flex-1">
              Clear
            </button>
            <button onClick={() => setSheetOpen(false)} className="btn-primary flex-1">
              Show {pluralize(results.length, "hotel")}
            </button>
          </div>
        }
      >
        {panel}
      </Modal>
    </div>
  );
};

export default Hotels;
