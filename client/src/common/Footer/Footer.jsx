import { Link } from "react-router-dom";
import { LuBadgeCheck, LuCreditCard, LuZap } from "react-icons/lu";
import Logo from "../../components/ui/Logo";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/hotels", label: "All hotels" },
      { to: "/division", label: "Destinations" },
      { to: "/compare", label: "Compare hotels" },
      { to: "/saved", label: "Saved hotels" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Log in" },
      { to: "/register", label: "Create account" },
      { to: "/user/user-booking", label: "My bookings" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/contact", label: "Contact & FAQ" },
      { to: "/privacy-policy", label: "Privacy policy" },
    ],
  },
];

const promises = [
  { icon: LuZap, text: "Live availability" },
  { icon: LuCreditCard, text: "Secure SSLCommerz payments" },
  { icon: LuBadgeCheck, text: "Instant confirmation" },
];

const Footer = () => (
  <footer className="relative overflow-hidden bg-ink-950 pb-28 text-ink-300 lg:pb-0">
    <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
    <div className="container-x relative py-16">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Logo light />
          <p className="mt-5 text-sm leading-relaxed text-ink-400">
            Hotels across all eight divisions of Bangladesh, with live room availability, clear prices and secure online payment.
          </p>
          <ul className="mt-6 space-y-2.5">
            {promises.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-ink-300">
                <Icon className="h-4 w-4 text-cyan-300" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-white">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ink-400 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ink-500 sm:flex-row">
        <p>© {new Date().getFullYear()} BEHB Hotel Booking. All rights reserved.</p>
        <p>Prices shown in Bangladeshi Taka (৳).</p>
      </div>
    </div>
  </footer>
);

export default Footer;
