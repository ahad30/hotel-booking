import { Link } from "react-router-dom";
import { LuArrowRight, LuBadgeCheck, LuCalendarCheck, LuCreditCard, LuHeadphones, LuMapPin, LuSearch, LuZap } from "react-icons/lu";
import SectionHeader from "../SectionHeader";

const features = [
  {
    icon: LuZap,
    title: "Real-time availability",
    text: "Every room is checked against existing bookings for your exact dates before you pay.",
  },
  {
    icon: LuCreditCard,
    title: "Secure payments",
    text: "Checkout runs through SSLCommerz, with cards, mobile banking and net banking supported.",
  },
  {
    icon: LuMapPin,
    title: "Nationwide coverage",
    text: "Browse stays by division, district and area, from city centres to quiet getaways.",
  },
  {
    icon: LuHeadphones,
    title: "Help when you need it",
    text: "Reach the team on WhatsApp or Messenger straight from any hotel page.",
  },
];

const steps = [
  { icon: LuSearch, title: "Search", text: "Find a hotel by name or location." },
  { icon: LuCalendarCheck, title: "Pick rooms", text: "Choose dates, guests and room types." },
  { icon: LuBadgeCheck, title: "Pay & relax", text: "Pay securely and get confirmation." },
];

const WhyUs = () => (
  <>
    <section className="container-x pt-20 sm:pt-28">
      <SectionHeader eyebrow="Why BEHB" title="Booking a hotel, minus the guesswork" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-gradient group-hover:text-white">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-ink-950">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container-x py-20 sm:py-28">
      <div className="relative isolate overflow-hidden rounded-4xl bg-ink-950 px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
        <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 left-10 -z-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Your next stay is three steps away.
            </h2>
            <p className="mt-4 max-w-md text-ink-300">
              No phone calls and no waiting for a reply. See what&apos;s free, pick your room and you&apos;re booked.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#hotels" className="btn bg-white px-6 py-3 text-sm text-ink-950 hover:bg-ink-100">
                Browse hotels <LuArrowRight className="h-4 w-4" />
              </a>
              <Link to="/register" className="btn border border-white/20 px-6 py-3 text-sm text-white hover:bg-white/10">
                Create free account
              </Link>
            </div>
          </div>

          <ol className="relative space-y-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex items-center gap-5 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-extrabold text-ink-950">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-sm text-ink-300">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  </>
);

export default WhyUs;
