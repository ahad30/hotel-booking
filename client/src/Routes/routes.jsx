import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import ErrorPageDashboard from "../Pages/Error/ErrorPageDashboard";
import { routesGenerator } from "../utils/routesGenerator";
import { adminRoutes } from "./Admin.Routes";
import ErrorPage from "../common/ErrorPage/ErrorPage";
import DashboardLayout from "../Layouts/Dashboard/DashboardLayout";
import MainLayout from "../Layouts/Home/MainLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import AdminProtectedRoute from "./AdminPanelProtectedRoutes/AdminProtectedRoute";
import Checkout from "../Pages/Checkout/Checkout";
import ProtectedRoutes from "./UserProtectedRoutes/ProtectedRoutes";
import Success from "../Pages/Success/Success";
import PaymentError from "../Pages/Error/PaymentError";
import Verify from "../Pages/Verify/Verify";
import HotelDetails from "../Pages/Home/HotelDetails/HotelDetails";
import { CustomerRoutes } from "./Customer.Routes";
import CustomerDashboardLayout from "../Layouts/Dashboard/CustomerDashboardLayout";
import Notification from "../Pages/Notification/Notification";
import AdminLogin from "../Pages/Auth/AdminLogin/AdminLogin";
import HomeDivision from "../Pages/Home/Home-Division/HomeDivision";
import HomeDivisionDetails from "../Pages/Home/Home-Division/HomeDivisionDetails";
import Division from "../Pages/Division/Division";
import District from "../Pages/District/District";
import Area from "../Pages/Area/Area";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import AreaByHotel from "../Pages/Home/AllHotel/AreaByHotel";



export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home-division",
        element: <HomeDivision/>,
      },
      {
        path: "/home-division/:divisionId",
        element: <HomeDivisionDetails/>,
      
      },
      {
        path:"/division",
        element:<Division/>   
      },
      {
        path:"/district/:divisionId",
        element:<District/>   
      },
      {
        path:"/area/:districtId",
        element:<Area/>   
      },
      {
        path:"/hotel/:areaId",
        element:<AreaByHotel/>   
      },
      {
        path: "/notification",
        element: 
      <ProtectedRoutes role={"user"}>
        <Notification/>
      </ProtectedRoutes>
      },
      
    
      {
        path: "/checkout",
        element: 
      <ProtectedRoutes role={"user"}>
        <Checkout/>
      </ProtectedRoutes>
      },
      {
        path: "/success",
        element: 
      <ProtectedRoutes role={"user"}>
        <Success/>
      </ProtectedRoutes>
      },
      {
        path: "/cancel",
        element: 
      // <ProtectedRoutes role={"user"}>
        <PaymentError/>
      // </ProtectedRoutes>
      },
      {
        path: "/hotel-details/:id",
        element: <HotelDetails/>,
       
      },
    
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: "/admin-login",
        element: <AdminLogin/>,
      },
      {
        path: "/register",
        element: <Register/>,
      },
      {
        path: "/verify/:token",
        element: <Verify/>,
      },
      {
        path:"/privacy-policy",
        element:<PrivacyPolicy/>
      }
    ],
  },
  {
    path: "/admin",
    element: (
     <AdminProtectedRoute>
        <DashboardLayout />
     </AdminProtectedRoute>
 
    ),
    errorElement: <ErrorPageDashboard />,
    children: routesGenerator(adminRoutes),
  },
 
  {
    path: "/user",
    children: routesGenerator(CustomerRoutes),
    element: (
      <ProtectedRoutes role="user">
        <CustomerDashboardLayout />
      </ProtectedRoutes>
    ),
  },
]);
