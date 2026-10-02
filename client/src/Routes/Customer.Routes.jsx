import { TbBrandBooking } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";
import EditProfile from "../Pages/Dashboard/User/EditProfile/EditProfile";
import BookingHistory from "../Pages/Dashboard/User/BookingHistory/BookingHistory";

export const CustomerRoutes = [
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
