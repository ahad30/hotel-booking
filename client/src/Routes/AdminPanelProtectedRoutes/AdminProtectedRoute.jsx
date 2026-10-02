/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  logout,
  useCurrentToken,
  useCurrentUser,
} from "../../redux/Feature/auth/authSlice";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import LoadingPage from "../../components/LoadingPage";
import { useGetUserQuery } from "../../redux/Feature/auth/authApi";


const AdminProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { data, isLoading, isFetching, refetch } =
  useGetUserQuery();
  // console.log(data)
  useEffect(() => {
    if (user && token) {
      refetch();
      setLoading(false);
    }
  }, [user, token, refetch]);



  if (!token || token == null || user == null) {
    return <Navigate to={"/admin-login"}></Navigate>;
  }
  if (isLoading || isFetching || loading) {
    return <LoadingPage></LoadingPage>;
  }
  const loggedInUser = data?.data?.find((u) => u.email === user.email);
  // console.log(loggedInUser)
  if (!loggedInUser || loggedInUser.role !== "admin") {
    dispatch(logout());
    return <Navigate to={"/admin-login"}></Navigate>;
  }

  return children;
};
export default AdminProtectedRoute;
