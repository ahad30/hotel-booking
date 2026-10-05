import { LuBedDouble, LuBuilding2, LuMapPinned, LuWallet } from "react-icons/lu";
import { useAllHotels } from "../../../utils/useAllHotels";
import { useGetDivisionsQuery } from "../../../redux/Feature/User/place/placeApi";
import { formatTaka } from "../../../utils/format";
import { useI18n } from "../../../i18n/LanguageProvider";

// Live numbers from the API, so they always match what's bookable.
const StatsStrip = () => {
  const { hotels, isLoading } = useAllHotels();
  const { data: divisions } = useGetDivisionsQuery();
  const { t } = useI18n();

  const prices = hotels.map((h) => h.fromPrice).filter(Boolean);
  const stats = [
    { icon: LuBuilding2, value: hotels.length, label: t("stats.hotels") },
    { icon: LuBedDouble, value: hotels.reduce((s, h) => s + (h.rooms?.length || 0), 0), label: t("stats.roomTypes") },
    { icon: LuMapPinned, value: divisions?.data?.length ?? "—", label: t("stats.divisions") },
    { icon: LuWallet, value: prices.length ? formatTaka(Math.min(...prices)) : "—", label: t("stats.from") },
  ];

  return (
    <section className="container-x relative z-10 -mt-10" aria-label="BEHB in numbers">
      <ul className="grid grid-cols-2 gap-3 rounded-4xl border border-ink-100 bg-white p-3 shadow-lift sm:p-4 lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <li key={label} className="flex items-center gap-3 rounded-3xl px-3 py-3 sm:gap-4 sm:px-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              {isLoading ? (
                <div className="skeleton h-7 w-14 rounded-lg" />
              ) : (
                <p className="truncate text-xl font-extrabold tabular-nums text-ink-950 sm:text-2xl">{value}</p>
              )}
              <p className="text-xs font-medium text-ink-500">{label}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StatsStrip;
