import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import { useAllHotels } from "../../../utils/useAllHotels";
import { getAmenityIcon } from "../../../components/ui/amenities";
import { pluralize } from "../../../utils/format";
import SectionHeader from "../SectionHeader";

// Each tile opens the hotel explorer pre-filtered to that amenity.
const AmenityBrowse = () => {
  const { hotels, isLoading } = useAllHotels();

  const counts = hotels.reduce((acc, h) => {
    (h.amenities || []).forEach((a) => (acc[a] = (acc[a] || 0) + 1));
    return acc;
  }, {});
  const amenities = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  if (!isLoading && amenities.length === 0) return null;

  return (
    <section className="container-x pt-20 sm:pt-28">
      <SectionHeader
        eyebrow="Amenities"
        title="What matters on your trip?"
        subtitle="Pick what you can't do without and we'll show the hotels that have it."
        action={
          <Link to="/hotels" className="btn-ghost shrink-0">
            All filters <LuArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)
          : amenities.map(([name, count]) => {
              const Icon = getAmenityIcon(name);
              return (
                <Link
                  key={name}
                  to={`/hotels?amenity=${encodeURIComponent(name)}`}
                  className="group flex flex-col justify-between gap-6 rounded-3xl border border-ink-100 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-gradient group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-ink-950">{name}</span>
                    <span className="text-xs text-ink-500">{pluralize(count, "hotel")}</span>
                  </span>
                </Link>
              );
            })}
      </div>
    </section>
  );
};

export default AmenityBrowse;
