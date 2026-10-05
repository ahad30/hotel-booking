import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { differenceInCalendarDays, format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  LuArrowRight,
  LuBell,
  LuBellOff,
  LuCalendarCheck,
  LuCalendarX,
  LuCheck,
  LuCheckCheck,
  LuGift,
  LuInfo,
  LuLoaderCircle,
  LuRefreshCw,
  LuStar,
} from "react-icons/lu";
import {
  useGetUserNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "../../redux/Feature/Admin/notification/notificationApi";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useAppSelector } from "../../redux/Hook/Hook";

const TYPES = {
  BOOKING_CONFIRMATION: { label: "Booking", icon: LuCalendarCheck, tile: "bg-emerald-50 text-emerald-600", to: "/user/user-booking" },
  BOOKING_CANCELLATION: { label: "Cancellation", icon: LuCalendarX, tile: "bg-rose-50 text-rose-600", to: "/user/user-booking" },
  ORDER_UPDATE: { label: "Update", icon: LuInfo, tile: "bg-sky-50 text-sky-600" },
  PROMOTION: { label: "Offer", icon: LuGift, tile: "bg-amber-50 text-amber-600", to: "/hotels" },
  REVIEW_REMINDER: { label: "Review", icon: LuStar, tile: "bg-violet-50 text-violet-600" },
  GENERAL: { label: "General", icon: LuInfo, tile: "bg-ink-100 text-ink-600" },
};
const typeOf = (t) => TYPES[t] || TYPES.GENERAL;

const FILTERS = [
  { id: "all", label: "All", match: () => true },
  { id: "unread", label: "Unread", match: (n) => !n.isRead },
  { id: "bookings", label: "Bookings", match: (n) => n.type?.startsWith("BOOKING") },
  { id: "offers", label: "Offers", match: (n) => n.type === "PROMOTION" },
];

// Today / Yesterday / This week / weekday-less month-day groups, newest first.
const groupLabel = (date) => {
  const days = differenceInCalendarDays(new Date(), date);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "This week";
  return format(date, "MMMM yyyy");
};

const NotificationItem = ({ item, onOpen, onRead, busy }) => {
  const t = typeOf(item.type);
  const Icon = t.icon;
  const date = new Date(item.createdAt);
  const opensSomewhere = Boolean(item.link || t.to);

  return (
    <li
      className={`group relative flex gap-3 rounded-3xl border p-4 transition sm:gap-4 sm:p-5 ${
        item.isRead ? "border-ink-100 bg-white" : "border-brand-100 bg-brand-50/50"
      }`}
    >
      {!item.isRead && <span className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-600 sm:left-2.5" aria-hidden="true" />}
      <span className={`ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-2xl sm:h-12 sm:w-12 ${t.tile}`}>
        <Icon className="h-5 w-5" />
      </span>

      <button
        type="button"
        onClick={() => onOpen(item)}
        className="min-w-0 flex-1 text-left outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-brand-400"
        aria-label={`${item.isRead ? "" : "Unread: "}${item.title}`}
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={`text-[15px] text-ink-950 ${item.isRead ? "font-semibold" : "font-bold"}`}>{item.title}</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-500 ring-1 ring-ink-100">{t.label}</span>
        </div>
        <p className="mt-1 break-words text-sm leading-relaxed text-ink-600">{item.message}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
          <time dateTime={item.createdAt} title={format(date, "PPpp")}>
            {formatDistanceToNow(date, { addSuffix: true })}
          </time>
          {item.bookingId && <span className="font-medium text-ink-500">Booking #{item.bookingId.slice(-6).toUpperCase()}</span>}
          {opensSomewhere && (
            <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
              View <LuArrowRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </button>

      {!item.isRead && (
        <button
          type="button"
          onClick={() => onRead(item)}
          disabled={busy}
          aria-label={`Mark "${item.title}" as read`}
          title="Mark as read"
          className="grid h-9 w-9 shrink-0 place-items-center self-start rounded-full bg-white text-ink-500 ring-1 ring-ink-100 transition hover:bg-brand-600 hover:text-white disabled:opacity-50"
        >
          {busy ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : <LuCheck className="h-4 w-4" />}
        </button>
      )}
    </li>
  );
};

const Notification = () => {
  const navigate = useNavigate();
  const user = useAppSelector(useCurrentUser);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const { data, isLoading, isError, refetch, isFetching } = useGetUserNotificationsQuery(user?.id, {
    skip: !user?.id,
    pollingInterval: 30000,
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAll, { isLoading: markingAll }] = useMarkAllNotificationsAsReadMutation();

  const all = useMemo(() => data?.data || [], [data]);
  const unread = all.filter((n) => !n.isRead).length;
  const active = FILTERS.find((f) => f.id === filter);

  const groups = useMemo(() => {
    const out = [];
    all.filter(active.match).forEach((n) => {
      const label = groupLabel(new Date(n.createdAt));
      const last = out[out.length - 1];
      if (last?.label === label) last.items.push(n);
      else out.push({ label, items: [n] });
    });
    return out;
  }, [all, active]);

  const read = async (item) => {
    setBusyId(item.id);
    try {
      await markAsRead(item.id).unwrap();
    } catch {
      toast.error("Couldn't update the notification.");
    } finally {
      setBusyId(null);
    }
  };

  const open = async (item) => {
    if (!item.isRead) read(item);
    const to = item.link || typeOf(item.type).to;
    if (to) navigate(to);
  };

  const readAll = async () => {
    try {
      await markAll(user.id).unwrap();
      toast.success("All caught up.");
    } catch {
      toast.error("Couldn't mark notifications as read.");
    }
  };

  return (
    <div className="pb-28 lg:pb-16">
      <div className="border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
        <div className="container-x flex max-w-3xl flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-12">
          <div>
            <p className="eyebrow">Inbox</p>
            <h1 className="heading-xl mt-2 flex items-center gap-3">
              Notifications
              {unread > 0 && <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-sm font-bold text-white">{unread} new</span>}
            </h1>
            <p className="mt-2 text-ink-500">Booking updates, offers and messages from BEHB.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={refetch} disabled={isFetching} className="btn-ghost px-3.5" aria-label="Refresh notifications" title="Refresh">
              <LuRefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            {unread > 0 ? (
              <button onClick={readAll} disabled={markingAll} className="btn-primary">
                {markingAll ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : <LuCheckCheck className="h-4 w-4" />}
                Mark all as read
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <LuCheckCheck className="h-4 w-4" /> All caught up
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container-x mt-6 max-w-3xl">
        <div className="grid grid-cols-4 gap-1 rounded-full bg-white p-1 shadow-soft ring-1 ring-ink-100 sm:inline-grid" role="tablist" aria-label="Filter notifications">
          {FILTERS.map((f) => {
            const count = all.filter(f.match).length;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center justify-center gap-1.5 rounded-full px-2 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                  filter === f.id ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-ink-50"
                }`}
              >
                {f.label}
                <span className={`hidden rounded-full px-1.5 text-[11px] sm:inline ${filter === f.id ? "bg-white/20" : "bg-ink-100"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6" aria-live="polite">
          {isError ? (
            <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
              <p className="font-bold text-ink-950">Couldn&apos;t load your notifications.</p>
              <button onClick={refetch} className="btn-primary">
                <LuRefreshCw className="h-4 w-4" /> Try again
              </button>
            </div>
          ) : isLoading ? (
            <ul className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex gap-4 rounded-3xl border border-ink-100 bg-white p-5">
                  <div className="skeleton h-12 w-12 shrink-0 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-1/2 rounded-lg" />
                    <div className="skeleton h-4 w-full rounded-lg" />
                    <div className="skeleton h-3 w-1/4 rounded-lg" />
                  </div>
                </li>
              ))}
            </ul>
          ) : groups.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                {filter === "unread" ? <LuCheckCheck className="h-7 w-7" /> : all.length ? <LuBellOff className="h-7 w-7" /> : <LuBell className="h-7 w-7" />}
              </span>
              <p className="text-lg font-bold text-ink-900">
                {filter === "unread" ? "You're all caught up" : all.length ? `No ${active.label.toLowerCase()} notifications` : "No notifications yet"}
              </p>
              <p className="max-w-sm text-sm text-ink-500">
                {all.length ? "New updates will show up here." : "Booking confirmations and offers will appear here once you start booking."}
              </p>
              {!all.length && (
                <Link to="/hotels" className="btn-primary mt-2">
                  Find a hotel <LuArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {groups.map((g) => (
                <section key={g.label} aria-label={g.label}>
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-ink-400">{g.label}</h2>
                  <ul className="space-y-3">
                    {g.items.map((n) => (
                      <NotificationItem key={n.id} item={n} onOpen={open} onRead={read} busy={busyId === n.id} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
