import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuMailCheck } from "react-icons/lu";
import ZInputTwo from "../../../components/Form/ZInputTwo";
import ZFormTwo from "../../../components/Form/ZFormTwo";
import ZEmail from "../../../components/Form/ZEmail";
import ZPhone from "../../../components/Form/ZPhone";
import { useAppSelector } from "../../../redux/Hook/Hook";
import { useCurrentToken, useCurrentUser } from "../../../redux/Feature/auth/authSlice";
import { useRegisterMutation } from "../../../redux/Feature/auth/authApi";
import Modal from "../../../components/ui/Modal";
import AuthShell from "../AuthShell";

const Register = () => {
  const navigate = useNavigate();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const [showModal, setShowModal] = useState(false);

  const [register, { isLoading, error, isError, isSuccess, data: rData }] = useRegisterMutation();

  useEffect(() => {
    if (token && user?.role === "admin") {
      navigate("/admin/home");
    } else if (token && user?.role === "user") {
      navigate("/");
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (isSuccess) setShowModal(true);
  }, [isSuccess]);

  const handleSubmit = (data) => {
    register({ ...data, role: "user" });
  };

  return (
    <>
      <AuthShell
        title="Create your account"
        subtitle="It takes a minute, and you can book straight away."
        footer={
          <>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-700 hover:underline">
              Log in
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
          data={rData}
          formType={"create"}
          buttonName={"Create account"}
        >
          <ZInputTwo name="name" type="text" label="Full name" required defaultKey={""} placeholder={"Enter your full name"} />
          <ZEmail label={"Email"} name={"email"} />
          <ZPhone label={"Phone number"} name={"phone"} />
          <ZInputTwo required name="password" type="password" label="Password" defaultKey={""} placeholder={"Choose a password"} />
        </ZFormTwo>
      </AuthShell>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Registration successful" size="md">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <LuMailCheck className="h-8 w-8" />
          </span>
          <p className="text-lg font-bold text-ink-950">Check your inbox</p>
          <p className="max-w-sm text-sm text-ink-500">
            We sent a verification link to your email. Verify your account, then log in to start booking.
          </p>
          <Link to="/login" className="btn-brand mt-3">
            Go to log in
          </Link>
        </div>
      </Modal>
    </>
  );
};

export default Register;
