import {
  LuBedDouble,
  LuBell,
  LuBuilding2,
  LuCalendarCheck,
  LuImages,
  LuInbox,
  LuLayoutDashboard,
  LuMail,
  LuMapPinned,
  LuUser,
  LuUsers,
} from "react-icons/lu";
import DashShell from "./DashShell";

const groups = [
  { title: "Overview", items: [{ to: "/admin/home", label: "Dashboard", icon: LuLayoutDashboard }] },
  {
    title: "Manage",
    items: [
      { to: "/admin/hotels", label: "Hotels", icon: LuBuilding2 },
      { to: "/admin/areas", label: "Areas", icon: LuMapPinned },
      { to: "/admin/bookings", label: "Bookings", icon: LuCalendarCheck },
      { to: "/admin/users", label: "Users", icon: LuUsers },
    ],
  },
  {
    title: "Content",
    items: [
      { to: "/admin/sliders", label: "Offer sliders", icon: LuImages },
      { to: "/admin/notification", label: "Notifications", icon: LuBell },
    ],
  },
  {
    title: "Inbox",
    items: [
      { to: "/admin/messages", label: "Messages", icon: LuInbox },
      { to: "/admin/subscribers", label: "Subscribers", icon: LuMail },
    ],
  },
];

const accountLinks = [
  { to: "/admin/profile", label: "Profile", icon: LuUser },
  { to: "/hotels", label: "Browse hotels", icon: LuBedDouble },
];

const DashboardLayout = () => <DashShell groups={groups} subtitle="Admin" accountLinks={accountLinks} />;

export default DashboardLayout;
