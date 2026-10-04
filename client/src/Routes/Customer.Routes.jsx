import { lazy } from "react";
import { TbBrandBooking } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";
const EditProfile = lazy(() => import("../Pages/Dashboard/User/EditProfile/EditProfile"));
const BookingHistory = lazy(() => import("../Pages/Dashboard/User/BookingHistory/BookingHistory"));
const Overview = lazy(() => import("../Pages/Dashboard/User/Overview/Overview"));

export const CustomerRoutes = [
  {
    path: "/user/overview",
    label: "Overview",
    element: <Overview />,
  },
  {
    path: "/user/user-profile",
    label: "Profile",
    element: <EditProfile />,
    icon: <AiOutlineUser />,
  },
  {
    path: "/user/user-booking",
    label: "Bookings",
    element: <BookingHistory />,
    icon: <TbBrandBooking />,
  },
 
];
