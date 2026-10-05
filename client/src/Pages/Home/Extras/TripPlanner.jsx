import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuCalculator } from "react-icons/lu";
import { useAllHotels } from "../../../utils/useAllHotels";
import Stepper from "../../../components/ui/Stepper";
import SelectField from "../../../components/ui/SelectField";
import { formatTaka, pluralize } from "../../../utils/format";
import SectionHeader from "../SectionHeader";

// Interactive budget estimate from real room prices: hotel × room type × rooms × nights.
const TripPlanner = () => {
  const { hotels, isLoading } = useAllHotels();
  const bookable = useMemo(() => hotels.filter((h) => h.rooms?.length), [hotels]);

  const [hotelId, setHotelId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [nights, setNights] = useState(2);
  const [rooms, setRooms] = useState(1);

  const hotel = bookable.find((h) => h.id === hotelId) || bookable[0];
  const room = hotel?.rooms.find((r) => r.id === roomId) || hotel?.rooms[0];

  // Reset the room choice when the hotel changes.
  useEffect(() => setRoomId(""), [hotelId]);
  useEffect(() => setRooms((n) => Math.min(n, room?.roomQty || 1)), [room]);

  if (!isLoading && !bookable.length) return null;

  const total = room ? room.price * nights * rooms : 0;
  const guests = room ? (room.capacity + room.child) * rooms : 0;

  return (
    <section className="container-x pt-20 sm:pt-28">
      <SectionHeader eyebrow="home.planEyebrow" title="home.planTitle" subtitle="home.planSubtitle" />
      <div className="mt-10 grid overflow-hidden rounded-4xl border border-ink-100 bg-white shadow-soft lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6 p-6 sm:p-8">
          {isLoading ? (
            <div className="space-y-4">
              <div className="skeleton h-12 rounded-2xl" />
              <div className="skeleton h-12 rounded-2xl" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">Hotel</span>
                  <SelectField
                    showSearch
                    ariaLabel="Hotel"
                    value={hotel?.id}
                    onChange={setHotelId}
                    options={bookable.map((h) => ({ value: h.id, label: h.name, hint: h.fromPrice ? `from ${formatTaka(h.fromPrice)}` : "" }))}
                  />
                </div>
                <div>
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">Room type</span>
                  <SelectField
                    ariaLabel="Room type"
                    value={room?.id}
                    onChange={setRoomId}
                    options={(hotel?.rooms || []).map((r) => ({ value: r.id, label: r.type, hint: `${formatTaka(r.price)}/night` }))}
                  />
                </div>
              </div>
              <div className="grid gap-4 rounded-3xl bg-ink-50 p-5 sm:grid-cols-2">
                <Stepper label="Nights" value={nights} onDecrement={() => setNights((n) => n - 1)} onIncrement={() => setNights((n) => n + 1)} decDisabled={nights <= 1} incDisabled={nights >= 30} />
                <Stepper label="Rooms" value={rooms} onDecrement={() => setRooms((n) => n - 1)} onIncrement={() => setRooms((n) => n + 1)} decDisabled={rooms <= 1} incDisabled={rooms >= (room?.roomQty || 1)} />
              </div>
            </>
          )}
        </div>

        <div className="relative isolate flex flex-col justify-between gap-6 overflow-hidden bg-ink-950 p-6 text-white sm:p-8">
          <div className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-600/50 blur-3xl" />
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
              <LuCalculator className="h-4 w-4" /> Estimated total
            </p>
            <p className="mt-3 text-5xl font-extrabold tabular-nums tracking-tight" aria-live="polite">
              {formatTaka(total)}
            </p>
            {room && (
              <p className="mt-2 text-sm text-ink-300">
                {formatTaka(room.price)} × {pluralize(rooms, "room")} × {pluralize(nights, "night")} · sleeps up to {guests}
              </p>
            )}
          </div>
          {hotel && (
            <Link to={`/hotel-details/${hotel.id}`} className="btn w-full bg-white py-3.5 text-ink-950 hover:bg-ink-100">
              Check availability <LuArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
