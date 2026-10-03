import { LuBadgeCheck, LuCreditCard, LuZap } from "react-icons/lu";
import Logo from "../../components/ui/Logo";
import "./auth.css";

const IMAGE = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=70";

const perks = [
  { icon: LuZap, text: "See live room availability for your dates" },
  { icon: LuCreditCard, text: "Pay securely through SSLCommerz" },
  { icon: LuBadgeCheck, text: "Keep every booking in one place" },
];

// Split-screen layout shared by the login and sign-up pages.
const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
    <div className="flex items-center justify-center px-4 py-12 sm:px-8">
      <div className="w-full max-w-md animate-fade-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-950">{title}</h1>
        {subtitle && <p className="mt-2 text-ink-500">{subtitle}</p>}
        <div className="auth-form mt-8">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-ink-500">{footer}</div>}
      </div>
    </div>

    <div className="relative hidden overflow-hidden p-4 lg:block">
      <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-4xl p-10">
        <img src={IMAGE} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-ink-950/20" />
        <Logo light />
        <div>
          <p className="max-w-md text-3xl font-extrabold leading-tight text-white">
            Your next getaway in Bangladesh starts here.
          </p>
          <ul className="mt-6 space-y-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium text-white/85">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 backdrop-blur">
                  <Icon className="h-4 w-4 text-cyan-300" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default AuthShell;
