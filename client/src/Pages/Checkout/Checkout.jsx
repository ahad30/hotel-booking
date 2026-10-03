import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "sonner";
import { LuBedDouble, LuCalendarDays, LuCheck, LuCreditCard, LuLock, LuShieldCheck } from "react-icons/lu";
import ZFormTwo from "../../components/Form/ZFormTwo";
import ZInputTwo from "../../components/Form/ZInputTwo";
import ZEmail from "../../components/Form/ZEmail";
import ZPhone from "../../components/Form/ZPhone";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useCreateBookingMutation } from "../../redux/Feature/Admin/booking/bookingApi";
import { clearBooking } from "../../redux/Booking/bookingSlice";
import SmartImage from "../../components/ui/SmartImage";
import { formatTaka, pluralize } from "../../utils/format";
import "../Auth/auth.css";

const steps = ["Choose rooms", "Guest details", "Payment"];

const Checkout = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const { selectedRooms, checkInDate, checkOutDate, totalPrice, nights } = useAppSelector((state) => state.booking);

  const [createBooking, { isLoading, isSuccess, isError, error, data }] = useCreateBookingMutation();

  const handleSubmit = async (formData) => {
    if (!selectedRooms?.length) {
      toast.error("Please select rooms before checking out.");
      return;
    }

    const bookingItems = selectedRooms.map((room) => ({
      roomNumber: room?.roomNumber,
      roomId: room.id,
      roomType: room.type,
      quantity: room?.quantity,
      adults: room.adults,
      children: room.children,
      price: room.price,
      amenities: room.amenities || [],
    }));

    const bookingPayload = {
      roomIds: selectedRooms.map((room) => room.id),
      userId: user?.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      email: formData?.email || "",
      phone: formData?.phone,
      name: formData?.name,
      status: "pending",
      bookingItem: bookingItems,
    };

    try {
      const res = await createBooking(bookingPayload).unwrap();
      if (res?.data?.payment_url) {
        toast.success("Booking created. Redirecting to payment…");
        dispatch(clearBooking());
        window.location.href = res.data.payment_url;
      } else {
        toast.error("Booking created, but payment URL not received!");
      }
    } catch (err) {
      toast.error("Failed to book, please try again.");
    }
  };

  const hasRooms = selectedRooms?.length > 0;

  return (
    <div className="bg-ink-50/60 pb-16">
      <div className="container-x py-10">
        <ol className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                    i === 0 ? "bg-emerald-500 text-white" : i === 1 ? "bg-ink-950 text-white" : "bg-ink-200 text-ink-500"
                  }`}
                >
                  {i === 0 ? <LuCheck className="h-4 w-4" /> : i + 1}
                </span>
                <span className={i === 1 ? "text-ink-950" : "text-ink-500"}>{s}</span>
              </span>
              {i < steps.length - 1 && <span className="h-px w-8 bg-ink-200" />}
            </li>
          ))}
        </ol>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">Confirm and pay</h1>
        <p className="mt-2 text-ink-500">Add who&apos;s staying, then you&apos;ll be taken to SSLCommerz to complete payment.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-ink-950">Guest details</h2>
            <div className="auth-form mt-5">
              <ZFormTwo
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                submit={handleSubmit}
                formType="create"
                data={data}
              >
                <ZInputTwo name="name" type="text" label="Full name" placeholder="As it appears on your ID" required />
                <div className="grid gap-x-4 sm:grid-cols-2">
                  <ZEmail name="email" label="Email (optional)" />
                  <ZPhone name="phone" label="Phone number" type="text" required />
                </div>

                <h2 className="mb-3 mt-4 text-lg font-bold text-ink-950">Payment method</h2>
                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-brand-500 bg-brand-50/60 p-4">
                  <input type="radio" name="paymentMethod" value="sslcommerz" defaultChecked className="h-4 w-4 accent-brand-600" />
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-600 shadow-soft">
                    <LuCreditCard className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-ink-950">SSLCommerz</span>
                    <span className="block text-xs text-ink-500">Cards, mobile banking (bKash, Nagad, Rocket) and net banking</span>
                  </span>
                </label>

                <button type="submit" disabled={isLoading || !hasRooms} className="mt-6">
                  {isLoading ? "Processing…" : hasRooms ? `Confirm & pay ${formatTaka(totalPrice)}` : "Select rooms first"}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-500">
                  <LuLock className="h-3.5 w-3.5" /> Your payment is processed securely by SSLCommerz.
                </p>
              </ZFormTwo>
            </div>
          </div>

          <aside>
            {hasRooms ? (
              <div className="card sticky top-24 overflow-hidden">
                <SmartImage src={selectedRooms[0]?.images?.[0]} alt="Selected room" className="aspect-[16/9]" />
                <div className="p-6">
                  <h2 className="text-lg font-bold text-ink-950">Your stay</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Check-in", value: moment(checkInDate).format("ddd, D MMM YYYY") },
                      { label: "Check-out", value: moment(checkOutDate).format("ddd, D MMM YYYY") },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-2xl bg-ink-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{label}</p>
                        <p className="mt-0.5 font-semibold text-ink-900">{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-500">
                    <LuCalendarDays className="h-4 w-4" /> {pluralize(nights || 1, "night")}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-ink-100 pt-5">
                    {selectedRooms.map((room) => (
                      <div key={room.id} className="flex items-start justify-between gap-3 text-sm">
                        <div className="flex items-start gap-2">
                          <LuBedDouble className="mt-0.5 h-4 w-4 text-brand-600" />
                          <div>
                            <p className="font-semibold text-ink-900">
                              {room.type} × {room.quantity}
                            </p>
                            <p className="text-xs text-ink-500">
                              {formatTaka(room.price)} × {pluralize(nights || 1, "night")}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-ink-900">{formatTaka(room.price * room.quantity * (nights || 1))}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-dashed border-ink-200 pt-5">
                    <p className="font-bold text-ink-950">Total</p>
                    <p className="text-2xl font-extrabold text-ink-950">{formatTaka(totalPrice)}</p>
                  </div>
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-500">
                    <LuShieldCheck className="h-4 w-4 text-emerald-600" /> Availability was checked for these dates.
                  </p>
                </div>
              </div>
            ) : (
              <div className="card flex flex-col items-center gap-3 p-8 text-center">
                <p className="text-lg font-bold text-ink-950">No rooms selected</p>
                <p className="text-sm text-ink-500">Pick a hotel and choose at least one room to continue.</p>
                <Link to="/" className="btn-primary mt-2">
                  Browse hotels
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
