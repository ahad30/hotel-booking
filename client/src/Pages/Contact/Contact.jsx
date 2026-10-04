import { useState } from "react";
import { LuCircleCheck, LuLoaderCircle, LuMail, LuMessageCircle, LuSend } from "react-icons/lu";
import { toast } from "sonner";
import { useAddContactMutation } from "../../redux/Feature/Admin/contact/contactApi";
import Faq from "../../components/ui/Faq";

const TOPICS = ["Booking help", "Change or cancel a booking", "Payment issue", "List my hotel", "Something else"];
const EMPTY = { name: "", email: "", phone: "", subject: TOPICS[0], description: "" };

const Field = ({ label, optional, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">
      {label} {optional && <span className="font-normal text-ink-400">(optional)</span>}
    </span>
    {children}
  </label>
);

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-[15px] outline-none transition placeholder:text-ink-400 hover:border-brand-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);
  const [addContact, { isLoading }] = useAddContactMutation();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await addContact(form).unwrap();
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't send your message. Please try again.");
    }
  };

  return (
    <div className="pb-28 lg:pb-16">
      <div className="relative isolate overflow-hidden bg-ink-950">
        <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 left-10 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="container-x py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Contact</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">How can we help?</h1>
          <p className="mt-3 max-w-xl text-ink-300">Questions about a booking, a payment or listing your hotel: send us a message and we&apos;ll reply by email.</p>
        </div>
      </div>

      <div className="container-x -mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="card relative p-6 shadow-lift sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <LuCircleCheck className="h-8 w-8" />
              </span>
              <h2 className="mt-2 text-2xl font-bold text-ink-950">Message sent</h2>
              <p className="max-w-sm text-ink-500">Thanks for getting in touch. We&apos;ll reply to the email address you gave us.</p>
              <button onClick={() => setSent(false)} className="btn-ghost mt-3">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="text-xl font-bold text-ink-950">Send a message</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name">
                  <input required value={form.name} onChange={set("name")} className={inputClass} placeholder="Full name" autoComplete="name" />
                </Field>
                <Field label="Email">
                  <input required type="email" value={form.email} onChange={set("email")} className={inputClass} placeholder="you@example.com" autoComplete="email" />
                </Field>
                <Field label="Phone" optional>
                  <input value={form.phone} onChange={set("phone")} className={inputClass} placeholder="01XXXXXXXXX" autoComplete="tel" />
                </Field>
                <Field label="Topic">
                  <select value={form.subject} onChange={set("subject")} className={inputClass}>
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Message">
                <textarea
                  required
                  rows={5}
                  maxLength={2000}
                  value={form.description}
                  onChange={set("description")}
                  className={`${inputClass} resize-y`}
                  placeholder="Include your booking or transaction ID if this is about an existing booking."
                />
                <span className="mt-1 block text-right text-xs text-ink-400">{form.description.length}/2000</span>
              </Field>
              <button type="submit" disabled={isLoading} className="btn-brand w-full py-3.5 text-base">
                {isLoading ? <LuLoaderCircle className="h-5 w-5 animate-spin" /> : <LuSend className="h-4 w-4" />}
                {isLoading ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4 pt-8 lg:pt-0">
          {[
            { icon: LuMail, title: "By email", text: "Messages from this form go straight to the BEHB team, and we reply to the email you give us." },
            { icon: LuMessageCircle, title: "About a booking?", text: "Add your booking or transaction ID. You'll find it under My bookings and on your PDF receipt." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card flex gap-4 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-ink-950">{title}</h3>
                <p className="mt-1 text-sm text-ink-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="container-x mt-16 max-w-3xl">
        <p className="eyebrow text-center">FAQ</p>
        <h2 className="heading-xl mt-2 text-center">Frequently asked questions</h2>
        <div className="mt-8">
          <Faq />
        </div>
      </section>
    </div>
  );
};

export default Contact;
