import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ZFormTwo from "../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../components/Form/ZInputTwo";
import ZPhone from "../../../components/Form/ZPhone";
import { useLoginMutation } from "../../../redux/Feature/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook/Hook";
import { setUser, useCurrentToken, useCurrentUser } from "../../../redux/Feature/auth/authSlice";
import AuthShell from "../AuthShell";
import { useI18n } from "../../../i18n/LanguageProvider";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { t } = useI18n();

  const [login, { isLoading, error, isError, isSuccess, data: loginData }] = useLoginMutation();

  // One login page for every role: each lands in its own area, or back on the
  // page that sent them here if that page belongs to their role.
  const destinationFor = (role) => {
    const from = location?.state?.from;
    const isAdminPath = from?.startsWith("/admin");
    if (role === "admin") return isAdminPath ? from : "/admin/home";
    return from && !isAdminPath ? from : "/";
  };

  useEffect(() => {
    if (token && user?.role) navigate(destinationFor(user.role), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (data) => {
    const { data: loginData } = await login(data);

    if (loginData?.success) {
      dispatch(setUser({ token: loginData.token, user: loginData.user }));
      navigate(destinationFor(loginData?.user?.role), { replace: true });
    }
  };

  return (
    <AuthShell
      title={t("auth.welcome")}
      subtitle={t("auth.loginSubtitle")}
      footer={
        <>
          {t("auth.newHere")}{" "}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            {t("auth.createAccount")}
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
