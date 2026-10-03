import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LuMap, LuMapPin, LuSearch } from "react-icons/lu";
import { useGetDistrictsByDivisionQuery, useGetDivisionsQuery } from "../../../redux/Feature/User/place/placeApi";

const Field = ({ icon: Icon, label, children }) => (
  <label className="group flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-ink-50 focus-within:bg-ink-50">
    <Icon className="h-5 w-5 shrink-0 text-brand-600" />
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{label}</span>
      {children}
    </span>
  </label>
);

const selectClass =
  "w-full cursor-pointer appearance-none truncate bg-transparent text-sm font-semibold text-ink-900 outline-none disabled:cursor-not-allowed disabled:text-ink-300";

// Hero search: hotel name (debounced) plus division and district filters.
// Writes into the layout's outlet context, which the hotel list reads.
const SearchPanel = () => {
  const { searchQuery, setSearchQuery, divisionId, cityId, setFilters } = useOutletContext();
  const [text, setText] = useState(searchQuery);

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
      <Field icon={LuSearch} label="Hotel">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search by hotel name"
          aria-label="Search by hotel name"
          className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none placeholder:font-medium placeholder:text-ink-400"
        />
      </Field>

      <div className="mx-2 hidden h-10 w-px bg-ink-100 md:block" />

      <Field icon={LuMap} label="Division">
        <select
          value={divisionId}
          onChange={(e) => setFilters(e.target.value, "")}
          aria-label="Division"
          className={selectClass}
        >
          <option value="">All divisions</option>
          {divisions?.data?.map((d) => (
            <option key={d.id} value={String(d.serialId)}>
              {d.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="mx-2 hidden h-10 w-px bg-ink-100 md:block" />

      <Field icon={LuMapPin} label="District">
        <select
          value={cityId}
          onChange={(e) => setFilters(divisionId, e.target.value)}
          disabled={!divisionId || districtsLoading}
          aria-label="District"
          className={selectClass}
        >
          <option value="">{divisionId ? "All districts" : "Pick a division first"}</option>
          {districts?.data?.map((d) => (
            <option key={d.id} value={String(d.serialId)}>
              {d.name}
            </option>
          ))}
        </select>
      </Field>

      <button type="submit" className="btn-brand m-1 h-14 rounded-[22px] px-8 text-base md:h-[60px]">
        <LuSearch className="h-5 w-5" />
        Search
      </button>
    </form>
  );
};

export default SearchPanel;
