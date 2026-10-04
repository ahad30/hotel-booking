import { NavLink, useLocation } from "react-router-dom";
import { LuBell, LuCompass, LuHouse, LuLayoutDashboard, LuUser } from "react-icons/lu";
import { useAppSelector } from "../../redux/Hook/Hook";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useUnreadCount } from "./Navbar";

const customerTabs = [
  { to: "/", label: "Home", icon: LuHouse, end: true },
  { to: "/division", label: "Explore", icon: LuCompass },
  { to: "/notification", label: "Alerts", icon: LuBell, badge: true },
  { to: "/user/user-profile", label: "Profile", icon: LuUser },
];

// Customer pages are off-limits to admins, so they get the dashboard instead.
const adminTabs = [
  { to: "/", label: "Home", icon: LuHouse, end: true },
  { to: "/division", label: "Explore", icon: LuCompass },
  { to: "/admin/home", label: "Dashboard", icon: LuLayoutDashboard },
];

// Pages with their own sticky bottom action bar hide the tab bar.
const hiddenOn = ["/admin-login", "/login", "/register", "/checkout"];

// Mobile tab bar.
const BottomHeader = () => {
  const { pathname } = useLocation();
  const user = useAppSelector(useCurrentUser);
  const unread = useUnreadCount();
  const tabs = user?.role === "admin" ? adminTabs : customerTabs;

  if (hiddenOn.includes(pathname) || pathname.startsWith("/hotel-details")) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-ink-100 bg-white/90 shadow-lift backdrop-blur-xl lg:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className={`grid ${tabs.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
        {tabs.map(({ to, label, icon: Icon, end, badge }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                  isActive ? "text-brand-700" : "text-ink-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`relative grid h-8 w-12 place-items-center rounded-full transition ${isActive ? "bg-brand-100" : ""}`}>
                    <Icon className="h-5 w-5" />
                    {badge && unread > 0 && (
                      <span className="absolute right-1.5 top-0 grid h-4 min-w-[16px] place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </span>
                  {label}
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
