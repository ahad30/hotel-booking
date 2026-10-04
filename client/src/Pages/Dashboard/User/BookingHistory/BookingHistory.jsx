import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { differenceInCalendarDays, format, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import { LuArrowRight, LuCalendarX, LuDownload, LuEye, LuLoaderCircle, LuReceipt } from "react-icons/lu";
import { useAppSelector } from "../../../../redux/Hook/Hook";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import { useGetUserBookingsQuery } from "../../../../redux/Feature/Admin/booking/bookingApi";
import { useAllHotels } from "../../../../utils/useAllHotels";
import SmartImage from "../../../../components/ui/SmartImage";
import StatusPill from "../../../../components/ui/StatusPill";
import Modal from "../../../../components/ui/Modal";
import { formatTaka, pluralize } from "../../../../utils/format";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];

const PAYMENT = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-rose-50 text-rose-700",
};

// The PDF library is large, so it's only loaded when a receipt is requested.
const useReceipt = () => {
  const [busy, setBusy] = useState(null);
  const download = async (booking) => {
    setBusy(booking.id);
    try {
      const { downloadReceipt } = await import("./receipt");
      await downloadReceipt(booking, booking.hotel?.name);
    } catch {
      toast.error("Couldn't create the receipt. Please try again.");
    } finally {
      setBusy(null);
    }
  };
  return { busy, download };
};

const BookingHistory = () => {
  const user = useAppSelector(useCurrentUser);
  const { data, isLoading, isError, refetch } = useGetUserBookingsQuery(user?.id, { skip: !user?.id });
  const { byId } = useAllHotels();
  const [tab, setTab] = useState("upcoming");
  const [selected, setSelected] = useState(null);
  const receipt = useReceipt();

  const bookings = useMemo(() => {
    const today = startOfDay(new Date());
    return (data?.data || [])
      .map((b) => {
        const hotel = byId.get(b.rooms?.[0]?.hotelId);
        return {
          ...b,
          hotel,
          image: hotel?.image || b.rooms?.[0]?.images?.[0],
          nights: Math.max(1, differenceInCalendarDays(new Date(b.checkOut), new Date(b.checkIn))),
          isPast: isBefore(new Date(b.checkOut), today),
        };
      })
      .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
  }, [data, byId]);

  const groups = {
    upcoming: bookings.filter((b) => b.status !== "cancelled" && !b.isPast).reverse(),
    past: bookings.filter((b) => b.status !== "cancelled" && b.isPast),
    cancelled: bookings.filter((b) => b.status === "cancelled"),
    all: bookings,
  };
  const shown = groups[tab];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-950">My bookings</h1>
        <p className="mt-1 text-ink-500">Your stays, payment status and receipts in one place.</p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-soft ring-1 ring-ink-100 no-scrollbar sm:w-fit" role="tablist">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === id ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-ink-50"
            }`}
          >
            {label}
            <span className={`rounded-full px-1.5 text-[11px] ${tab === id ? "bg-white/20" : "bg-ink-100"}`}>{groups[id].length}</span>
          </button>
        ))}
      </div>

      {isError ? (
        <div className="card p-10 text-center">
          <p className="font-bold text-ink-950">Couldn&apos;t load your bookings.</p>
          <button onClick={refetch} className="btn-primary mt-4">
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-3xl" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <LuCalendarX className="h-7 w-7" />
          </span>
          <p className="text-lg font-bold text-ink-900">No {tab === "all" ? "" : `${TABS.find((t) => t.id === tab).label.toLowerCase()} `}bookings</p>
          <Link to="/hotels" className="btn-primary mt-2">
            Find a hotel <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {shown.map((b) => (
            <li key={b.id} className="card overflow-hidden transition hover:shadow-lift">
              <div className="flex flex-col sm:flex-row">
                <SmartImage src={b.image} alt={b.hotel?.name || "Hotel"} className="aspect-[16/9] sm:aspect-auto sm:w-56 sm:shrink-0" />
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-ink-950">{b.hotel?.name || "Hotel booking"}</h2>
                      <p className="mt-0.5 text-sm text-ink-500">
                        {format(new Date(b.checkIn), "EEE, d MMM")} → {format(new Date(b.checkOut), "EEE, d MMM yyyy")} · {pluralize(b.nights, "night")}
                      </p>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(b.bookingItem || []).map((item, i) => (
                      <span key={i} className="chip">
                        {item.roomType} × {item.quantity || 1}
                      </span>
                    ))}
                    <span className={`chip ${PAYMENT[b.paymentStatus] || ""}`}>Payment: {b.paymentStatus || "pending"}</span>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
                    <p className="text-lg font-extrabold tabular-nums text-ink-950">{formatTaka(b.totalPrice)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(b)} className="btn-ghost py-2">
                        <LuEye className="h-4 w-4" /> Details
                      </button>
                      <button onClick={() => receipt.download(b)} disabled={receipt.busy === b.id} className="btn-primary py-2">
                        {receipt.busy === b.id ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : <LuDownload className="h-4 w-4" />} Receipt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Booking details"
        size="lg"
        footer={
          selected && (
            <div className="flex flex-wrap justify-end gap-2">
              {selected.hotel && (
                <Link to={`/hotel-details/${selected.hotel.id}`} className="btn-ghost">
                  View hotel
                </Link>
              )}
              <button onClick={() => receipt.download(selected)} disabled={receipt.busy === selected.id} className="btn-brand">
                <LuReceipt className="h-4 w-4" /> Download receipt
              </button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-6 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-ink-950">{selected.hotel?.name || "Hotel booking"}</p>
                <p className="text-ink-500">{selected.hotel?.location}</p>
              </div>
              <StatusPill status={selected.status} />
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Check-in", format(new Date(selected.checkIn), "EEE, d MMM yyyy")],
                ["Check-out", format(new Date(selected.checkOut), "EEE, d MMM yyyy")],
                ["Nights", selected.nights],
                ["Guest", selected.name],
                ["Phone", selected.phone],
                ["Payment", selected.paymentStatus || "pending"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-ink-50 p-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{k}</dt>
                  <dd className="mt-0.5 truncate font-semibold capitalize text-ink-900">{v || "—"}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="mb-2 font-bold text-ink-950">Rooms</h3>
              <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-100">
                {(selected.bookingItem || []).map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 p-3">
                    <div>
                      <p className="font-semibold text-ink-900">
                        {item.roomType} × {item.quantity || 1}
                      </p>
                      <p className="text-xs text-ink-500">
                        {pluralize(item.adults || 0, "adult")}, {pluralize(item.children || 0, "child", "children")} · {formatTaka(item.price)}/night
                      </p>
                    </div>
                    <p className="font-semibold tabular-nums text-ink-900">{formatTaka((item.price || 0) * (item.quantity || 1) * selected.nights)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between px-1">
                <p className="font-bold text-ink-950">Total</p>
                <p className="text-xl font-extrabold tabular-nums text-ink-950">{formatTaka(selected.totalPrice)}</p>
              </div>
            </div>
            {selected.transactionId && <p className="text-xs text-ink-400">Transaction ID: {selected.transactionId}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingHistory;
