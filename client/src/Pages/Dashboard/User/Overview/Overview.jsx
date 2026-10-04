import { useMemo } from "react";
import { Link } from "react-router-dom";
import { differenceInCalendarDays, format, isBefore, startOfDay } from "date-fns";
import { LuArrowRight, LuCalendarDays, LuCompass, LuHeart, LuMoon, LuPlane, LuWallet } from "react-icons/lu";
import { useAppSelector } from "../../../../redux/Hook/Hook";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import { useGetUserBookingsQuery } from "../../../../redux/Feature/Admin/booking/bookingApi";
import { useAllHotels } from "../../../../utils/useAllHotels";
import { useSaved } from "../../../../utils/localCollections";
import SmartImage from "../../../../components/ui/SmartImage";
import StatusPill from "../../../../components/ui/StatusPill";
import { formatTaka, pluralize } from "../../../../utils/format";

const nightsOf = (b) => Math.max(1, differenceInCalendarDays(new Date(b.checkOut), new Date(b.checkIn)));

const Overview = () => {
  const user = useAppSelector(useCurrentUser);
  const { data, isLoading } = useGetUserBookingsQuery(user?.id, { skip: !user?.id });
  const { byId } = useAllHotels();
  const saved = useSaved();

  const view = useMemo(() => {
    const today = startOfDay(new Date());
    const bookings = (data?.data || []).map((b) => {
      const hotel = byId.get(b.rooms?.[0]?.hotelId);
      return { ...b, hotel, image: hotel?.image || b.rooms?.[0]?.images?.[0], nights: nightsOf(b) };
    });
    const active = bookings.filter((b) => b.status !== "cancelled");
    const upcoming = active
      .filter((b) => !isBefore(new Date(b.checkOut), today))
      .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
    return {
      next: upcoming[0],
      trips: active.length,
      nights: active.reduce((s, b) => s + b.nights, 0),
      spent: bookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + (b.totalPrice || 0), 0),
      recent: [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    };
  }, [data, byId]);

  const daysAway = view.next ? differenceInCalendarDays(new Date(view.next.checkIn), startOfDay(new Date())) : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-700">Welcome back</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-950">Hi, {user?.name?.split(" ")[0] || "there"} 👋</h1>
      </div>

      {/* Next stay */}
      {isLoading ? (
        <div className="skeleton h-56 rounded-4xl" />
      ) : view.next ? (
        <div className="relative isolate grid overflow-hidden rounded-4xl bg-ink-950 text-white shadow-lift md:grid-cols-[1fr_1.2fr]">
          <SmartImage src={view.next.image} alt={view.next.hotel?.name || "Your hotel"} className="min-h-[200px]" />
          <div className="relative p-6 sm:p-8">
            <div className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-600/40 blur-3xl" />
            <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
              {daysAway <= 0 ? "Your stay is in progress" : daysAway === 1 ? "Your next stay is tomorrow" : `Your next stay · in ${daysAway} days`}
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">{view.next.hotel?.name || "Your hotel"}</h2>
            <p className="mt-1 text-sm text-ink-300">{view.next.hotel?.location}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              {[
                { label: "Check-in", value: format(new Date(view.next.checkIn), "EEE, d MMM") },
                { label: "Check-out", value: format(new Date(view.next.checkOut), "EEE, d MMM") },
                { label: "Stay", value: pluralize(view.next.nights, "night") },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl bg-white/10 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{label}</p>
                  <p className="mt-0.5 font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <StatusPill status={view.next.status} />
              <Link to="/user/user-booking" className="inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline">
                Booking details <LuArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative isolate overflow-hidden rounded-4xl bg-ink-950 p-8 text-white">
          <div className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-600/40 blur-3xl" />
          <LuPlane className="h-8 w-8 text-cyan-300" />
          <h2 className="mt-4 text-2xl font-extrabold">No upcoming stays</h2>
          <p className="mt-1 max-w-md text-ink-300">Find a hotel for your next trip. Availability is checked live for your dates.</p>
          <Link to="/hotels" className="btn mt-5 bg-white px-6 py-3 text-sm text-ink-950 hover:bg-ink-100">
            Find a hotel <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: LuCalendarDays, label: "Trips booked", value: view.trips },
          { icon: LuMoon, label: "Nights booked", value: view.nights },
          { icon: LuWallet, label: "Total paid", value: formatTaka(view.spent) },
          { icon: LuHeart, label: "Saved hotels", value: saved.ids.length, to: "/saved" },
        ].map(({ icon: Icon, label, value, to }) => {
          const body = (
            <>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              {isLoading ? <div className="skeleton mt-4 h-7 w-16 rounded-lg" /> : <p className="mt-4 text-2xl font-extrabold tabular-nums text-ink-950">{value}</p>}
              <p className="text-sm text-ink-500">{label}</p>
            </>
          );
          return to ? (
            <Link key={label} to={to} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
              {body}
            </Link>
          ) : (
            <div key={label} className="card p-5">
              {body}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink-950">Recent bookings</h2>
            <Link to="/user/user-booking" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              View all <LuArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-2xl" />
              ))}
            </div>
          ) : view.recent.length ? (
            <ul className="divide-y divide-ink-100">
              {view.recent.map((b) => (
                <li key={b.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <SmartImage src={b.image} alt="" className="h-12 w-12 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{b.hotel?.name || "Hotel booking"}</p>
                    <p className="text-xs text-ink-500">
                      {format(new Date(b.checkIn), "d MMM")} – {format(new Date(b.checkOut), "d MMM yyyy")} · {pluralize(b.nights, "night")}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-bold tabular-nums text-ink-950">{formatTaka(b.totalPrice)}</p>
                  </div>
                  <StatusPill status={b.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-500">You haven&apos;t booked anything yet.</p>
          )}
        </section>

        <section className="space-y-3">
          {[
            { to: "/hotels", icon: LuCompass, title: "Find a hotel", text: "Filter by price, amenities and location" },
            { to: "/saved", icon: LuHeart, title: "Saved hotels", text: "Hotels you've hearted" },
            { to: "/compare", icon: LuCalendarDays, title: "Compare hotels", text: "Prices and amenities side by side" },
          ].map(({ to, icon: Icon, title, text }) => (
            <Link key={to} to={to} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink-950 text-white transition group-hover:bg-brand-gradient">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink-950">{title}</p>
                <p className="truncate text-sm text-ink-500">{text}</p>
              </div>
              <LuArrowRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Overview;
