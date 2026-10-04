import { memo } from "react";
import { Link } from "react-router-dom";
import { LuArrowUpRight, LuBedDouble, LuMapPin } from "react-icons/lu";
import SmartImage from "./SmartImage";
import HotelActions from "./HotelActions";
import { AmenityChip } from "./amenities";
import { formatTaka, lowestRoomPrice, pluralize } from "../../utils/format";

const PriceTag = ({ price }) =>
  price ? (
    <p className="text-sm text-ink-500">
      from <span className="text-lg font-extrabold text-ink-950">{formatTaka(price)}</span>
      <span className="text-xs"> / night</span>
    </p>
  ) : (
    <p className="text-sm font-medium text-ink-400">Rooms coming soon</p>
  );

const HotelCard = ({ hotel, layout = "grid", index = 0 }) => {
  const price = lowestRoomPrice(hotel?.rooms);
  const roomCount = hotel?.rooms?.length || 0;
  const amenities = hotel?.amenities || [];
  const to = `/hotel-details/${hotel?.id}`;

  // Save/compare buttons sit beside the link (not inside it) so the markup stays valid.
  if (layout === "list") {
    return (
      <div className="group relative">
      <Link
        to={to}
        className="flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:flex-row"
      >
        <SmartImage
          src={hotel?.image}
          alt={hotel?.name}
          className="aspect-[16/10] sm:aspect-auto sm:w-72 sm:shrink-0"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div>
            <h3 className="text-xl font-bold text-ink-950 transition-colors group-hover:text-brand-700">{hotel?.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
              <LuMapPin className="h-4 w-4 shrink-0 text-brand-500" />
              <span className="line-clamp-1">{hotel?.location}</span>
            </p>
          </div>
          {hotel?.description && <p className="line-clamp-2 text-sm text-ink-600">{hotel.description}</p>}
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((a) => (
              <AmenityChip key={a} name={a} />
            ))}
            {amenities.length > 4 && <span className="chip">+{amenities.length - 4}</span>}
          </div>
          <div className="mt-auto flex items-end justify-between gap-4 pt-2">
            <PriceTag price={price} />
            <span className="btn-primary px-5 py-2.5">
              View rooms <LuArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
      <div className="absolute left-3 top-3">
        <HotelActions hotel={hotel} />
      </div>
      </div>
    );
  }

  return (
    <div className="group relative flex animate-fade-up flex-col" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
    <Link
      to={to}
      className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lift"
    >
      <div className="relative">
        <SmartImage
          src={hotel?.image}
          alt={hotel?.name}
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950/50 to-transparent" />
        {roomCount > 0 && (
          <span className="absolute left-3 top-3 hidden items-center gap-1.5 rounded-full bg-white/90 sm:inline-flex px-3 py-1 text-xs font-semibold text-ink-800 shadow-soft backdrop-blur">
            <LuBedDouble className="h-3.5 w-3.5 text-brand-600" />
            {pluralize(roomCount, "room type")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="line-clamp-1 text-base font-bold text-ink-950 transition-colors group-hover:text-brand-700 sm:text-lg">
            {hotel?.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500 sm:text-sm">
            <LuMapPin className="h-3.5 w-3.5 shrink-0 text-brand-500" />
            <span className="line-clamp-1">{hotel?.location}</span>
          </p>
        </div>
        <div className="hidden flex-wrap gap-1.5 sm:flex">
          {amenities.slice(0, 3).map((a) => (
            <AmenityChip key={a} name={a} />
          ))}
          {amenities.length > 3 && <span className="chip">+{amenities.length - 3}</span>}
        </div>
        <div className="mt-auto border-t border-ink-100 pt-3">
          <PriceTag price={price} />
        </div>
      </div>
    </Link>
    <div className="absolute right-3 top-3 transition duration-300 group-hover:-translate-y-1">
      <HotelActions hotel={hotel} />
    </div>
    </div>
  );
};

export const HotelCardSkeleton = ({ layout = "grid" }) =>
  layout === "list" ? (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white sm:flex-row">
      <div className="skeleton aspect-[16/10] sm:aspect-auto sm:h-56 sm:w-72" />
      <div className="flex-1 space-y-3 p-6">
        <div className="skeleton h-6 w-1/2 rounded-lg" />
        <div className="skeleton h-4 w-1/3 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  ) : (
    <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="hidden gap-2 sm:flex">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="skeleton h-5 w-1/3 rounded-lg" />
      </div>
    </div>
  );

export default memo(HotelCard);
