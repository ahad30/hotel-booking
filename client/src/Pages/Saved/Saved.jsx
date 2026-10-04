import { Link } from "react-router-dom";
import { LuArrowRight, LuHeart } from "react-icons/lu";
import { useSaved } from "../../utils/localCollections";
import { useAllHotels } from "../../utils/useAllHotels";
import HotelCard, { HotelCardSkeleton } from "../../components/ui/HotelCard";
import { pluralize } from "../../utils/format";

// Hotels saved with the heart button, kept on this device.
const Saved = () => {
  const saved = useSaved();
  const { byId, isLoading } = useAllHotels();
  const hotels = saved.ids.map((id) => byId.get(id)).filter(Boolean);

  return (
    <div className="pb-28 lg:pb-16">
      <div className="border-b border-ink-100 bg-gradient-to-b from-rose-50/70 to-white">
        <div className="container-x flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:py-12">
          <div>
            <p className="eyebrow !text-rose-600">Saved</p>
            <h1 className="heading-xl mt-2">Your saved hotels</h1>
            <p className="mt-2 text-ink-500">
              {isLoading ? "Loading…" : hotels.length ? `${pluralize(hotels.length, "hotel")} saved on this device.` : "Tap the heart on any hotel to keep it here."}
            </p>
          </div>
          {hotels.length > 0 && (
            <button onClick={saved.clear} className="btn-ghost w-fit">
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="container-x mt-10">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <LuHeart className="h-7 w-7" />
            </span>
            <p className="text-lg font-bold text-ink-900">No saved hotels yet</p>
            <p className="max-w-sm text-sm text-ink-500">Save hotels you like and compare them later.</p>
            <Link to="/hotels" className="btn-primary mt-2">
              Browse hotels <LuArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {hotels.map((h, i) => (
              <HotelCard key={h.id} hotel={h} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
