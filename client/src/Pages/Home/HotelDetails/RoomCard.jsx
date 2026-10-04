import { memo } from "react";
import { LuBaby, LuCheck, LuLoaderCircle, LuUsers } from "react-icons/lu";
import SmartImage from "../../../components/ui/SmartImage";
import Stepper from "../../../components/ui/Stepper";
import { AmenityChip } from "../../../components/ui/amenities";
import { formatTaka } from "../../../utils/format";

const RoomCard = ({
  room,
  selected,
  checking,
  quantity,
  adults,
  childCount,
  onQuantity,
  onAdults,
  onChildren,
  onToggle,
  onDetails,
}) => {
  // Guests allowed across every room of this type, as in the original booking rules.
  const guestCap = (room?.capacity + room?.child) * room?.roomQty;
  const guestsFull = guestCap <= adults + childCount;

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-white transition duration-300 ${
        selected ? "border-brand-500 shadow-glow ring-1 ring-brand-500" : "border-ink-100 shadow-soft hover:shadow-lift"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        <button onClick={onDetails} className="group relative md:w-72 md:shrink-0" aria-label={`View ${room.type} room photos`}>
          <SmartImage
            src={room.images?.[0]}
            alt={`${room.type} room`}
            className="aspect-[16/10] h-full w-full md:aspect-auto"
            imgClassName="transition-transform duration-700 group-hover:scale-105"
          />
          {room.images?.length > 1 && (
            <span className="absolute bottom-3 left-3 rounded-full bg-ink-950/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              {room.images.length} photos
            </span>
          )}
          {selected && (
            <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white shadow-glow">
              <LuCheck className="h-4 w-4" />
            </span>
          )}
          {!room.isAvailable && (
            <span className="absolute inset-0 grid place-items-center bg-ink-950/60 text-sm font-bold text-white">Not available</span>
          )}
        </button>

        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-ink-950">{room.type}</h3>
                {room.isAvailable && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                    Available
                  </span>
                )}
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                <span className="flex items-center gap-1.5">
                  <LuUsers className="h-4 w-4" /> {room.capacity} adults
                </span>
                <span className="flex items-center gap-1.5">
                  <LuBaby className="h-4 w-4" /> {room.child} children
                </span>
                <span>{room.roomQty} rooms of this type</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-ink-950">{formatTaka(room.price)}</p>
              <p className="text-xs text-ink-500">per room / night</p>
            </div>
          </div>

          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 5).map((a) => (
                <AmenityChip key={a} name={a} />
              ))}
              {room.amenities.length > 5 && <span className="chip">+{room.amenities.length - 5} more</span>}
            </div>
          )}

          <div className="mt-auto flex flex-col gap-4 border-t border-ink-100 pt-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <Stepper
                label="Rooms"
                value={quantity}
                onDecrement={() => onQuantity(quantity - 1)}
                onIncrement={() => onQuantity(quantity + 1)}
                decDisabled={quantity <= 1 || selected}
                incDisabled={quantity >= room?.roomQty || selected}
              />
              <Stepper
                label="Adults"
                value={adults}
                onDecrement={() => onAdults(adults - 1)}
                onIncrement={() => onAdults(adults + 1)}
                decDisabled={adults <= 1 || selected}
                incDisabled={guestsFull || selected}
              />
              <Stepper
                label="Children"
                value={childCount}
                onDecrement={() => onChildren(childCount - 1)}
                onIncrement={() => onChildren(childCount + 1)}
                decDisabled={childCount <= 0 || selected}
                incDisabled={guestsFull || selected}
              />
            </div>

            <div className="flex gap-2 sm:justify-end">
              <button onClick={onDetails} className="btn-ghost flex-1 sm:flex-none">
                Details
              </button>
              <button
                onClick={onToggle}
                disabled={!room.isAvailable || checking}
                className={`btn flex-1 px-6 py-3 text-sm sm:flex-none ${
                  selected
                    ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    : "bg-ink-950 text-white shadow-lift hover:bg-brand-700"
                }`}
              >
                {checking ? (
                  <>
                    <LuLoaderCircle className="h-4 w-4 animate-spin" /> Checking…
                  </>
                ) : selected ? (
                  "Remove"
                ) : (
                  "Select room"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(RoomCard);
