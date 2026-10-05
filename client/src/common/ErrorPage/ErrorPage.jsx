import { Link, useRouteError } from "react-router-dom";
import { LuArrowLeft, LuRefreshCw, LuWifiOff } from "react-icons/lu";
import Logo from "../../components/ui/Logo";

// A lazy page's code could not be downloaded: the device is offline, or a new
// deploy replaced the file this tab was about to load.
const isChunkError = (error) =>
  /dynamically imported module|importing a module script failed|failed to fetch/i.test(String(error?.message || error));

// Rendered by the router for unknown URLs and uncaught route errors.
const ErrorPage = () => {
  const error = useRouteError();
  const offline = typeof navigator !== "undefined" && !navigator.onLine;

  if (offline || isChunkError(error)) {
    return (
      <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="absolute left-1/2 top-1/3 -z-10 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-brand-200/50 blur-3xl" />
        <Logo />
        <span className="mt-10 grid h-16 w-16 place-items-center rounded-3xl bg-ink-950 text-white">
          <LuWifiOff className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-ink-950">{offline ? "You're offline" : "This page needs a refresh"}</h1>
        <p className="mt-2 max-w-sm text-ink-500">
          {offline
            ? "This page hasn't been saved on your device yet. Reconnect and try again; pages you've opened before still work."
            : "A newer version of BEHB is available. Reload to continue."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => window.location.reload()} className="btn-primary">
            <LuRefreshCw className="h-4 w-4" /> Try again
          </button>
          <Link to="/" className="btn-ghost">
            <LuArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </div>
    );
  }

  return (
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
};

export default ErrorPage;
