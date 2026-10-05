import { useRecentlyViewed } from "../../../utils/localCollections";
import { useAllHotels } from "../../../utils/useAllHotels";
import HotelCard from "../../../components/ui/HotelCard";
import SectionHeader from "../SectionHeader";

// Hotels this visitor opened recently (stored on their device). Hidden until there are any.
const RecentlyViewed = () => {
  const recent = useRecentlyViewed();
  const { byId } = useAllHotels();
  const hotels = recent.ids.map((id) => byId.get(id)).filter(Boolean).slice(0, 4);

  if (!hotels.length) return null;

  return (
    <section className="container-x pt-20 sm:pt-28">
      <SectionHeader
        eyebrow="home.recentEyebrow"
        title="home.recentTitle"
        action={
          <button onClick={recent.clear} className="btn-ghost shrink-0">
            Clear history
          </button>
        }
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {hotels.map((h, i) => (
          <HotelCard key={h.id} hotel={h} index={i} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
