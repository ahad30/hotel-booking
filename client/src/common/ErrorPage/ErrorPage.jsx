import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import Logo from "../../components/ui/Logo";

// Rendered by the router for unknown URLs and uncaught route errors.
const ErrorPage = () => (
  <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
    <div className="absolute left-1/2 top-1/3 -z-10 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-brand-200/50 blur-3xl" />
    <Logo />
    <p className="text-gradient mt-10 text-8xl font-extrabold tracking-tighter sm:text-9xl">404</p>
    <h1 className="mt-4 text-2xl font-bold text-ink-950">This page checked out early</h1>
    <p className="mt-2 max-w-sm text-ink-500">The page you&apos;re looking for doesn&apos;t exist or something went wrong loading it.</p>
    <Link to="/" className="btn-primary mt-8">
      <LuArrowLeft className="h-4 w-4" /> Back to home
    </Link>
  </div>
);

export default ErrorPage;
