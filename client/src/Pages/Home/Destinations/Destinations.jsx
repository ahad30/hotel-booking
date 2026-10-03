import { Link } from "react-router-dom";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { useGetDivisionsQuery } from "../../../redux/Feature/User/place/placeApi";
import SectionHeader from "../SectionHeader";
import { divisionImage, divisionTagline } from "../divisionImages";

// Bento grid order: Dhaka leads with the large tile, then Chattogram.
const featured = ["dhaka", "chattagram", "chittagong"];

export const DivisionTile = ({ division, large = false, wide = false }) => {
  const img = divisionImage(division.name);
  return (
    <Link
      to={`/district/${division.serialId}`}
      className={`group relative isolate flex overflow-hidden rounded-3xl bg-ink-800 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift ${
        large ? "sm:col-span-2 sm:row-span-2" : wide ? "sm:col-span-2" : ""
      }`}
    >
      {img && (
        <img
          src={img}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
      <div className="mt-auto flex w-full items-end justify-between gap-3 p-5 sm:p-6">
        <div>
          <p className="text-xs font-medium text-white/70">{divisionTagline(division.name)}</p>
          <h3 className={`font-extrabold text-white ${large ? "text-3xl sm:text-4xl" : "text-xl"}`}>{division.name}</h3>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-white group-hover:text-ink-950">
          <LuArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
};

const Destinations = () => {
  const { data, isLoading } = useGetDivisionsQuery();
  const rank = (d) => {
    const i = featured.indexOf(d.name.toLowerCase());
    return i === -1 ? featured.length : i;
  };
  const divisions = [...(data?.data || [])].sort((a, b) => rank(a) - rank(b));

  return (
    <section className="container-x pt-20 sm:pt-28">
      <SectionHeader
        eyebrow="Destinations"
        title="Explore Bangladesh by division"
        subtitle="Pick a division, narrow it down to a district and area, and see every hotel there."
        action={
          <Link to="/division" className="btn-ghost shrink-0">
            All destinations <LuArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mt-10 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`skeleton rounded-3xl ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`} />
            ))
          : divisions.map((d, i) => (
              <DivisionTile
                key={d.id}
                division={d}
                large={i === 0}
                // Fill the last row when the small tiles don't divide evenly.
                wide={i === divisions.length - 1 && (divisions.length - 1) % 2 === 1}
              />
            ))}
      </div>
    </section>
  );
};

export default Destinations;
