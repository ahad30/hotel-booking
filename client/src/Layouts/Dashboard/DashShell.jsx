import { Suspense, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { toast } from "sonner";
import { LuChevronDown, LuExternalLink, LuLogOut, LuMenu, LuPanelLeftClose, LuPanelLeftOpen, LuX } from "react-icons/lu";
import icon from "../../assets/icon.png";
import PageLoader from "../../components/ui/PageLoader";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { logout, useCurrentUser } from "../../redux/Feature/auth/authSlice";

// Ant Design tokens matching the site's design system, so every existing
// dashboard table, form and modal picks up the new look.
const antTheme = {
  token: {
    colorPrimary: "#7c3aed",
    colorLink: "#6d28d9",
    borderRadius: 12,
    fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    colorBorder: "#d5dae2",
    colorTextBase: "#111827",
  },
  components: {
    Button: { controlHeight: 40, fontWeight: 600 },
    Input: { controlHeight: 42 },
    Select: { controlHeight: 42 },
    Table: { headerBorderRadius: 12 },
    Modal: { borderRadiusLG: 24 },
  },
};

const COLLAPSE_KEY = "behb:dash-collapsed";

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};

const Brand = ({ collapsed, subtitle }) => (
  <Link to="/" className="flex items-center gap-3 px-2" aria-label="BEHB home">
    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white">
      <img src={icon} alt="" className="h-9 w-9 object-contain" />
    </span>
    {!collapsed && (
      <span className="leading-none">
        <span className="block text-lg font-extrabold text-white">BEHB</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[.22em] text-ink-400">{subtitle}</span>
      </span>
    )}
  </Link>
);

const NavItems = ({ groups, collapsed, onNavigate }) => (
  <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6 no-scrollbar" aria-label="Dashboard">
    {groups.map((group) => (
      <div key={group.title}>
        {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-ink-500">{group.title}</p>}
        <ul className="space-y-1">
          {group.items.map(({ to, label, icon: Icon, badge, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                    collapsed ? "justify-center" : ""
                  } ${isActive ? "bg-white/10 text-white" : "text-ink-400 hover:bg-white/5 hover:text-white"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-gradient" />}
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-cyan-300" : ""}`} />
                    {!collapsed && <span className="flex-1 truncate">{label}</span>}
                    {!collapsed && badge > 0 && (
                      <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">{badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </nav>
);

const AccountMenu = ({ user, links, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full bg-ink-100 p-1 pr-3 text-ink-800 transition hover:bg-ink-200"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
          {(user?.name || "U").trim().charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-[140px] truncate text-sm font-semibold sm:block">{user?.name}</span>
        <LuChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 animate-fade-in rounded-2xl border border-ink-100 bg-white p-2 shadow-lift">
          <div className="px-3 pb-2 pt-1">
            <p className="truncate text-sm font-bold text-ink-950">{user?.name}</p>
            <p className="truncate text-xs capitalize text-ink-500">{user?.role === "admin" ? "Administrator" : "Guest account"}</p>
          </div>
          <div className="my-1 h-px bg-ink-100" />
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              <Icon className="h-4 w-4 text-ink-400" /> {label}
            </Link>
          ))}
          <div className="my-1 h-px bg-ink-100" />
          <button role="menuitem" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
            <LuLogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
};

// Shared frame for the admin and customer dashboards: collapsible sidebar
// (drawer on phones), top bar with account menu, themed content area.
const DashShell = ({ groups, subtitle, accountLinks = [] }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAppSelector(useCurrentUser);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* preference just won't persist */
    }
  }, [collapsed]);

  const current = groups.flatMap((g) => g.items).find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have been signed out.");
    navigate("/login");
  };

  return (
    <ConfigProvider theme={antTheme}>
      <div className="flex h-screen overflow-hidden bg-ink-50">
        {/* Desktop sidebar */}
        <aside className={`relative hidden shrink-0 flex-col bg-ink-950 transition-all duration-300 lg:flex ${collapsed ? "w-[84px]" : "w-72"}`}>
          <div className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
          <div className={`relative flex h-[72px] items-center ${collapsed ? "justify-center" : "px-4"}`}>
            <Brand collapsed={collapsed} subtitle={subtitle} />
          </div>
          <NavItems groups={groups} collapsed={collapsed} />
          <div className="relative border-t border-white/10 p-3">
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-ink-400 transition hover:bg-white/5 hover:text-white ${collapsed ? "justify-center" : ""}`}
            >
              {collapsed ? <LuPanelLeftOpen className="h-5 w-5" /> : <LuPanelLeftClose className="h-5 w-5" />}
              {!collapsed && "Collapse"}
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <div className="absolute inset-0 animate-fade-in bg-ink-950/60 backdrop-blur-sm" onClick={() => setDrawer(false)} />
            <aside className="relative flex h-full w-72 animate-fade-in flex-col bg-ink-950">
              <div className="flex h-[72px] items-center justify-between px-4">
                <Brand subtitle={subtitle} />
                <button onClick={() => setDrawer(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full text-ink-400 hover:bg-white/10 hover:text-white">
                  <LuX className="h-5 w-5" />
                </button>
              </div>
              <NavItems groups={groups} onNavigate={() => setDrawer(false)} />
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-ink-100 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => setDrawer(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-ink-700 lg:hidden">
                <LuMenu className="h-5 w-5" />
              </button>
              <p className="truncate text-base font-bold text-ink-950">{current?.label || "Dashboard"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="btn-ghost hidden py-2 sm:inline-flex">
                <LuExternalLink className="h-4 w-4" /> View site
              </Link>
              <AccountMenu user={user} links={accountLinks} onLogout={handleLogout} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default DashShell;
