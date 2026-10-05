import { lazy } from "react";
import { MdNotificationImportant } from "react-icons/md";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TfiLayoutSlider } from "react-icons/tfi";
const DashboardStatistics = lazy(() => import("../Pages/Dashboard/Admin/DashboardStatistics/DashboardStatistics"));
import { AiFillBoxPlot } from "react-icons/ai";
const Sliders = lazy(() => import("../Pages/Dashboard/Admin/Slider/Sliders"));
import { CiShop } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
const Users = lazy(() => import("../Pages/Dashboard/Admin/Customers/Users"));
const AddUser = lazy(() => import("../Pages/Dashboard/Admin/Customers/AddUser/AddUser"));
// Admins share the account profile page (personal details + password).
const EditAdminProfile = lazy(() => import("../Pages/Dashboard/User/EditProfile/EditProfile"));
const Hotel = lazy(() => import("../Pages/Dashboard/Admin/Hotel/Hotel"));
const AddHotel = lazy(() => import("../Pages/Dashboard/Admin/Hotel/AddHotel"));
const EditHotel = lazy(() => import("../Pages/Dashboard/Admin/Hotel/EditHotel"));
const ViewHotel = lazy(() => import("../Pages/Dashboard/Admin/Hotel/ViewHotel"));
const EditRoom = lazy(() => import("../Pages/Dashboard/Admin/Room/EditRoom"));
const Bookings = lazy(() => import("../Pages/Dashboard/Admin/Bookings/Bookings"));
const AddNotification = lazy(() => import("../Pages/Dashboard/Admin/AddNotification/AddNotification"));
const Area = lazy(() => import("../Pages/Dashboard/Admin/Area/Area"));
const Contact = lazy(() => import("../Pages/Dashboard/Admin/Contact/Contact"));
const Subscription = lazy(() => import("../Pages/Dashboard/Admin/Subscription/Subscription"));


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
    path: "messages",
    element: <Contact />,
  },
  {
    path: "subscribers",
    element: <Subscription />,
  },
  {
    path: "users/add-user",
    element: <AddUser/>,
  
  },
];
