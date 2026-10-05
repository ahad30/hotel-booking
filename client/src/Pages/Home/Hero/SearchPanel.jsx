import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LuMap, LuMapPin, LuSearch } from "react-icons/lu";
import { useGetDistrictsByDivisionQuery, useGetDivisionsQuery } from "../../../redux/Feature/User/place/placeApi";
import SelectField from "../../../components/ui/SelectField";
import { useI18n } from "../../../i18n/LanguageProvider";

const Field = ({ icon: Icon, label, children }) => (
  <div className="group flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-ink-50 focus-within:bg-ink-50">
    <Icon className="h-5 w-5 shrink-0 text-brand-600" />
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{label}</span>
      {children}
    </span>
  </div>
);

// Hero search: hotel name (debounced) plus division and district filters.
// Writes into the layout's outlet context, which the hotel list reads.
const SearchPanel = () => {
  const { searchQuery, setSearchQuery, divisionId, cityId, setFilters } = useOutletContext();
  const [text, setText] = useState(searchQuery);
  const { t } = useI18n();

  const { data: divisions } = useGetDivisionsQuery();
  const { data: districts, isFetching: districtsLoading } = useGetDistrictsByDivisionQuery(divisionId, {
    skip: !divisionId,
  });

  // Debounce typing so the API isn't hit on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(text.trim()), 350);
    return () => clearTimeout(t);
  }, [text, setSearchQuery]);

  const scrollToResults = (e) => {
    e.preventDefault();
    setSearchQuery(text.trim());
    document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <form
      onSubmit={scrollToResults}
      role="search"
      className="flex w-full flex-col gap-1 rounded-[28px] bg-white p-2 shadow-lift ring-1 ring-black/5 md:flex-row md:items-center"
    >
      <Field icon={LuSearch} label={t("search.hotel")}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("search.hotelPlaceholder")}
          aria-label={t("search.hotelPlaceholder")}
          className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none placeholder:font-medium placeholder:text-ink-400"
        />
      </Field>

      <div className="mx-2 hidden h-10 w-px bg-ink-100 md:block" />

      <Field icon={LuMap} label={t("search.division")}>
        <SelectField
          bare
          showSearch
          ariaLabel="Division"
          value={divisionId}
          onChange={(v) => setFilters(v, "")}
          options={[{ value: "", label: t("search.allDivisions") }, ...(divisions?.data || []).map((d) => ({ value: String(d.serialId), label: d.name, hint: d.bn_name }))]}
        />
      </Field>

      <div className="mx-2 hidden h-10 w-px bg-ink-100 md:block" />

      <Field icon={LuMapPin} label={t("search.district")}>
        <SelectField
          bare
          showSearch
          ariaLabel="District"
          value={cityId}
          onChange={(v) => setFilters(divisionId, v)}
          disabled={!divisionId || districtsLoading}
          options={[
            { value: "", label: divisionId ? t("search.allDistricts") : t("search.pickDivision") },
            ...(districts?.data || []).map((d) => ({ value: String(d.serialId), label: d.name, hint: d.bn_name })),
          ]}
        />
      </Field>

      <button type="submit" className="btn-brand m-1 h-14 rounded-[22px] px-8 text-base md:h-[60px]">
        <LuSearch className="h-5 w-5" />
        {t("search.submit")}
      </button>
    </form>
  );
};

export default SearchPanel;
