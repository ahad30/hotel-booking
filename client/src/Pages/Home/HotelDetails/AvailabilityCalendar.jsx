import { useMemo, useState } from "react";
import { addDays, format, isAfter, isBefore, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { LuCalendarDays, LuInfo } from "react-icons/lu";
import { useGetHotelAvailabilityQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";
import { pluralize } from "../../../utils/format";

const DAYS_SHOWN = 56;

// Sequential single-hue scale (brand violet): darker = more rooms free.
// Text switches to white on the two darkest steps so numbers stay legible.
const STEPS = [
  { max: 0.25, label: "Few", bg: "#ede9fe", text: "#2e1065" },
  { max: 0.5, label: "Some", bg: "#ddd6fe", text: "#2e1065" },
  { max: 0.75, label: "Many", bg: "#c4b5fd", text: "#2e1065" },
  { max: 0.99, label: "Most", bg: "#8b5cf6", text: "#ffffff" },
  { max: 1, label: "All free", bg: "#6d28d9", text: "#ffffff" },
];
const FULL = { label: "Full", bg: "#eceef2", text: "#8592a6" };

const stepFor = (free, total) => {
  if (!total || free <= 0) return FULL;
  const ratio = free / total;
  return STEPS.find((s) => ratio <= s.max) || STEPS[STEPS.length - 1];
};

// Calendar heatmap of free rooms per night. Tap a check-in date, then a
// check-out date, to set the stay.
const AvailabilityCalendar = ({ hotelId, checkIn, checkOut, onSelect }) => {
  const today = startOfDay(new Date());
  const from = format(today, "yyyy-MM-dd");
  const { data, isLoading, isError } = useGetHotelAvailabilityQuery({ hotelId, from, days: DAYS_SHOWN }, { skip: !hotelId });
  const [roomFilter, setRoomFilter] = useState("all");
  const [pendingStart, setPendingStart] = useState(null);
  const [hover, setHover] = useState(null);

  const cal = data?.data;
  const rooms = cal?.rooms || [];
  const shownRooms = roomFilter === "all" ? rooms : rooms.filter((r) => r.id === roomFilter);
  const total = shownRooms.reduce((s, r) => s + (r.roomQty || 0), 0);

  const byDate = useMemo(() => {
    const map = new Map();
    (cal?.nights || []).forEach((n) => map.set(n.date, n.free));
    return map;
  }, [cal]);

  // Whole weeks from the start of this week, so the grid lines up under the weekday headings.
  const gridStart = startOfWeek(today);
  const cells = Array.from({ length: Math.ceil((DAYS_SHOWN + today.getDay()) / 7) * 7 }, (_, i) => addDays(gridStart, i));

  const freeOn = (date) => {
    const free = byDate.get(format(date, "yyyy-MM-dd"));
    if (!free) return null;
    return shownRooms.reduce((s, r) => s + (free[r.id] ?? 0), 0);
  };

  const pick = (date) => {
    if (!pendingStart || !isAfter(date, pendingStart)) {
      setPendingStart(date);
      return;
    }
    onSelect(pendingStart, date);
    setPendingStart(null);
  };

  const inStay = (date) => !pendingStart && checkIn && checkOut && !isBefore(date, checkIn) && isBefore(date, checkOut);
  const isEdge = (date) => (pendingStart ? isSameDay(date, pendingStart) : (checkIn && isSameDay(date, checkIn)) || (checkOut && isSameDay(date, checkOut)));

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="calendar-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="calendar-title" className="flex items-center gap-2 font-bold text-ink-950">
            <LuCalendarDays className="h-5 w-5 text-brand-600" /> Availability calendar
          </h3>
          <p className="mt-0.5 text-sm text-ink-500">
            {pendingStart ? `Check-in ${format(pendingStart, "EEE d MMM")} — now pick your check-out date` : "Tap a check-in date, then a check-out date."}
          </p>
        </div>
        {rooms.length > 1 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Room type">
            {[{ id: "all", type: "All rooms" }, ...rooms].map((r) => (
              <button
                key={r.id}
                onClick={() => setRoomFilter(r.id)}
                aria-pressed={roomFilter === r.id}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  roomFilter === r.id ? "bg-ink-950 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {r.type}
              </button>
            ))}
          </div>
        )}
      </div>

      {isError ? (
        <p className="mt-5 flex items-center gap-2 text-sm text-ink-500">
          <LuInfo className="h-4 w-4" /> Couldn&apos;t load availability right now.
        </p>
      ) : isLoading ? (
        <div className="skeleton mt-5 h-72 rounded-2xl" />
      ) : (
        <>
          <div className="relative mt-5">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-ink-500 sm:gap-2" aria-hidden="true">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
              {cells.map((date) => {
                const free = freeOn(date);
                const past = isBefore(date, today);
                const outOfRange = free === null;
                const step = outOfRange ? null : stepFor(free, total);
                const firstOfMonth = date.getDate() === 1;
                const label = outOfRange
                  ? format(date, "EEE d MMM")
                  : `${format(date, "EEE d MMM")}: ${free === 0 ? "fully booked" : `${free} of ${total} rooms free`}`;

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={past || outOfRange}
                    onClick={() => pick(date)}
                    onMouseEnter={() => setHover({ date, free })}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({ date, free })}
                    onBlur={() => setHover(null)}
                    aria-label={label}
                    aria-pressed={Boolean(isEdge(date))}
                    className={`relative flex aspect-square flex-col sm:aspect-auto sm:h-14 lg:h-16 items-center justify-center rounded-xl text-sm font-bold tabular-nums transition disabled:cursor-default ${
                      isEdge(date) ? "ring-2 ring-ink-950 ring-offset-2" : inStay(date) ? "ring-2 ring-brand-300" : ""
                    } ${past || outOfRange ? "text-ink-300" : "hover:scale-105 focus-visible:scale-105"}`}
                    style={
                      step
                        ? {
                            background:
                              step === FULL
                                ? `repeating-linear-gradient(45deg, ${FULL.bg}, ${FULL.bg} 4px, #f6f7f9 4px, #f6f7f9 8px)`
                                : step.bg,
                            color: step.text,
                          }
                        : undefined
                    }
                  >
                    {firstOfMonth && <span className="text-[9px] font-bold uppercase leading-none opacity-80">{format(date, "MMM")}</span>}
                    {date.getDate()}
                    {step === FULL && !past && <span className="text-[8px] font-bold uppercase leading-none">Full</span>}
                  </button>
                );
              })}
            </div>
            {hover && hover.free !== null && hover.free !== undefined && (
              <div className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-xl bg-ink-950 px-3 py-2 text-xs text-white shadow-lift" role="presentation">
                <p className="font-bold">{format(hover.date, "EEEE d MMMM")}</p>
                <p className="text-ink-300">{hover.free === 0 ? "Fully booked" : `${pluralize(hover.free, "room")} of ${total} free`}</p>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500" aria-label="Legend">
            <span className="font-semibold text-ink-700">Rooms free:</span>
            {[FULL, ...STEPS].map((s) => (
              <span key={s.label} className="inline-flex items-center gap-1.5">
                <span
                  className="h-3.5 w-3.5 rounded"
                  style={{
                    background: s === FULL ? `repeating-linear-gradient(45deg, ${FULL.bg}, ${FULL.bg} 2px, #f6f7f9 2px, #f6f7f9 4px)` : s.bg,
                    boxShadow: "inset 0 0 0 1px rgba(16,24,40,.08)",
                  }}
                />
                {s.label}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default AvailabilityCalendar;
