import { LuBadgeCheck, LuCreditCard, LuZap } from "react-icons/lu";
import SearchPanel from "./SearchPanel";
import { useI18n } from "../../../i18n/LanguageProvider";

const HERO = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop";

const trust = [
  { icon: LuZap, text: "hero.trust1" },
  { icon: LuCreditCard, text: "hero.trust2" },
  { icon: LuBadgeCheck, text: "hero.trust3" },
];

const Hero = () => {
  const { t } = useI18n();
  return (
  <section className="relative isolate flex min-h-[640px] items-end overflow-hidden pb-14 pt-32 sm:min-h-[720px] lg:min-h-[760px] lg:pb-20">
    {/* Same URLs as the <link rel="preload"> tags in index.html, so the browser reuses them. */}
    <img
      src={`${HERO}&w=1920&q=70`}
      srcSet={`${HERO}&w=900&q=65 900w, ${HERO}&w=1920&q=70 1920w`}
      sizes="100vw"
      alt=""
      fetchpriority="high"
      decoding="async"
      className="absolute inset-0 -z-20 h-full w-full animate-slow-zoom object-cover"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/40 to-ink-950/85" />
    <div className="absolute -left-40 top-1/3 -z-10 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
    <div className="absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

    <div className="container-x">
      <div className="max-w-3xl animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {t("hero.badge")}
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {t("hero.title1")}
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">{t("hero.title2")}</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
          {t("hero.subtitle")}
        </p>
      </div>

      <div className="mt-10 max-w-5xl animate-fade-up [animation-delay:150ms]">
        <SearchPanel />
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 animate-fade-up [animation-delay:250ms]">
        {trust.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2 text-sm font-medium text-white/85">
            <Icon className="h-4 w-4 text-cyan-300" />
            {t(text)}
          </li>
        ))}
      </ul>
    </div>
  </section>
  );
};

export default Hero;
