import { Link } from "react-router-dom";
import { LuArrowLeft, LuCircleX, LuRefreshCw } from "react-icons/lu";

const PaymentError = () => (
  <section className="relative isolate flex min-h-[calc(100vh-72px)] items-center overflow-hidden px-4 py-16">
    <div className="absolute left-1/2 top-0 -z-10 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />
    <div className="card mx-auto w-full max-w-lg animate-fade-up p-8 text-center sm:p-12">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
        <LuCircleX className="h-10 w-10" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-950">Payment didn&apos;t go through</h1>
      <p className="mt-3 text-ink-500">
        Your payment couldn&apos;t be processed and you haven&apos;t been charged. Check your payment details and try again.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/checkout" className="btn-primary">
          <LuRefreshCw className="h-4 w-4" /> Try payment again
        </Link>
        <Link to="/" className="btn-ghost">
          <LuArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  </section>
);

export default PaymentError;
