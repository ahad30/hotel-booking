import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ZFormTwo from "../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../components/Form/ZInputTwo";
import ZPhone from "../../../components/Form/ZPhone";
import { useLoginMutation } from "../../../redux/Feature/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook/Hook";
import { setUser, useCurrentToken, useCurrentUser } from "../../../redux/Feature/auth/authSlice";
import AuthShell from "../AuthShell";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);

  const [login, { isLoading, error, isError, isSuccess, data: loginData }] = useLoginMutation();

  useEffect(() => {
    if (token && user?.role === "admin") {
      navigate("/admin/home");
    } else if (token && user?.role === "user") {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (data) => {
    const { data: loginData } = await login(data);

    if (loginData?.success) {
      dispatch(setUser({ token: loginData.token, user: loginData.user }));
      if (loginData?.user?.role === "user") {
        navigate(location?.state?.from || "/");
      }
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to book rooms and manage your stays."
      footer={
        <>
          New to BEHB?{" "}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <ZFormTwo
        isLoading={isLoading}
        error={error}
        isError={isError}
        isSuccess={isSuccess}
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

export default Login;
