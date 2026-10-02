import { MdNotificationImportant } from "react-icons/md";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TfiLayoutSlider } from "react-icons/tfi";
import DashboardStatistics from "../Pages/Dashboard/Admin/DashboardStatistics/DashboardStatistics";
import { AiFillBoxPlot } from "react-icons/ai";
import Sliders from "../Pages/Dashboard/Admin/Slider/Sliders";
import { CiShop } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
import Users from "../Pages/Dashboard/Admin/Customers/Users";
import AddUser from "../Pages/Dashboard/Admin/Customers/AddUser/AddUser";
import EditAdminProfile from "../Pages/Dashboard/Admin/Profile/EditAdminProfile";
import Hotel from "../Pages/Dashboard/Admin/Hotel/Hotel";
import AddHotel from "../Pages/Dashboard/Admin/Hotel/AddHotel";
import EditHotel from "../Pages/Dashboard/Admin/Hotel/EditHotel";
import ViewHotel from "../Pages/Dashboard/Admin/Hotel/ViewHotel";
import EditRoom from "../Pages/Dashboard/Admin/Room/EditRoom";
import Bookings from "../Pages/Dashboard/Admin/Bookings/Bookings";
import AddNotification from "../Pages/Dashboard/Admin/AddNotification/AddNotification";
import Area from "../Pages/Dashboard/Admin/Area/Area";
import EditSlider from "../Pages/Dashboard/Admin/Slider/EditSlider";


export const adminRoutes = [
  {
    path: "home",
    label: "Dashboard",
    element: <DashboardStatistics />,
    icon: <MdOutlineDashboardCustomize size={20}></MdOutlineDashboardCustomize>,
    permissionName: "view dashboard",
  },
  {
    path: "profile",
    element: <EditAdminProfile/>,
  },
  {
    label: "Hotel Management",
    icon: <AiFillBoxPlot size={20} />,
    children: [
      {
        path: "areas",
        label: "Areas",
        element: <Area/>,
        permissionName: "view area",
      },
      {
        path: "hotels",
        label: "Hotels",
        element: <Hotel></Hotel>,
        permissionName: "view hotel",
      },
    ],
  },
  {
    path: "bookings",
    label: "Bookings",
    element: <Bookings/>,
    icon: <CiShop size={20}/>,
  },
  {
    path: "users",
    label: "Users",
    element: <Users />,
    icon: <FaUsers size={20}/>,
  },
  {
    path: "add-hotel",
    element: <AddHotel></AddHotel>,
  },
  {
    path: "edit-hotel/:id",
    element: <EditHotel></EditHotel>,
  },
  {
    path: "view-hotel-details/:id",
    element: <ViewHotel></ViewHotel>,
  },
  {
    path: "edit-room/:id",
    element: <EditRoom></EditRoom>,
  },

  {
    path: "sliders",
    label: "Sliders",
    element: <Sliders></Sliders>,
    icon: <TfiLayoutSlider size={20}></TfiLayoutSlider>,
    permissionName: "view slider",
  },
  {
    path: "notification",
    label: "Notification",
    element: <AddNotification/>,
    icon: <MdNotificationImportant  size={20}/>,
    permissionName: "view notification",
  },
  {
    path: "users/add-user",
    element: <AddUser/>,
  
  },
];
