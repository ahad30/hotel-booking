import { Link } from "react-router-dom";
import { LuBadgeCheck, LuCreditCard, LuZap } from "react-icons/lu";
import Logo from "../../components/ui/Logo";
import { useI18n } from "../../i18n/LanguageProvider";

const columns = [
  {
    title: "footer.explore",
    links: [
      { to: "/hotels", label: "footer.allHotels" },
      { to: "/division", label: "nav.destinations" },
      { to: "/compare", label: "footer.compare" },
      { to: "/saved", label: "nav.saved" },
    ],
  },
  {
    title: "footer.account",
    links: [
      { to: "/login", label: "nav.login" },
      { to: "/register", label: "footer.createAccount" },
      { to: "/user/user-booking", label: "nav.myBookings" },
    ],
  },
  {
    title: "footer.company",
    links: [
      { to: "/contact", label: "footer.contact" },
      { to: "/privacy-policy", label: "footer.privacy" },
    ],
  },
];

const promises = [
  { icon: LuZap, text: "footer.promise1" },
  { icon: LuCreditCard, text: "footer.promise2" },
  { icon: LuBadgeCheck, text: "footer.promise3" },
];

const Footer = () => {
  const { t } = useI18n();
  return (
  <footer className="relative overflow-hidden bg-ink-950 pb-[calc(7rem+var(--tray-space,0px))] text-ink-300 lg:pb-0">
    <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
    <div className="container-x relative py-16">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Logo light />
          <p className="mt-5 text-sm leading-relaxed text-ink-400">
            {t("footer.tagline")}
          </p>
          <ul className="mt-6 space-y-2.5">
            {promises.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-ink-300">
                <Icon className="h-4 w-4 text-cyan-300" />
                {t(text)}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-white">{t(col.title)}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ink-400 transition hover:text-white">
                      {t(l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ink-400 sm:flex-row">
        <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
        <p>{t("footer.currency")}</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
