import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft, LuChevronRight, LuMapPin, LuRefreshCw, LuSearch, LuSearchX } from "react-icons/lu";

// Shared layout for the division → district → area → hotels browsing flow.
export const PlaceHeader = ({ step, title, subtitle, back }) => {
  const steps = ["Division", "District", "Area", "Hotels"];
  return (
    <div className="relative isolate overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
      <div className="absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-brand-200/50 blur-3xl" />
      <div className="container-x py-10 sm:py-14">
        {back && (
          <Link to={back.to} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition hover:text-ink-900">
            <LuArrowLeft className="h-4 w-4" /> {back.label}
          </Link>
        )}
        <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold" aria-label="Progress">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 ${
                  i === step ? "bg-ink-950 text-white" : i < step ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-400"
                }`}
              >
                {i + 1}. {s}
              </span>
              {i < steps.length - 1 && <LuChevronRight className="h-3.5 w-3.5 text-ink-300" />}
            </li>
          ))}
        </ol>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-ink-500">{subtitle}</p>}
      </div>
    </div>
  );
};

export const PlaceState = ({ type, onRetry, children }) => (
  <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
      <LuSearchX className="h-7 w-7" />
    </span>
    <p className="text-lg font-bold text-ink-900">{type === "error" ? "Something went wrong" : "Nothing here yet"}</p>
    <p className="max-w-sm text-sm text-ink-500">{children}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary mt-2">
        <LuRefreshCw className="h-4 w-4" /> Try again
      </button>
    )}
  </div>
);

// Searchable grid of place cards (districts or areas).
const PlaceList = ({ items = [], isLoading, isError, onRetry, linkFor, noun }) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((p) => p.name?.toLowerCase().includes(q) || p.bn_name?.includes(query.trim())) : items;
  }, [items, query]);

  if (isError) return <PlaceState type="error" onRetry={onRetry}>We couldn&apos;t load the {noun}s. Check your connection and try again.</PlaceState>;

  return (
    <>
      {items.length > 6 && (
        <label className="relative mb-6 block max-w-md">
          <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${noun}s`}
            aria-label={`Search ${noun}s`}
            className="w-full rounded-full border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
        </label>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-[76px] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <PlaceState>{query ? `No ${noun} matches “${query}”.` : `No ${noun}s have been added here yet.`}</PlaceState>
      ) : (
        <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <li key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
              <Link
                to={linkFor(p)}
                className="group flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-gradient group-hover:text-white">
                  <LuMapPin className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-ink-900">{p.name}</span>
                  {p.bn_name && <span className="block truncate text-xs text-ink-400">{p.bn_name}</span>}
                </span>
                <LuChevronRight className="h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PlaceList;
