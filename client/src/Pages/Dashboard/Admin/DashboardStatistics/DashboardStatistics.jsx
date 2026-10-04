import { useMemo } from "react";
import { Link } from "react-router-dom";
import { format, isAfter, isBefore, addDays, startOfDay, subMonths, startOfMonth } from "date-fns";
import { LuArrowRight, LuBuilding2, LuCalendarCheck, LuImages, LuInbox, LuRefreshCw, LuUsers, LuWallet } from "react-icons/lu";
import { useGetBookingsQuery } from "../../../../redux/Feature/Admin/booking/bookingApi";
import { useGetUserQuery } from "../../../../redux/Feature/auth/authApi";
import { useAppSelector } from "../../../../redux/Hook/Hook";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import { useAllHotels } from "../../../../utils/useAllHotels";
import { BarList, ColumnChart, StackedBar } from "../../../../components/charts/Charts";
import StatusPill, { STATUS } from "../../../../components/ui/StatusPill";
import { formatTaka, pluralize } from "../../../../utils/format";

const compactTaka = (v) => (v >= 1000 ? `৳${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `৳${v}`);
const isPaid = (b) => b.paymentStatus === "paid";

const Kpi = ({ icon: Icon, label, value, sub, loading }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-ink-500">{label}</p>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-[18px] w-[18px]" />
      </span>
    </div>
    {loading ? <div className="skeleton mt-3 h-8 w-24 rounded-lg" /> : <p className="mt-2 text-3xl font-extrabold tabular-nums tracking-tight text-ink-950">{value}</p>}
    {sub && <p className="mt-1 text-xs text-ink-500">{sub}</p>}
  </div>
);

const Panel = ({ title, subtitle, action, children, className = "" }) => (
  <section className={`card p-6 ${className}`}>
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-bold text-ink-950">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const DashboardStatistics = () => {
  const user = useAppSelector(useCurrentUser);
  const { data: bookingData, isLoading, isError, refetch } = useGetBookingsQuery();
  const { data: userData } = useGetUserQuery();
  const { hotels, isLoading: hotelsLoading } = useAllHotels();

  const stats = useMemo(() => {
    const bookings = bookingData?.data || [];
    const hotelName = new Map(hotels.map((h) => [h.id, h.name]));
    const hotelOf = (b) => hotelName.get(b.rooms?.[0]?.hotelId) || "Unknown hotel";
    const paid = bookings.filter(isPaid);
    const today = startOfDay(new Date());

    // Revenue from paid bookings over the last 6 months (by booking date).
    const months = Array.from({ length: 6 }, (_, i) => startOfMonth(subMonths(today, 5 - i)));
    const revenue = months.map((m) => {
      const inMonth = paid.filter((b) => format(new Date(b.createdAt), "yyyy-MM") === format(m, "yyyy-MM"));
      return {
        label: format(m, "MMM"),
        value: inMonth.reduce((s, b) => s + (b.totalPrice || 0), 0),
        hint: pluralize(inMonth.length, "paid booking"),
      };
    });

    const byHotel = paid.reduce((acc, b) => {
      const name = hotelOf(b);
      acc[name] = acc[name] || { value: 0, count: 0 };
      acc[name].value += b.totalPrice || 0;
      acc[name].count += 1;
      return acc;
    }, {});

    return {
      total: bookings.length,
      revenue: paid.reduce((s, b) => s + (b.totalPrice || 0), 0),
      paidCount: paid.length,
      status: ["confirmed", "pending", "cancelled"].map((key) => ({
        label: STATUS[key].label,
        value: bookings.filter((b) => (b.status || "pending") === key).length,
        color: STATUS[key].color,
        icon: STATUS[key].icon,
      })),
      monthly: revenue,
      topHotels: Object.entries(byHotel)
        .map(([label, v]) => ({ label, value: v.value, hint: pluralize(v.count, "paid booking") }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      upcoming: bookings
        .filter((b) => b.status !== "cancelled" && !isBefore(new Date(b.checkIn), today) && isBefore(new Date(b.checkIn), addDays(today, 14)))
        .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
        .slice(0, 5)
        .map((b) => ({ ...b, hotel: hotelOf(b) })),
      recent: [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map((b) => ({ ...b, hotel: hotelOf(b) })),
      checkedInToday: bookings.filter((b) => b.status === "confirmed" && !isAfter(new Date(b.checkIn), today) && isAfter(new Date(b.checkOut), today)).length,
    };
  }, [bookingData, hotels]);

  const guests = (userData?.data || []).filter((u) => u.role === "user").length;
  const roomUnits = hotels.reduce((s, h) => s + (h.rooms || []).reduce((x, r) => x + (r.roomQty || 0), 0), 0);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  if (isError) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-lg font-bold text-ink-950">Couldn&apos;t load dashboard data</p>
        <button onClick={refetch} className="btn-primary">
          <LuRefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">{format(new Date(), "EEEE, d MMMM")}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-950">
            {greeting}, {user?.name?.split(" ")[0] || "admin"}
          </h1>
          <p className="mt-1 text-ink-500">Here&apos;s how bookings are going across your hotels.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/bookings" className="btn-ghost">
            All bookings
          </Link>
          <Link to="/admin/add-hotel" className="btn-brand">
            Add hotel
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi icon={LuWallet} label="Revenue (paid)" value={formatTaka(stats.revenue)} sub={`from ${pluralize(stats.paidCount, "paid booking")}`} loading={isLoading} />
        <Kpi icon={LuCalendarCheck} label="Bookings" value={stats.total} sub={stats.total ? `${Math.round((stats.paidCount / stats.total) * 100)}% paid` : "No bookings yet"} loading={isLoading} />
        <Kpi icon={LuBuilding2} label="Hotels" value={hotels.length} sub={`${pluralize(roomUnits, "room")} in total`} loading={hotelsLoading} />
        <Kpi icon={LuUsers} label="Guest accounts" value={guests} sub={`${pluralize(stats.checkedInToday, "stay")} in progress today`} loading={isLoading} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Revenue" subtitle="Paid bookings, last 6 months">
          {isLoading ? <div className="skeleton h-[220px] rounded-2xl" /> : <ColumnChart data={stats.monthly} format={compactTaka} caption="Revenue from paid bookings per month" />}
        </Panel>
        <Panel title="Booking status" subtitle={`${pluralize(stats.total, "booking")} in total`}>
          {isLoading ? <div className="skeleton h-24 rounded-2xl" /> : <StackedBar segments={stats.status} caption="Bookings by status" />}
          <div className="mt-6 rounded-2xl bg-brand-50/70 p-4 text-sm text-brand-900">
            Unpaid checkouts hold rooms for 30 minutes, then stop blocking availability.
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Top hotels" subtitle="By paid revenue">
          {stats.topHotels.length ? (
            <BarList items={stats.topHotels} format={formatTaka} caption="Revenue per hotel" />
          ) : (
            <p className="text-sm text-ink-500">No paid bookings yet.</p>
          )}
        </Panel>

        <Panel title="Upcoming check-ins" subtitle="Next 14 days">
          {stats.upcoming.length ? (
            <ul className="space-y-3">
              {stats.upcoming.map((b) => (
                <li key={b.id} className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink-50 text-center leading-none">
                    <span className="text-[10px] font-bold uppercase text-brand-600">{format(new Date(b.checkIn), "MMM")}</span>
                    <span className="text-lg font-extrabold text-ink-950">{format(new Date(b.checkIn), "d")}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{b.name}</p>
                    <p className="truncate text-xs text-ink-500">{b.hotel}</p>
                  </div>
                  <StatusPill status={b.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-500">No check-ins in the next two weeks.</p>
          )}
        </Panel>

        <Panel
          title="Recent bookings"
          action={
            <Link to="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              View all <LuArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {stats.recent.length ? (
            <ul className="divide-y divide-ink-100">
              {stats.recent.map((b) => (
                <li key={b.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-100 text-sm font-bold text-ink-700">
                    {(b.name || "?").charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{b.name}</p>
                    <p className="truncate text-xs text-ink-500">
                      {b.hotel} · {format(new Date(b.createdAt), "d MMM")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-ink-950">{formatTaka(b.totalPrice)}</p>
                    <StatusPill status={b.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-500">No bookings yet.</p>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { to: "/admin/hotels", icon: LuBuilding2, title: "Manage hotels", text: `${pluralize(hotels.length, "hotel")}, ${pluralize(hotels.reduce((s, h) => s + (h.rooms?.length || 0), 0), "room type")}` },
          { to: "/admin/messages", icon: LuInbox, title: "Guest messages", text: "Questions sent from the contact page" },
          { to: "/admin/sliders", icon: LuImages, title: "Homepage offers", text: "Update the offer banners on the home page" },
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
      </div>
    </div>
  );
};

export default DashboardStatistics;
