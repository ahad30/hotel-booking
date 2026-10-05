import { NavLink, useLocation } from "react-router-dom";
import { LuBell, LuCompass, LuHeart, LuHouse, LuLayoutDashboard, LuUser } from "react-icons/lu";
import { useAppSelector } from "../../redux/Hook/Hook";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useUnreadCount } from "./Navbar";
import { useI18n } from "../../i18n/LanguageProvider";

const customerTabs = [
  { to: "/", label: "tabs.home", icon: LuHouse, end: true },
  { to: "/hotels", label: "tabs.explore", icon: LuCompass },
  { to: "/saved", label: "tabs.saved", icon: LuHeart },
  { to: "/notification", label: "tabs.alerts", icon: LuBell, badge: true },
  { to: "/user/overview", label: "tabs.account", icon: LuUser },
];

// Customer pages are off-limits to admins, so they get the dashboard instead.
const adminTabs = [
  { to: "/", label: "tabs.home", icon: LuHouse, end: true },
  { to: "/hotels", label: "tabs.explore", icon: LuCompass },
  { to: "/saved", label: "tabs.saved", icon: LuHeart },
  { to: "/admin/home", label: "tabs.dashboard", icon: LuLayoutDashboard },
];

// Pages with their own sticky bottom action bar hide the tab bar.
const hiddenOn = ["/login", "/register", "/checkout"];

// Mobile tab bar.
const BottomHeader = () => {
  const { pathname } = useLocation();
  const user = useAppSelector(useCurrentUser);
  const unread = useUnreadCount();
  const { t } = useI18n();
  const tabs = user?.role === "admin" ? adminTabs : customerTabs;

  if (hiddenOn.includes(pathname) || pathname.startsWith("/hotel-details")) return null;

  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-3 z-50 rounded-3xl border border-ink-100 bg-white shadow-lift lg:hidden"
    >
      <ul className={`grid ${tabs.length === 4 ? "grid-cols-4" : "grid-cols-5"}`}>
        {tabs.map(({ to, label, icon: Icon, end, badge }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                  isActive ? "text-brand-700" : "text-ink-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`relative grid h-8 w-11 place-items-center rounded-full transition ${isActive ? "bg-brand-100" : ""}`}>
                    <Icon className="h-5 w-5" />
                    {badge && unread > 0 && (
                      <span className="absolute right-1.5 top-0 grid h-4 min-w-[16px] place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </span>
                  {t(label)}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomHeader;
