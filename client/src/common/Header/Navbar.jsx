import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LuBell, LuChevronDown, LuHeart, LuHistory, LuLayoutDashboard, LuLogOut, LuUser } from "react-icons/lu";
import { useSaved } from "../../utils/localCollections";
import Logo from "../../components/ui/Logo";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { logout, useCurrentToken, useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useGetUserNotificationsQuery } from "../../redux/Feature/Admin/notification/notificationApi";

export const useUnreadCount = () => {
  const user = useAppSelector(useCurrentUser);
  const { data } = useGetUserNotificationsQuery(user?.id, { skip: !user?.id || user?.role !== "user" });
  return data?.data?.filter((n) => !n.isRead).length || 0;
};

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/hotels", label: "Hotels" },
  { to: "/division", label: "Destinations" },
  { to: "/contact", label: "Contact" },
];

const SavedLink = ({ transparent }) => {
  const { ids } = useSaved();
  return (
    <Link
      to="/saved"
      aria-label={`Saved hotels${ids.length ? `, ${ids.length}` : ""}`}
      className={`relative hidden h-10 w-10 place-items-center rounded-full transition sm:grid ${
        transparent ? "bg-white/15 text-white hover:bg-white/25" : "bg-ink-100 text-ink-700 hover:bg-ink-200"
      }`}
    >
      <LuHeart className="h-[18px] w-[18px]" />
      {ids.length > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {ids.length}
        </span>
      )}
    </Link>
  );
};

const UserMenu = ({ user, onLogout, transparent }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const initial = (user?.name || "G").trim().charAt(0).toUpperCase();
  // Customer pages are off-limits to admins, so they get the dashboard instead.
  const items =
    user?.role === "admin"
      ? [{ to: "/admin/home", label: "Admin dashboard", icon: LuLayoutDashboard }]
      : [
          { to: "/user/overview", label: "My dashboard", icon: LuLayoutDashboard },
          { to: "/user/user-booking", label: "My bookings", icon: LuHistory },
          { to: "/user/user-profile", label: "Profile", icon: LuUser },
          { to: "/notification", label: "Notifications", icon: LuBell },
        ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-2 rounded-full p-1 pr-3 transition ${
          transparent ? "bg-white/15 text-white hover:bg-white/25" : "bg-ink-100 text-ink-800 hover:bg-ink-200"
        }`}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate text-sm font-semibold sm:block">{user?.name}</span>
        <LuChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] w-60 animate-fade-in overflow-hidden rounded-2xl border border-ink-100 bg-white p-2 shadow-lift"
        >
          <div className="px-3 pb-2 pt-1">
            <p className="truncate text-sm font-bold text-ink-950">{user?.name}</p>
            <p className="truncate text-xs text-ink-500">{user?.email || user?.phone}</p>
          </div>
          <div className="my-1 h-px bg-ink-100" />
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50 hover:text-ink-950"
            >
              <Icon className="h-4 w-4 text-ink-400" />
              {label}
            </Link>
          ))}
          <div className="my-1 h-px bg-ink-100" />
          <button
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <LuLogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const unread = useUnreadCount();
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have been signed out.");
    navigate("/login");
  };

  const isLoggedIn = Boolean(token && user);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-gradient-to-b from-ink-950/50 to-transparent"
          : "border-b border-ink-100/80 bg-white/85 shadow-soft backdrop-blur-xl"
      }`}
    >
      <nav className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo light={transparent} />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    transparent
                      ? isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                      : isActive
                      ? "bg-ink-100 text-ink-950"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          {isLoggedIn && user?.role === "user" && (
            <li>
              <NavLink
                to="/user/user-booking"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  transparent ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"
                }`}
              >
                My bookings
              </NavLink>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <SavedLink transparent={transparent} />

          {isLoggedIn && user?.role === "admin" && (
            <Link
              to="/admin/home"
              className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition sm:block ${
                transparent ? "bg-white/15 text-white hover:bg-white/25" : "bg-brand-50 text-brand-700 hover:bg-brand-100"
              }`}
            >
              Dashboard
            </Link>
          )}

          {isLoggedIn && user?.role === "user" && (
            <Link
              to="/notification"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className={`relative grid h-10 w-10 place-items-center rounded-full transition ${
                transparent ? "bg-white/15 text-white hover:bg-white/25" : "bg-ink-100 text-ink-700 hover:bg-ink-200"
              }`}
            >
              <LuBell className="h-[18px] w-[18px]" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          )}

          {isLoggedIn ? (
            <UserMenu user={user} onLogout={handleLogout} transparent={transparent} />
          ) : (
            <>
              <Link
                to="/login"
                className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition sm:block ${
                  transparent ? "text-white hover:bg-white/10" : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className={`btn px-5 py-2.5 text-sm ${
                  transparent ? "bg-white text-ink-950 hover:bg-ink-100" : "bg-ink-950 text-white hover:bg-brand-700"
                }`}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
