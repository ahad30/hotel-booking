import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { addDays, format, isAfter, startOfDay } from "date-fns";
import { toast } from "sonner";
import {
  LuArrowRight,
  LuBedDouble,
  LuCalendarDays,
  LuChevronRight,
  LuMapPin,
  LuMessageCircle,
  LuPhone,
  LuSearchX,
  LuShare2,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import { useGetRoomsByHotelIdQuery } from "../../../redux/Feature/Admin/room/roomApi";
import { useGetHotelByIdQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";
import { useCheckRoomAvailabilityBookingMutation } from "../../../redux/Feature/Admin/booking/bookingApi";
import { useAppDispatch } from "../../../redux/Hook/Hook";
import { setBookingDetails } from "../../../redux/Booking/bookingSlice";
import RoomGallery from "./RoomGallery";
import RoomCard from "./RoomCard";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { useI18n } from "../../../i18n/LanguageProvider";
import HotelActions from "../../../components/ui/HotelActions";
import { trackRecentlyViewed } from "../../../utils/localCollections";
import Modal from "../../../components/ui/Modal";
import { AmenityChip, getAmenityIcon } from "../../../components/ui/amenities";
import { formatTaka, lowestRoomPrice, pluralize } from "../../../utils/format";

const formatToUTC = (date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
const shortDate = (date) => format(date, "EEE, d MMM");

// No overflow-hidden here: the calendar popup must be able to extend past the box.
const DateRange = ({ checkIn, checkOut, onChange }) => (
  <div className="behb-datepicker grid grid-cols-2 rounded-2xl border border-ink-200">
    {[
      { label: "Check-in", selected: checkIn, isCheckIn: true, minDate: startOfDay(new Date()) },
      { label: "Check-out", selected: checkOut, isCheckIn: false, minDate: addDays(checkIn, 1) },
    ].map(({ label, selected, isCheckIn, minDate }) => (
      <label
        key={label}
        className={`block cursor-pointer px-4 py-3 transition hover:bg-ink-50 ${isCheckIn ? "rounded-l-2xl border-r border-ink-200" : "rounded-r-2xl"}`}
      >
        <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-500">{label}</span>
        <DatePicker
          selected={selected}
          onChange={(date) => date && onChange(date, isCheckIn)}
          selectsStart={isCheckIn}
          selectsEnd={!isCheckIn}
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          dateFormat="EEE, d MMM yyyy"
          popperPlacement="bottom-start"
          className="w-full cursor-pointer bg-transparent text-sm font-semibold text-ink-900 outline-none"
        />
      </label>
    ))}
  </div>
);

// Mobile: one inline calendar; tap check-in, then check-out.
const InlineRange = ({ checkIn, checkOut, onApply }) => {
  const [range, setRange] = useState([checkIn, checkOut]);
  const [start, end] = range;

  const handleChange = ([s, e]) => {
    if (e && s && e.getTime() === s.getTime()) return;
    setRange([s, e]);
    if (s && e) onApply(startOfDay(s), startOfDay(e));
  };

  return (
    <div className="behb-datepicker flex flex-col items-center">
      <DatePicker
        inline
        selectsRange
        startDate={start}
        endDate={end}
        selected={start}
        onChange={handleChange}
        minDate={startOfDay(new Date())}
      />
      <p className="mt-3 text-sm text-ink-500">
        {end ? `${shortDate(start)} → ${shortDate(end)}` : "Now pick your check-out date"}
      </p>
    </div>
  );
};

const HelpLinks = () => (
  <div className="grid grid-cols-2 gap-2">
    <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" className="btn border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-100">
      <LuPhone className="h-4 w-4" /> WhatsApp
    </a>
    <a href="http://m.me/hotelname" target="_blank" rel="noopener noreferrer" className="btn border border-sky-100 bg-sky-50 px-4 py-2.5 text-sm text-sky-700 hover:bg-sky-100">
      <LuMessageCircle className="h-4 w-4" /> Messenger
    </a>
  </div>
);

const DetailsSkeleton = () => (
  <div className="container-x py-8">
    <div className="skeleton h-5 w-48 rounded-lg" />
    <div className="skeleton mt-4 h-10 w-2/3 rounded-xl" />
    <div className="skeleton mt-6 h-[280px] rounded-4xl sm:h-[420px]" />
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div className="skeleton h-40 rounded-3xl" />
        <div className="skeleton h-64 rounded-3xl" />
      </div>
      <div className="skeleton hidden h-96 rounded-3xl lg:block" />
    </div>
  </div>
);

const HotelDetails = () => {
  const { t } = useI18n();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: hotelData, isLoading: hotelLoading, error: hotelError } = useGetHotelByIdQuery(id);
  const { data: roomsData, isLoading: roomsLoading } = useGetRoomsByHotelIdQuery(id);
  const [checkRoomAvailability] = useCheckRoomAvailabilityBookingMutation();

  const [checkingAvailability, setCheckingAvailability] = useState({});
  const [selectedRooms, setSelectedRooms] = useState([]);
  // Dates can arrive in the link (e.g. from the AI assistant): ?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
  const [searchParams] = useSearchParams();
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = searchParams.get("checkIn") && startOfDay(new Date(`${searchParams.get("checkIn")}T00:00:00`));
    return d && !Number.isNaN(d.getTime()) && !isAfter(startOfDay(new Date()), d) ? d : startOfDay(new Date());
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = searchParams.get("checkOut") && startOfDay(new Date(`${searchParams.get("checkOut")}T00:00:00`));
    const minOut = addDays(checkInDate, 1);
    return d && !Number.isNaN(d.getTime()) && !isAfter(minOut, d) ? d : minOut;
  });
  const [currentRoom, setCurrentRoom] = useState(null);
  const [datesOpen, setDatesOpen] = useState(false);
  const [roomQuantities, setRoomQuantities] = useState({});
  const [adultCounts, setAdultCounts] = useState({});
  const [childCounts, setChildCounts] = useState({});

  const hotel = hotelData?.data;
  const rooms = useMemo(() => roomsData?.data || [], [roomsData]);
  const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
  const fromPrice = lowestRoomPrice(rooms);

  const gallery = useMemo(() => {
    const all = [
      ...(hotel?.image ? [{ src: hotel.image, alt: hotel.name }] : []),
      ...rooms.flatMap((room) => room.images?.map((src) => ({ src, alt: `${room.type} room` })) || []),
    ];
    return all.filter((img, i) => img.src && all.findIndex((o) => o.src === img.src) === i);
  }, [hotel, rooms]);

  useEffect(() => {
    if (hotel?.id) trackRecentlyViewed(hotel.id);
  }, [hotel?.id]);

  const isSelected = useCallback((roomId) => selectedRooms.some((room) => room.id === roomId), [selectedRooms]);

  useEffect(() => {
    if (rooms.length > 0) {
      const initialQuantities = {};
      const initialAdultCounts = {};
      const initialChildCounts = {};
      rooms.forEach((room) => {
        initialQuantities[room.id] = 1;
        initialAdultCounts[room.id] = 1;
        initialChildCounts[room.id] = 0;
      });
      setRoomQuantities(initialQuantities);
      setAdultCounts(initialAdultCounts);
      setChildCounts(initialChildCounts);
    }
  }, [rooms]);

  const handleRoomToggle = async (room) => {
    try {
      setCheckingAvailability((prev) => ({ ...prev, [room.id]: true }));

      const res = await checkRoomAvailability({
        roomId: room.id,
        checkIn: formatToUTC(checkInDate),
        checkOut: formatToUTC(checkOutDate),
        quantity: roomQuantities[room.id] || 1,
      }).unwrap();

      if (res?.data?.available) {
        if (isSelected(room.id)) {
          setSelectedRooms((prev) => prev.filter((r) => r.id !== room.id));
          toast.info(`${room.type} room removed.`);
        } else {
          setSelectedRooms((prev) => [
            ...prev,
            {
              ...room,
              quantity: roomQuantities[room.id] || 1,
              adults: adultCounts[room.id] || 1,
              children: childCounts[room.id] || 0,
            },
          ]);
          toast.success(`${room.type} room added to your stay.`);
        }
      } else {
        toast.warning(res?.data?.message || "That room isn't available for your dates.");
      }
    } catch (err) {
      toast.error("Couldn't check availability. Please try again.");
    } finally {
      setCheckingAvailability((prev) => ({ ...prev, [room.id]: false }));
    }
  };

  // Availability is checked per date range, so a date change invalidates any selection.
  const clearSelectionForNewDates = () => {
    if (selectedRooms.length) {
      setSelectedRooms([]);
      toast.info("Dates changed, so your rooms were cleared. Select them again to re-check availability.");
    }
  };

  const handleDateChange = (date, isCheckIn = true) => {
    const newDate = startOfDay(date);
    if (isCheckIn) {
      setCheckInDate(newDate);
      if (!isAfter(checkOutDate, newDate)) setCheckOutDate(addDays(newDate, 1));
      clearSelectionForNewDates();
    } else if (isAfter(newDate, checkInDate)) {
      setCheckOutDate(newDate);
      clearSelectionForNewDates();
    } else {
      toast.warning("Check-out must be after check-in.");
    }
  };

  const setStay = (start, end) => {
    setCheckInDate(start);
    setCheckOutDate(end);
    clearSelectionForNewDates();
  };

  const recalculateRoomCapacity =(roomId, customAdults, customChildren) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    const currentAdults = customAdults ?? adultCounts[roomId] ?? 0;
    const currentChildren = customChildren ?? childCounts[roomId] ?? 0;
    const currentQuantity = roomQuantities[roomId] ?? 1;
    const neededQuantity = Math.ceil((currentAdults + currentChildren) / (room.capacity + room.child));
    if (neededQuantity !== currentQuantity) {
      setRoomQuantities((prev) => ({ ...prev, [roomId]: neededQuantity }));
    }
  };

  const handleQuantityChange = (roomId, value) => {
    setRoomQuantities((prev) => ({ ...prev, [roomId]: Math.max(1, value) }));
  };

  const handleAdultCountChange = (roomId, value) => {
    const newAdultCount = Math.max(0, value);
    setAdultCounts((prev) => ({ ...prev, [roomId]: newAdultCount }));
    recalculateRoomCapacity(roomId, newAdultCount, childCounts[roomId] ?? 0);
  };

  const handleChildCountChange = (roomId, value) => {
    const newChildCount = Math.max(0, value);
    setChildCounts((prev) => ({ ...prev, [roomId]: newChildCount }));
    recalculateRoomCapacity(roomId, adultCounts[roomId] ?? 0, newChildCount);
  };

  const totalPrice = selectedRooms.reduce((sum, room) => sum + room.price * nights * room.quantity, 0);
  const roomsBooked = selectedRooms.reduce((sum, r) => sum + r.quantity, 0);

  const handleCheckout = () => {
    dispatch(
      setBookingDetails({
        selectedRooms,
        checkInDate: formatToUTC(checkInDate),
        checkOutDate: formatToUTC(checkOutDate),
        totalPrice,
        nights,
      })
    );
    navigate("/checkout");
  };

  const scrollToRooms = () => document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: hotel?.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      }
    } catch {
      /* the user dismissed the share sheet */
    }
  };

  if (hotelLoading || roomsLoading) return <DetailsSkeleton />;

  if (hotelError || !hotel) {
    return (
      <div className="container-x flex flex-col items-center gap-4 py-24 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <LuSearchX className="h-7 w-7" />
        </span>
        <h1 className="text-2xl font-bold text-ink-950">We couldn&apos;t find this hotel</h1>
        <p className="text-ink-500">It may have been removed, or the link is incorrect.</p>
        <Link to="/" className="btn-primary mt-2">
          Back to all hotels
        </Link>
      </div>
    );
  }

  const bookingSummary = (
    <>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-ink-500">
          {fromPrice ? (
            <>
              from <span className="text-2xl font-extrabold text-ink-950">{formatTaka(fromPrice)}</span> / night
            </>
          ) : (
            "Rooms coming soon"
          )}
        </p>
      </div>

      <div className="mt-5">
        <DateRange checkIn={checkInDate} checkOut={checkOutDate} onChange={handleDateChange} />
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
          <LuCalendarDays className="h-3.5 w-3.5" /> {pluralize(nights, "night")} stay
        </p>
      </div>

      {selectedRooms.length > 0 ? (
        <div className="mt-5 space-y-3">
          {selectedRooms.map((room) => (
            <div key={room.id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="font-semibold text-ink-900">
                  {room.type} <span className="font-medium text-ink-400">× {room.quantity}</span>
                </p>
                <p className="text-xs text-ink-500">
                  {pluralize(room.adults, "adult")}, {pluralize(room.children, "child", "children")} · {formatTaka(room.price)} × {pluralize(nights, "night")}
                </p>
              </div>
              <p className="font-semibold text-ink-900">{formatTaka(room.price * nights * room.quantity)}</p>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-dashed border-ink-200 pt-3">
            <p className="font-bold text-ink-950">{t("hotel.total")}</p>
            <p className="text-xl font-extrabold text-ink-950">{formatTaka(totalPrice)}</p>
          </div>
          <button onClick={handleCheckout} className="btn-brand w-full py-3.5 text-base">
            {t("hotel.reserve")} · {pluralize(roomsBooked, "room")} <LuArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-ink-50 p-4 text-center">
          <p className="text-sm font-semibold text-ink-700">{t("hotel.noRooms")}</p>
          <p className="mt-1 text-xs text-ink-500">{t("hotel.noRoomsHint")}</p>
          <button onClick={scrollToRooms} className="btn-primary mt-3 w-full">
            {t("hotel.seeRooms")}
          </button>
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-500">
        <LuShieldCheck className="h-4 w-4 text-emerald-600" /> {t("hotel.securePayment")}
      </p>
    </>
  );

  return (
    <div className="pb-32 lg:pb-16">
      <div className="container-x pt-6">
        {/* Breadcrumb & title */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-500">
          <Link to="/" className="hover:text-ink-900">
            Home
          </Link>
          <LuChevronRight className="h-3.5 w-3.5" />
          <Link to="/" className="hover:text-ink-900">
            Hotels
          </Link>
          <LuChevronRight className="h-3.5 w-3.5" />
          <span className="truncate font-medium text-ink-900">{hotel.name}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">{hotel.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-ink-500">
              <LuMapPin className="h-4 w-4 text-brand-500" /> {hotel.location}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <HotelActions hotel={hotel} variant="inline" />
            <button onClick={handleShare} className="btn-ghost w-fit">
              <LuShare2 className="h-4 w-4" /> {t("hotel.share")}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <RoomGallery images={gallery} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Main column */}
          <div className="min-w-0 space-y-12">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: LuBedDouble, value: rooms.length, label: "room types" },
                { icon: LuSparkles, value: hotel.amenities?.length || 0, label: "amenities" },
                { icon: LuCalendarDays, value: fromPrice ? formatTaka(fromPrice) : "—", label: "starting price" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="card flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-3">
                  <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 sm:grid">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-lg font-extrabold text-ink-950">{value}</p>
                    <p className="text-xs text-ink-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {hotel.description && (
              <section>
                <h2 className="text-xl font-bold text-ink-950">{t("hotel.about")}</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-600">{hotel.description}</p>
              </section>
            )}

            {hotel.amenities?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-ink-950">{t("hotel.offers")}</h2>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {hotel.amenities.map((a) => {
                    const Icon = getAmenityIcon(a);
                    return (
                      <li key={a} className="flex items-center gap-3 rounded-2xl border border-ink-100 px-4 py-3 text-sm font-medium text-ink-800">
                        <Icon className="h-5 w-5 text-brand-600" /> {a}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <section id="rooms" className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-ink-950">{t("hotel.chooseRoom")}</h2>
                  <p className="mt-1 text-sm text-ink-500">
                    {shortDate(checkInDate)} → {shortDate(checkOutDate)} · {pluralize(nights, "night")}
                  </p>
                </div>
                <button onClick={() => setDatesOpen(true)} className="btn-ghost lg:hidden">
                  <LuCalendarDays className="h-4 w-4" /> {t("hotel.changeDates")}
                </button>
              </div>

              <div className="mt-5">
                <AvailabilityCalendar hotelId={hotel.id} checkIn={checkInDate} checkOut={checkOutDate} onSelect={setStay} />
              </div>

              <div className="mt-5 space-y-5">
                {rooms.length === 0 ? (
                  <div className="card px-6 py-12 text-center text-ink-500">This hotel hasn&apos;t listed any rooms yet.</div>
                ) : (
                  rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      selected={isSelected(room.id)}
                      checking={Boolean(checkingAvailability[room.id])}
                      quantity={roomQuantities[room.id] || 1}
                      adults={adultCounts[room.id] ?? 0}
                      childCount={childCounts[room.id] ?? 0}
                      onQuantity={(v) => handleQuantityChange(room.id, v)}
                      onAdults={(v) => handleAdultCountChange(room.id, v)}
                      onChildren={(v) => handleChildCountChange(room.id, v)}
                      onToggle={() => handleRoomToggle(room)}
                      onDetails={() => setCurrentRoom(room)}
                    />
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink-950">{t("hotel.where")}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                <LuMapPin className="h-4 w-4" /> {hotel.location}
              </p>
              {hotel.latitude && hotel.longitude ? (
                <iframe
                  title={`Map of ${hotel.name}`}
                  src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&hl=en&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="mt-4 h-80 w-full rounded-3xl border border-ink-100"
                  allowFullScreen
                />
              ) : (
                <p className="mt-4 text-sm text-ink-500">Map location isn&apos;t available for this hotel.</p>
              )}
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold text-ink-950">{t("hotel.questions")}</h2>
              <p className="mt-1 text-sm text-ink-500">{t("hotel.questionsText")}</p>
              <div className="mt-4 max-w-sm">
                <HelpLinks />
              </div>
            </section>
          </div>

          {/* Booking sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="card sticky top-24 p-6 shadow-lift">{bookingSummary}</div>
          </aside>
        </div>
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white px-4 py-3 shadow-lift lg:hidden" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setDatesOpen(true)} className="min-w-0 text-left">
            {selectedRooms.length ? (
              <p className="text-lg font-extrabold text-ink-950">{formatTaka(totalPrice)}</p>
            ) : (
              <p className="text-sm text-ink-500">
                from <span className="font-extrabold text-ink-950">{fromPrice ? formatTaka(fromPrice) : "—"}</span> / night
              </p>
            )}
            <p className="truncate text-xs font-semibold text-brand-700 underline underline-offset-2">
              {shortDate(checkInDate)} – {shortDate(checkOutDate)}
            </p>
          </button>
          {selectedRooms.length ? (
            <button onClick={handleCheckout} className="btn-brand shrink-0">
              {t("hotel.reserve")} {roomsBooked} <LuArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={scrollToRooms} className="btn-primary shrink-0">
              {t("hotel.selectRooms")}
            </button>
          )}
        </div>
      </div>

      {/* Mobile date picker */}
      <Modal open={datesOpen} onClose={() => setDatesOpen(false)} title="Your stay" size="md">
        {datesOpen && <InlineRange checkIn={checkInDate} checkOut={checkOutDate} onApply={setStay} />}
        <button onClick={() => setDatesOpen(false)} className="btn-primary mt-5 w-full">
          Done
        </button>
      </Modal>

      {/* Room details */}
      <Modal
        open={Boolean(currentRoom)}
        onClose={() => setCurrentRoom(null)}
        title={currentRoom ? `${currentRoom.type} room` : ""}
        size="xl"
        footer={
          currentRoom && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-ink-500">
                <span className="text-xl font-extrabold text-ink-950">{formatTaka(currentRoom.price)}</span> / night
              </p>
              <button
                onClick={() => {
                  handleRoomToggle(currentRoom);
                  setCurrentRoom(null);
                }}
                disabled={!currentRoom.isAvailable || checkingAvailability[currentRoom.id]}
                className={isSelected(currentRoom.id) ? "btn-ghost" : "btn-brand"}
              >
                {isSelected(currentRoom.id) ? "Remove room" : "Select this room"}
              </button>
            </div>
          )
        }
      >
        {currentRoom && (
          <div className="space-y-6">
            {currentRoom.images?.length > 0 && (
              <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6">
                {currentRoom.images.map((src, i) => (
                  <img
                    key={src + i}
                    src={src}
                    alt={`${currentRoom.type} room, photo ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-[85%] shrink-0 snap-center rounded-2xl object-cover sm:w-[48%]"
                  />
                ))}
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Adults", value: currentRoom.capacity },
                { label: "Children", value: currentRoom.child },
                { label: "Rooms of this type", value: currentRoom.roomQty },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl bg-ink-50 p-4">
                  <p className="text-xl font-extrabold text-ink-950">{value}</p>
                  <p className="text-xs text-ink-500">{label}</p>
                </div>
              ))}
            </div>
            {currentRoom.amenities?.length > 0 && (
              <div>
                <h3 className="font-bold text-ink-950">Room amenities</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentRoom.amenities.map((a) => (
                    <AmenityChip key={a} name={a} size="md" />
                  ))}
                </div>
              </div>
            )}
            {currentRoom.description && (
              <div>
                <h3 className="font-bold text-ink-950">Description</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{currentRoom.description}</p>
              </div>
            )}
            <div>
              <h3 className="mb-3 font-bold text-ink-950">Need help?</h3>
              <HelpLinks />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HotelDetails;
