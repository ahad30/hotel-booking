import { Link } from "react-router-dom";
import { LuArrowRight, LuMail, LuShieldCheck } from "react-icons/lu";

export const CONTACT_EMAIL = "mohiminulislamahad@gmail.com";

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    list: [
      ["Personal Information:", "Mobile number, email address, password (encrypted)"],
      ["Booking Information:", "Hotel name, dates, room types, number of guests"],
      ["Payment Information:", "Processed securely via SSLCommerz. We do not store card data."],
      ["Device Information:", "Device model, OS version, unique identifiers for analytics"],
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    list: [
      "Create and manage your account",
      "Enable hotel booking functionality",
      "Process secure payments via SSLCommerz",
      "Send booking confirmations and notifications",
      "Improve app performance and user experience",
    ],
  },
  {
    id: "sharing",
    title: "Data Sharing and Disclosure",
    intro: (
      <>
        We do <strong>not</strong> sell or rent your personal data. We may share your data with:
      </>
    ),
    list: ["Hotel admins for booking purposes", "SSLCommerz for payment processing", "Service providers for analytics and hosting", "Law enforcement, if legally required"],
  },
  {
    id: "security",
    title: "Data Security",
    intro: "We use industry-standard encryption and secure servers to protect your data. Passwords are encrypted, and payment processing is PCI-DSS compliant via SSLCommerz.",
  },
  {
    id: "rights",
    title: "User Rights",
    list: ["View or update your profile", "Delete your account by contacting us", "Opt out of marketing emails (if applicable)"],
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    intro: "Our app uses third-party services such as:",
    list: ["SSLCommerz (for payments)", "Google Play Services (for analytics, performance)"],
  },
  {
    id: "children",
    title: "Children’s Privacy",
    intro: "Our app is not intended for children under 13. We do not knowingly collect data from children.",
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    intro: "We may update this Privacy Policy from time to time. You will be notified via app notifications or email.",
  },
];

const PrivacyPolicy = () => (
  <div className="pb-28 lg:pb-16">
    <div className="border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
      <div className="container-x py-10 sm:py-14">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          <LuShieldCheck className="h-6 w-6" />
        </span>
        <h1 className="heading-xl mt-5">Privacy Policy</h1>
        <p className="mt-2 text-sm font-medium text-ink-500">Effective Date: 10/5/2025</p>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-600">
          Thank you for using <strong className="text-ink-900">BEHB Hotel Booking</strong> (“we”, “us”, or “our”). This Privacy Policy explains how we
          collect, use, and protect your personal information when you use our hotel booking mobile application, available on the Google Play Store.
        </p>
      </div>
    </div>

    <div className="container-x mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
      <nav aria-label="On this page" className="hidden lg:block">
        <div className="sticky top-24">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-ink-400">On this page</p>
          <ol className="space-y-1 border-l border-ink-100">
            {[...sections, { id: "contact", title: "Contact Us" }].map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-ink-500 transition hover:border-brand-500 hover:text-ink-900">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <article className="min-w-0 max-w-3xl space-y-10">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-xl font-bold text-ink-950">
              <span className="mr-2 text-brand-600">{i + 1}.</span>
              {s.title}
            </h2>
            {s.intro && <p className="mt-3 leading-relaxed text-ink-600">{s.intro}</p>}
            {s.list && (
              <ul className="mt-4 space-y-2.5">
                {s.list.map((item) => (
                  <li key={Array.isArray(item) ? item[0] : item} className="flex gap-3 leading-relaxed text-ink-600">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <span>
                      {Array.isArray(item) ? (
                        <>
                          <strong className="text-ink-900">{item[0]}</strong> {item[1]}
                        </>
                      ) : (
                        item
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section id="contact" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-ink-950">
            <span className="mr-2 text-brand-600">{sections.length + 1}.</span>
            Contact Us
          </h2>
          <p className="mt-3 leading-relaxed text-ink-600">If you have any questions or concerns about this policy, contact us at:</p>
          <div className="relative isolate mt-5 overflow-hidden rounded-3xl bg-ink-950 p-6 text-white sm:p-8">
            <div className="absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-brand-600/40 blur-3xl" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex min-w-0 items-center gap-3 font-semibold hover:underline">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-cyan-300">
                  <LuMail className="h-5 w-5" />
                </span>
                <span className="break-all sm:truncate">{CONTACT_EMAIL}</span>
              </a>
              <Link to="/contact" className="btn shrink-0 bg-white px-5 py-2.5 text-sm text-ink-950 hover:bg-ink-100">
                Send a message <LuArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </article>
    </div>
  </div>
);

export default PrivacyPolicy;
