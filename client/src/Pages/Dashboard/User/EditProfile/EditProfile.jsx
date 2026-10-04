import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LuBadgeCheck, LuEye, LuEyeOff, LuKeyRound, LuLoaderCircle, LuMail, LuPhone, LuUser } from "react-icons/lu";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../../../redux/Feature/Admin/usersmanagement/userApi";
import { useCurrentUser, setUser, useCurrentToken } from "../../../../redux/Feature/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-[15px] outline-none transition placeholder:text-ink-400 hover:border-brand-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:bg-ink-50 disabled:text-ink-500";

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
  </label>
);

const PasswordInput = ({ value, onChange, placeholder, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} className={`${inputClass} pr-12`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
        {show ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
      </button>
    </div>
  );
};

const strength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const STRENGTH = ["Too short", "Weak", "Fair", "Good", "Strong"];

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { data, isLoading, isError } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();
  const [updatePassword, { isLoading: changing }] = useUpdateUserMutation();

  const profile = data?.data;
  const [form, setForm] = useState({ name: "", phone: "" });
  const [pw, setPw] = useState({ next: "", confirm: "" });

  useEffect(() => {
    if (profile) setForm({ name: profile.name || "", phone: profile.phone || "" });
  }, [profile]);

  const dirty = profile && (form.name !== profile.name || form.phone !== profile.phone);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      // Only the editable fields are sent.
      const res = await updateUser({ id: user.id, data: { name: form.name.trim(), phone: form.phone.trim() } }).unwrap();
      dispatch(setUser({ token, user: { ...user, name: res?.data?.name ?? form.name, phone: res?.data?.phone ?? form.phone } }));
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't update your profile.");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.next.length < 6) return toast.error("Use at least 6 characters.");
    if (pw.next !== pw.confirm) return toast.error("The two passwords don't match.");
    try {
      await updatePassword({ id: user.id, data: { password: pw.next } }).unwrap();
      setPw({ next: "", confirm: "" });
      toast.success("Password changed.");
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't change your password.");
    }
  };

  if (isLoading) return <div className="skeleton h-96 rounded-3xl" />;
  if (isError || !profile) return <div className="card p-10 text-center font-semibold text-ink-700">Couldn&apos;t load your profile.</div>;

  const score = strength(pw.next);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-950">Profile & security</h1>
        <p className="mt-1 text-ink-500">Keep your details up to date and your account secure.</p>
      </div>

      <div className="relative isolate overflow-hidden rounded-4xl bg-ink-950 p-6 text-white sm:p-8">
        <div className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-brand-gradient text-3xl font-extrabold">
            {(profile.name || "U").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold">
              {profile.name}
              {profile.isVerified && <LuBadgeCheck className="h-5 w-5 text-cyan-300" aria-label="Verified" />}
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-300">
              <span className="flex items-center gap-1.5">
                <LuPhone className="h-4 w-4" /> {profile.phone}
              </span>
              {profile.email && (
                <span className="flex items-center gap-1.5">
                  <LuMail className="h-4 w-4" /> {profile.email}
                </span>
              )}
              {profile.createdAt && <span>Member since {format(new Date(profile.createdAt), "MMMM yyyy")}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="card space-y-5 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <LuUser className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-ink-950">Personal details</h2>
          </div>
          <Field label="Full name">
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} autoComplete="name" />
          </Field>
          <Field label="Phone number" hint="You log in with this number.">
            <input required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} autoComplete="tel" />
          </Field>
          <Field label="Email" hint="Contact support to change your email.">
            <input value={profile.email || ""} disabled className={inputClass} />
          </Field>
          <button type="submit" disabled={!dirty || saving} className="btn-brand w-full py-3.5">
            {saving && <LuLoaderCircle className="h-4 w-4 animate-spin" />} Save changes
          </button>
        </form>

        <form onSubmit={changePassword} className="card space-y-5 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <LuKeyRound className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-ink-950">Change password</h2>
          </div>
          <Field label="New password">
            <PasswordInput value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} placeholder="At least 6 characters" autoComplete="new-password" />
          </Field>
          {pw.next && (
            <div aria-live="polite">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${i < score ? (score <= 1 ? "bg-rose-500" : score === 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-ink-100"}`} />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-ink-500">{STRENGTH[score]}</p>
            </div>
          )}
          <Field label="Confirm new password">
            <PasswordInput value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} placeholder="Type it again" autoComplete="new-password" />
          </Field>
          {pw.confirm && pw.next !== pw.confirm && <p className="text-xs font-semibold text-rose-600">Passwords don&apos;t match yet.</p>}
          <button type="submit" disabled={!pw.next || !pw.confirm || changing} className="btn-primary w-full py-3.5">
            {changing && <LuLoaderCircle className="h-4 w-4 animate-spin" />} Update password
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
