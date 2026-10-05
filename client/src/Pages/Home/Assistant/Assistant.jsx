import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuBaby,
  LuBedDouble,
  LuCalendarDays,
  LuLoaderCircle,
  LuMapPin,
  LuSearchX,
  LuSparkles,
  LuUsers,
  LuWallet,
} from "react-icons/lu";
import { useAssistantSearchMutation } from "../../../redux/Feature/User/assistantApi";
import SmartImage from "../../../components/ui/SmartImage";
import { getAmenityIcon } from "../../../components/ui/amenities";
import { formatTaka, pluralize } from "../../../utils/format";
import { useI18n } from "../../../i18n/LanguageProvider";

const EXAMPLES = [
  "Family of 4 in Chattogram under ৳6,000 with a pool this weekend",
  "Couple in Sylhet, 3 nights from 12 Oct, with spa",
  "2 adults and a kid tomorrow under ৳3,000 with WiFi",
];

const day = (s) => format(new Date(`${s}T00:00:00`), "d MMM");

const FilterChips = ({ f }) => {
  const chips = [
    f.divisionName && { icon: LuMapPin, text: f.divisionName },
    f.keywords && { icon: LuMapPin, text: `“${f.keywords}”` },
    (f.minPrice || f.maxPrice) && {
      icon: LuWallet,
      text: f.minPrice && f.maxPrice ? `${formatTaka(f.minPrice)}–${formatTaka(f.maxPrice)}` : f.maxPrice ? `Up to ${formatTaka(f.maxPrice)}` : `From ${formatTaka(f.minPrice)}`,
    },
    { icon: LuUsers, text: pluralize(f.adults, "adult") },
    f.children > 0 && { icon: LuBaby, text: pluralize(f.children, "child", "children") },
    f.rooms > 1 && { icon: LuBedDouble, text: pluralize(f.rooms, "room") },
    f.checkIn && { icon: LuCalendarDays, text: `${day(f.checkIn)} → ${day(f.checkOut)} · ${pluralize(f.nights, "night")}` },
    ...f.amenities.map((a) => ({ icon: getAmenityIcon(a), text: a })),
  ].filter(Boolean);

  return (
    <ul className="flex flex-wrap gap-2" aria-label="How we understood your request">
      {chips.map(({ icon: Icon, text }) => (
        <li key={text} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-800 ring-1 ring-ink-100">
          <Icon className="h-3.5 w-3.5 text-brand-600" /> {text}
        </li>
      ))}
    </ul>
  );
};

const ResultCard = ({ r, f }) => {
  const { t } = useI18n();
  const params = f.checkIn ? `?checkIn=${f.checkIn}&checkOut=${f.checkOut}` : "";
  return (
    <li className="group flex gap-4 rounded-3xl border border-ink-100 bg-white p-3 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:p-4">
      <SmartImage src={r.image} alt={r.name} className="h-24 w-24 shrink-0 rounded-2xl sm:h-28 sm:w-32" />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-bold text-ink-950">{r.name}</p>
        <p className="flex items-center gap-1 truncate text-xs text-ink-500">
          <LuMapPin className="h-3.5 w-3.5 shrink-0" /> {r.location}
        </p>
        <p className="mt-2 text-sm text-ink-700">
          <span className="font-semibold">{r.bestRoom.type}</span> · sleeps {r.bestRoom.sleeps} · {formatTaka(r.bestRoom.price)}/night
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
          <div className="text-xs">
            {r.availabilityChecked ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <LuBadgeCheck className="h-3.5 w-3.5" /> {t("assistant.available")}
              </span>
            ) : (
              <span className="text-ink-400">{t("assistant.pickDates")}</span>
            )}
            {r.bestRoom.total && <p className="text-base font-extrabold text-ink-950">{t("assistant.total", { amount: formatTaka(r.bestRoom.total) })}</p>}
          </div>
          <Link to={`/hotel-details/${r.id}${params}`} className="btn-primary px-4 py-2 text-xs">
            {t("assistant.book")} <LuArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </li>
  );
};

// "Describe your trip" search: Claude turns the sentence into filters, the API
// matches real hotels and checks live availability for the dates.
const Assistant = () => {
  const [query, setQuery] = useState("");
  const [search, { data, isLoading, error, reset }] = useAssistantSearchMutation();
  const { t } = useI18n();
  const result = data?.data;

  const run = (q) => {
    const text = (q ?? query).trim();
    if (text.length < 3) return;
    setQuery(text);
    search(text);
  };

  return (
    <section className="container-x pt-20 sm:pt-28" aria-labelledby="assistant-title">
      <div className="relative isolate overflow-hidden rounded-4xl bg-ink-950 p-6 sm:p-10 lg:p-12">
        <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 left-10 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200">
            <LuSparkles className="h-3.5 w-3.5" /> {t("assistant.badge")}
          </p>
          <h2 id="assistant-title" className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("assistant.title")}
          </h2>
          <p className="mt-2 text-ink-300">{t("assistant.subtitle")}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className="mt-6 flex flex-col gap-2 rounded-[28px] bg-white p-2 sm:flex-row"
        >
          <label className="flex flex-1 items-center gap-3 px-3">
            <LuSparkles className="h-5 w-5 shrink-0 text-brand-600" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) reset();
              }}
              maxLength={300}
              placeholder={t("assistant.placeholder")}
              aria-label={t("assistant.placeholder")}
              className="h-12 w-full bg-transparent text-[15px] font-medium text-ink-900 outline-none placeholder:text-ink-400"
            />
          </label>
          <button type="submit" disabled={isLoading || query.trim().length < 3} className="btn-brand h-12 rounded-[22px] px-6">
            {isLoading ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : <LuSparkles className="h-4 w-4" />}
            {isLoading ? t("assistant.searching") : t("assistant.submit")}
          </button>
        </form>

        {!result && !isLoading && (
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => run(ex)} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-left text-xs font-medium text-ink-200 transition hover:bg-white/15 hover:text-white">
                {ex}
              </button>
            ))}
          </div>
        )}

        <div aria-live="polite">
          {error && (
            <p className="mt-4 rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-200 ring-1 ring-rose-400/30">
              {error?.data?.message || t("assistant.error")}
            </p>
          )}

          {isLoading && (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-3xl bg-white/10" />
              ))}
            </div>
          )}

          {result && !isLoading && (
            <div className="mt-6 rounded-3xl bg-ink-50 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-ink-500">{t("assistant.understood")}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-400">
                  <LuSparkles className="h-3 w-3" /> {result.interpretedBy === "claude" ? t("assistant.byClaude") : t("assistant.byRules")}
                </span>
              </div>
              <div className="mt-3">
                <FilterChips f={result.filters} />
              </div>

              {result.results.length ? (
                <>
                  <p className="mb-3 mt-5 text-sm font-semibold text-ink-700">{result.results.length === 1 ? t("assistant.oneMatch") : t("assistant.matches", { count: result.results.length })}</p>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {result.results.map((r) => (
                      <ResultCard key={r.id} r={r} f={result.filters} />
                    ))}
                  </ul>
                </>
              ) : (
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-ink-600 ring-1 ring-ink-100">
                  <LuSearchX className="h-5 w-5 shrink-0 text-brand-600" />
                  {t("assistant.noMatch")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Assistant;
