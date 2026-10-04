import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuCalculator } from "react-icons/lu";
import { useAllHotels } from "../../../utils/useAllHotels";
import Stepper from "../../../components/ui/Stepper";
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
  const selectClass =
    "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

  return (
    <section className="container-x pt-20 sm:pt-28">
      <SectionHeader eyebrow="Plan" title="Estimate your stay in seconds" subtitle="Pick a hotel and room, adjust nights and rooms, and see the total before you book." />
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
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">Hotel</span>
                  <select value={hotel?.id || ""} onChange={(e) => setHotelId(e.target.value)} className={selectClass}>
                    {bookable.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">Room type</span>
                  <select value={room?.id || ""} onChange={(e) => setRoomId(e.target.value)} className={selectClass}>
                    {hotel?.rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.type} · {formatTaka(r.price)}/night
                      </option>
                    ))}
                  </select>
                </label>
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
