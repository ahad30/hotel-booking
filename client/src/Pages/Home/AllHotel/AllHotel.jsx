import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LuLayoutGrid, LuList, LuRefreshCw, LuSearchX, LuX } from "react-icons/lu";
import { useGetHotelsBySearchQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";
import { useGetDistrictsByDivisionQuery, useGetDivisionsQuery } from "../../../redux/Feature/User/place/placeApi";
import HotelCard, { HotelCardSkeleton } from "../../../components/ui/HotelCard";
import SectionHeader from "../SectionHeader";
import { pluralize } from "../../../utils/format";

const VIEW_KEY = "behb:hotel-view";

const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
};

const FilterChip = ({ label, onClear }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-1 text-sm font-semibold text-brand-800 ring-1 ring-brand-100">
    {label}
    <button onClick={onClear} aria-label={`Remove ${label}`} className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-brand-100">
      <LuX className="h-3.5 w-3.5" />
    </button>
  </span>
);

const AllHotel = () => {
  const { searchQuery, setSearchQuery, divisionId, cityId, setFilters } = useOutletContext();
  const [view, setView] = useState(readView);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
  }, [view]);

  const { data, isFetching, isError, refetch } = useGetHotelsBySearchQuery({ name: searchQuery, divisionId, cityId });
  const { data: divisions } = useGetDivisionsQuery();
  const { data: districts } = useGetDistrictsByDivisionQuery(divisionId, { skip: !divisionId });

  const hotels = data?.data || [];
  const hasFilters = Boolean(searchQuery || divisionId || cityId);
  const divisionName = divisions?.data?.find((d) => String(d.serialId) === String(divisionId))?.name;
  const districtName = districts?.data?.find((d) => String(d.serialId) === String(cityId))?.name;

  const clearAll = () => {
    setSearchQuery("");
    setFilters("", "");
  };

  return (
    <section id="hotels" className="container-x scroll-mt-24 pt-20 sm:pt-28">
      <SectionHeader
        eyebrow="Stays"
        title={hasFilters ? "Hotels matching your search" : "Handpicked hotels for you"}
        subtitle={isFetching ? "Finding hotels…" : `${pluralize(hotels.length, "hotel")} available to book`}
        action={
          <div className="flex shrink-0 rounded-full bg-ink-100 p-1" role="group" aria-label="Layout">
            {[
              { id: "grid", Icon: LuLayoutGrid, label: "Grid view" },
              { id: "list", Icon: LuList, label: "List view" },
            ].map(({ id, Icon, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                aria-label={label}
                aria-pressed={view === id}
                className={`grid h-9 w-11 place-items-center rounded-full transition ${
                  view === id ? "bg-white text-ink-950 shadow-soft" : "text-ink-500 hover:text-ink-800"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        }
      />

      {hasFilters && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {searchQuery && <FilterChip label={`“${searchQuery}”`} onClear={() => setSearchQuery("")} />}
          {divisionId && <FilterChip label={divisionName || "Division"} onClear={() => setFilters("", "")} />}
          {cityId && <FilterChip label={districtName || "District"} onClear={() => setFilters(divisionId, "")} />}
          <button onClick={clearAll} className="ml-1 text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-900 hover:underline">
            Clear all
          </button>
        </div>
      )}

      <div className={`mt-8 ${view === "grid" ? "grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3" : "flex flex-col gap-5"}`}>
        {isFetching
          ? Array.from({ length: 6 }).map((_, i) => <HotelCardSkeleton key={i} layout={view} />)
          : hotels.map((hotel, i) => <HotelCard key={hotel.id} hotel={hotel} layout={view} index={i} />)}
      </div>

      {!isFetching && isError && (
        <div className="card mt-4 flex flex-col items-center gap-4 px-6 py-14 text-center">
          <p className="text-lg font-bold text-ink-900">We couldn&apos;t load hotels.</p>
          <button onClick={refetch} className="btn-primary">
            <LuRefreshCw className="h-4 w-4" /> Try again
          </button>
        </div>
      )}

      {!isFetching && !isError && hotels.length === 0 && (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <LuSearchX className="h-7 w-7" />
          </span>
          <p className="text-lg font-bold text-ink-900">No hotels match your search</p>
          <p className="max-w-sm text-sm text-ink-500">Try another name, or widen the area by removing a filter.</p>
          {hasFilters && (
            <button onClick={clearAll} className="btn-primary mt-2">
              Clear filters
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default AllHotel;
