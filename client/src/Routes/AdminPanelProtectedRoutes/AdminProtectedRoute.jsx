import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { logout, useCurrentToken, useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import LoadingPage from "../../components/LoadingPage";
import SessionCheckFailed from "../SessionCheckFailed";
import { useGetUserQuery } from "../../redux/Feature/auth/authApi";

const AdminProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { data, isLoading, isFetching, isError, refetch } = useGetUserQuery();

  // Matched by id: email is optional on accounts, so it can't identify a user.
  const loggedInUser = data?.data?.find((u) => u.id === user?.id);
  const accountMissing = Boolean(data?.data) && !isFetching && !loading && !loggedInUser;

  useEffect(() => {
    if (user && token) {
      refetch();
      setLoading(false);
    }
  }, [user, token, refetch]);

  // Only a deleted or unknown account ends the session.
  useEffect(() => {
    if (accountMissing) dispatch(logout());
  }, [accountMissing, dispatch]);

  if (!token || user == null) {
    return <Navigate to="/admin-login" replace />;
  }

  if (isLoading || isFetching || loading) {
    return <LoadingPage />;
  }

  // The user list couldn't be loaded (API down, offline): keep the session.
  if (isError || !data?.data) {
    return <SessionCheckFailed onRetry={refetch} />;
  }

  if (!loggedInUser) {
    return <Navigate to="/admin-login" replace />;
  }

  // A customer opening the dashboard is sent home, not logged out.
  if (loggedInUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
