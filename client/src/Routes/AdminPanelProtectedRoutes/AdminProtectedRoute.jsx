import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { logout, useCurrentToken, useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import LoadingPage from "../../components/LoadingPage";
import SessionCheckFailed from "../SessionCheckFailed";
import { useGetMeQuery } from "../../redux/Feature/auth/authApi";

const AdminProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { data, error, isLoading, isFetching, isError, refetch } = useGetMeQuery(undefined, { skip: !token });

  // The API resolves the account from the token; a mismatch means a stale session.
  const loggedInUser = data?.data && user?.id && data.data.id === user.id ? data.data : null;
  const accountMissing =
    (Boolean(data?.data) && !isFetching && !loading && !loggedInUser) || error?.status === 404 || error?.status === 401;

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
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isLoading || isFetching || loading) {
    return <LoadingPage />;
  }

  // The account check couldn't reach the API (down, offline): keep the session.
  if ((isError && !accountMissing) || (!data?.data && !accountMissing)) {
    return <SessionCheckFailed onRetry={refetch} />;
  }

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  // A customer opening the dashboard is sent home, not logged out.
  if (loggedInUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
