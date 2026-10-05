import { Link, useLocation } from "react-router-dom";
import { LuArrowRight, LuX } from "react-icons/lu";
import { COMPARE_LIMIT, useCompare } from "../../utils/localCollections";
import { useAllHotels } from "../../utils/useAllHotels";

// Floating bar listing hotels picked for comparison, shown on every public page.
const CompareTray = () => {
  const { pathname } = useLocation();
  const compare = useCompare();
  const { byId } = useAllHotels();

  const picked = compare.ids.map((id) => byId.get(id)).filter(Boolean);
  if (!picked.length || pathname === "/compare" || pathname === "/checkout") return null;

  return (
    <div className={`compare-tray-offset fixed inset-x-3 z-40 mx-auto max-w-3xl animate-fade-up ${pathname.startsWith("/hotel-details") ? "hidden lg:block" : ""}`}>
      <div className="flex items-center gap-3 rounded-3xl border border-ink-800 bg-ink-950 p-3 pl-4 text-white shadow-lift">
        <div className="hidden text-sm font-semibold sm:block">
          Compare <span className="text-ink-400">({picked.length}/{COMPARE_LIMIT})</span>
        </div>
        <ul className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
          {picked.map((h) => (
            <li key={h.id} className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-2">
              <img src={h.image} alt="" className="h-7 w-7 rounded-full object-cover" />
              <span className="max-w-[110px] truncate text-xs font-semibold">{h.name}</span>
              <button onClick={() => compare.remove(h.id)} aria-label={`Remove ${h.name} from compare`} className="rounded-full p-0.5 text-ink-400 hover:bg-white/10 hover:text-white">
                <LuX className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <Link
          to="/compare"
          className={`btn shrink-0 px-4 py-2.5 text-sm ${picked.length > 1 ? "bg-white text-ink-950 hover:bg-ink-100" : "pointer-events-none bg-white/20 text-white/60"}`}
          aria-disabled={picked.length < 2}
        >
          {picked.length > 1 ? "Compare" : "Add 1 more"} <LuArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default CompareTray;
