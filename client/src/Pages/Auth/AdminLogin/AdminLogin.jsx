import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import ZFormTwo from '../../../components/Form/ZFormTwo';
import { useLoginMutation } from '../../../redux/Feature/auth/authApi';
import ZInputTwo from '../../../components/Form/ZInputTwo';
import { useAppDispatch, useAppSelector } from '../../../redux/Hook/Hook';
import { setUser, useCurrentToken, useCurrentUser } from '../../../redux/Feature/auth/authSlice';
import ZPhone from '../../../components/Form/ZPhone';
import AuthShell from '../AuthShell';

     
const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
 const dispatch = useAppDispatch();
 const user = useAppSelector(useCurrentUser);
 const token = useAppSelector(useCurrentToken);

  const [
    login,
    {
      isLoading: lIsloading,
      error,
      isError: lIsError,
      isSuccess: lIsSuccess,
      data: loginData,
    },
  ] = useLoginMutation();
//  console.log(loginData)


  useEffect(() => {
    if (token && user?.role === "admin") {
      navigate("/admin/home")
    }
    else if (token && user?.role === "user"){
      navigate("/")
    }
  }, []);


  
  const handleSubmit = async (data) => {
    const { data: loginData } = await login(data);

    if (loginData?.success) {
      dispatch(setUser({ token: loginData.token, user: loginData.user }));
      if (loginData?.user?.role === "admin") {
        localStorage.removeItem("dropDown");
        navigate(location?.state?.from || "/admin/home");
      }
    }
  };
  return (
    <AuthShell title="Admin sign in" subtitle="Manage hotels, rooms, bookings and guests.">
      <ZFormTwo
        isLoading={lIsloading}
        error={error}
        isError={lIsError}
        isSuccess={lIsSuccess}
        submit={handleSubmit}
        data={loginData}
        buttonName={"Log in"}
      >
        <ZPhone label={"Phone number"} name={"phone"} />
        <ZInputTwo required={1} name="password" type="password" label={"Password"} placeholder={"Enter your password"} />
      </ZFormTwo>
    </AuthShell>
  );
};

export default AdminLogin;