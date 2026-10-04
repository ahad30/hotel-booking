import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Layouts/Home/MainLayout";
import Home from "../Pages/Home/Home";
import ErrorPage from "../common/ErrorPage/ErrorPage";
import PageLoader from "../components/ui/PageLoader";
import { routesGenerator } from "../utils/routesGenerator";
import { adminRoutes } from "./Admin.Routes";
import { CustomerRoutes } from "./Customer.Routes";
import AdminProtectedRoute from "./AdminPanelProtectedRoutes/AdminProtectedRoute";
import ProtectedRoutes from "./UserProtectedRoutes/ProtectedRoutes";

// Home ships in the main bundle so the first paint needs no extra request.
// Everything else is split into its own chunk and fetched on navigation.
const HotelDetails = lazy(() => import("../Pages/Home/HotelDetails/HotelDetails"));
const Checkout = lazy(() => import("../Pages/Checkout/Checkout"));
const Success = lazy(() => import("../Pages/Success/Success"));
const PaymentError = lazy(() => import("../Pages/Error/PaymentError"));
const Login = lazy(() => import("../Pages/Auth/Login/Login"));
const Register = lazy(() => import("../Pages/Auth/Register/Register"));
const Verify = lazy(() => import("../Pages/Verify/Verify"));
const Notification = lazy(() => import("../Pages/Notification/Notification"));
const HomeDivision = lazy(() => import("../Pages/Home/Home-Division/HomeDivision"));
const HomeDivisionDetails = lazy(() => import("../Pages/Home/Home-Division/HomeDivisionDetails"));
const Division = lazy(() => import("../Pages/Division/Division"));
const District = lazy(() => import("../Pages/District/District"));
const Area = lazy(() => import("../Pages/Area/Area"));
const AreaByHotel = lazy(() => import("../Pages/Home/AllHotel/AreaByHotel"));
const PrivacyPolicy = lazy(() => import("../Pages/PrivacyPolicy/PrivacyPolicy"));
const DashboardLayout = lazy(() => import("../Layouts/Dashboard/DashboardLayout"));
const CustomerDashboardLayout = lazy(() => import("../Layouts/Dashboard/CustomerDashboardLayout"));
const ErrorPageDashboard = lazy(() => import("../Pages/Error/ErrorPageDashboard"));

const withSuspense = (element) => <Suspense fallback={<PageLoader fullScreen />}>{element}</Suspense>;

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home-division", element: <HomeDivision /> },
      { path: "/home-division/:divisionId", element: <HomeDivisionDetails /> },
      { path: "/division", element: <Division /> },
      { path: "/district/:divisionId", element: <District /> },
      { path: "/area/:districtId", element: <Area /> },
      { path: "/hotel/:areaId", element: <AreaByHotel /> },
      {
        path: "/notification",
        element: (
          <ProtectedRoutes role={"user"}>
            <Notification />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoutes role={"user"}>
            <Checkout />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/success",
        element: (
          <ProtectedRoutes role={"user"}>
            <Success />
          </ProtectedRoutes>
        ),
      },
      { path: "/cancel", element: <PaymentError /> },
      { path: "/hotel-details/:id", element: <HotelDetails /> },
      { path: "/login", element: <Login /> },
      // Admins and customers share one login page; old links still work.
      { path: "/admin-login", element: <Navigate to="/login" replace /> },
      { path: "/register", element: <Register /> },
      { path: "/verify/:token", element: <Verify /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
    ],
  },
  {
    path: "/admin",
    element: withSuspense(
      <AdminProtectedRoute>
        <DashboardLayout />
      </AdminProtectedRoute>
    ),
    errorElement: withSuspense(<ErrorPageDashboard />),
    children: routesGenerator(adminRoutes),
  },
  {
    path: "/user",
    children: routesGenerator(CustomerRoutes),
    element: withSuspense(
      <ProtectedRoutes role="user">
        <CustomerDashboardLayout />
      </ProtectedRoutes>
    ),
  },
]);
