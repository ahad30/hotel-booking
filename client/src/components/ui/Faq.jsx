import { useId, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { useI18n } from "../../i18n/LanguageProvider";

// Answers describe how the booking flow actually works in this app.
export const FAQS = [
  {
    q: "How do I book a room?",
    a: "Open a hotel, choose your check-in and check-out dates, pick the rooms and number of guests, then select Reserve. You'll add your details at checkout and pay securely through SSLCommerz.",
  },
  {
    q: "Which payment methods can I use?",
    a: "Checkout runs through SSLCommerz, which supports debit and credit cards, mobile banking such as bKash, Nagad and Rocket, and internet banking.",
  },
  {
    q: "Is my room held while I pay?",
    a: "Yes. Once you start checkout, your rooms are held for 30 minutes while you complete payment. If the payment fails or is cancelled, the rooms are released straight away.",
  },
  {
    q: "What happens if my payment fails?",
    a: "You won't be charged and the booking is cancelled automatically. You can go back to the hotel and try again; availability is re-checked before payment.",
  },
  {
    q: "Where can I find my booking and receipt?",
    a: "Log in and open My bookings. Every booking shows its status, and you can download a PDF receipt.",
  },
  {
    q: "Can I change my dates after booking?",
    a: "Send us a message from the contact page with your booking details and we'll help you with the change.",
  },
];

const FaqItem = ({ item, open, onToggle }) => {
  const id = useId();
  return (
    <div className="border-b border-ink-100 last:border-0">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink-950 transition hover:text-brand-700"
        >
          {item.q}
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${open ? "rotate-180 bg-brand-600 text-white" : "bg-ink-100 text-ink-600"}`}>
            <LuChevronDown className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <div id={id} role="region" className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <p className="overflow-hidden pr-12 text-sm leading-relaxed text-ink-600">{item.a}</p>
      </div>
    </div>
  );
};

export const FAQS_BN = [
  {
    q: "কীভাবে রুম বুক করব?",
    a: "একটি হোটেল খুলুন, চেক-ইন ও চেক-আউটের তারিখ বাছুন, রুম আর অতিথির সংখ্যা ঠিক করুন, তারপর \"বুক করুন\" চাপুন। চেকআউটে আপনার তথ্য দিয়ে SSLCommerz-এর মাধ্যমে নিরাপদে পেমেন্ট করুন।",
  },
  {
    q: "কোন কোন পদ্ধতিতে পেমেন্ট করা যায়?",
    a: "পেমেন্ট হয় SSLCommerz-এর মাধ্যমে — ডেবিট ও ক্রেডিট কার্ড, বিকাশ, নগদ, রকেটের মতো মোবাইল ব্যাংকিং এবং ইন্টারনেট ব্যাংকিং।",
  },
  {
    q: "পেমেন্ট করার সময় কি রুম আমার জন্য আটকে রাখা হয়?",
    a: "হ্যাঁ। চেকআউট শুরু করলে পেমেন্ট শেষ করার জন্য রুম ৩০ মিনিট আপনার জন্য রাখা হয়। পেমেন্ট ব্যর্থ বা বাতিল হলে রুম সঙ্গে সঙ্গে ছেড়ে দেওয়া হয়।",
  },
  {
    q: "পেমেন্ট ব্যর্থ হলে কী হবে?",
    a: "আপনার কাছ থেকে টাকা কাটা হবে না, আর বুকিং নিজে থেকেই বাতিল হয়ে যাবে। হোটেলে ফিরে আবার চেষ্টা করতে পারবেন; পেমেন্টের আগে প্রাপ্যতা আবার যাচাই করা হয়।",
  },
  {
    q: "আমার বুকিং আর রসিদ কোথায় পাব?",
    a: "লগ ইন করে \"আমার বুকিং\" খুলুন। প্রতিটি বুকিংয়ের অবস্থা দেখা যায়, আর PDF রসিদ ডাউনলোড করা যায়।",
  },
  {
    q: "বুকিংয়ের পর তারিখ বদলানো যাবে?",
    a: "যোগাযোগ পাতা থেকে বুকিংয়ের তথ্যসহ আমাদের মেসেজ করুন, আমরা পরিবর্তনে সাহায্য করব।",
  },
];

const Faq = ({ items, limit }) => {
  const { lang } = useI18n();
  const list = (items || (lang === "bn" ? FAQS_BN : FAQS)).slice(0, limit || undefined);
  const [open, setOpen] = useState(0);
  return (
    <div className="card px-6 sm:px-8">
      {list.map((item, i) => (
        <FaqItem key={item.q} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
      ))}
    </div>
  );
};

export default Faq;
