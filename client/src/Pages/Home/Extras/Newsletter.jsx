import { useState } from "react";
import { LuCircleCheck, LuLoaderCircle, LuMail } from "react-icons/lu";
import { toast } from "sonner";
import { useAddSubscriptionMutation } from "../../../redux/Feature/Admin/subscribe/subscribeApi";
import { useI18n } from "../../../i18n/LanguageProvider";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [subscribe, { isLoading }] = useAddSubscriptionMutation();
  const { t } = useI18n();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await subscribe({ email }).unwrap();
      setDone(true);
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't subscribe. Please try again.");
    }
  };

  return (
    <section className="container-x pb-20 sm:pb-28">
      <div className="relative isolate overflow-hidden rounded-4xl bg-brand-gradient p-[1px]">
        <div className="relative isolate overflow-hidden rounded-[calc(2rem-1px)] bg-white px-6 py-10 sm:px-12 sm:py-14">
          <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-brand-100 blur-3xl" />
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <LuMail className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-950">{t("home.newsTitle")}</h2>
              <p className="mt-2 text-ink-500">{t("home.newsSubtitle")}</p>
            </div>
            {done ? (
              <div className="flex items-center gap-3 rounded-3xl bg-emerald-50 p-5 text-emerald-800 ring-1 ring-emerald-100" role="status">
                <LuCircleCheck className="h-6 w-6 shrink-0" />
                <p className="font-semibold">{t("home.newsDone")}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  autoComplete="email"
                  className="flex-1 rounded-full border border-ink-200 bg-white px-5 py-3.5 text-[15px] outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                />
                <button type="submit" disabled={isLoading} className="btn-brand py-3.5">
                  {isLoading && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                  {t("home.newsSubmit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
