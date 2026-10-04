import { LuBell, LuCompass, LuHeart, LuHistory, LuLayoutDashboard, LuUser } from "react-icons/lu";
import DashShell from "./DashShell";

const groups = [
  {
    title: "My account",
    items: [
      { to: "/user/overview", label: "Overview", icon: LuLayoutDashboard },
      { to: "/user/user-booking", label: "My bookings", icon: LuHistory },
      { to: "/user/user-profile", label: "Profile & security", icon: LuUser },
    ],
  },
  {
    title: "Explore",
    items: [
      { to: "/hotels", label: "Find hotels", icon: LuCompass },
      { to: "/saved", label: "Saved hotels", icon: LuHeart },
      { to: "/notification", label: "Notifications", icon: LuBell },
    ],
  },
];

const accountLinks = [
  { to: "/user/user-profile", label: "Profile & security", icon: LuUser },
  { to: "/user/user-booking", label: "My bookings", icon: LuHistory },
];

const CustomerDashboardLayout = () => <DashShell groups={groups} subtitle="My account" accountLinks={accountLinks} />;

export default CustomerDashboardLayout;
