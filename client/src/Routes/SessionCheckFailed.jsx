import { LuRefreshCw } from "react-icons/lu";

// Shown by the route guards when the account check can't reach the API.
const SessionCheckFailed = ({ onRetry }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
    <p className="text-lg font-bold text-ink-950">We couldn&apos;t verify your account</p>
    <p className="max-w-sm text-sm text-ink-500">Check your connection and try again. You&apos;re still signed in.</p>
    <button onClick={onRetry} className="btn-primary mt-2">
      <LuRefreshCw className="h-4 w-4" /> Try again
    </button>
  </div>
);

export default SessionCheckFailed;
