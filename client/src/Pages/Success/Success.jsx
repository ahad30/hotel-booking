import { Link } from "react-router-dom";
import { LuArrowRight, LuCircleCheck, LuHistory } from "react-icons/lu";

const Success = () => (
  <section className="relative isolate flex min-h-[calc(100vh-72px)] items-center overflow-hidden px-4 py-16">
    <div className="absolute left-1/2 top-0 -z-10 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
    <div className="card mx-auto w-full max-w-lg animate-fade-up p-8 text-center sm:p-12">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
        <LuCircleCheck className="h-10 w-10" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-950">Thank you for your booking!</h1>
      <p className="mt-3 text-ink-500">
        Your booking is being processed and will be reviewed within 1–2 hours. You&apos;ll find the confirmation in your email.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/user/user-booking" className="btn-primary">
          <LuHistory className="h-4 w-4" /> View my bookings
        </Link>
        <Link to="/" className="btn-ghost">
          Keep exploring <LuArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default Success;
