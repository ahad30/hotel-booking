import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  logout,
  useCurrentToken,
  useCurrentUser,
} from "../../redux/Feature/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import LoadingPage from "../../components/LoadingPage";
import { useGetUserQuery } from "../../redux/Feature/auth/authApi";

const ProtectedRoutes = ({ children, role }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { data, isLoading, isFetching, refetch } = useGetUserQuery();

  useEffect(() => {
    if (user && token) {
      refetch();
      setLoading(false);
    }
  }, [user, token, refetch]);

  // Redirect to login if no token or user
  if (!token || token == null || user == null) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }} // Pass the current path to redirect back after login
        replace
      />
    );
  }

  // Show loading spinner while fetching data
  if (isLoading || isFetching || loading) {
    return <LoadingPage />;
  }

  // Find the logged-in user from the fetched data
  const loggedInUser = data?.data?.find((u) => u.email === user.email);

  // Logout and redirect if the user role doesn't match
  if (!loggedInUser || loggedInUser.role !== role) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoutes;