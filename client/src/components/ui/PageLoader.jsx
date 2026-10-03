// Shown while a lazily loaded route chunk downloads.
const PageLoader = ({ fullScreen = false }) => (
  <div
    role="status"
    aria-label="Loading"
    className={`flex w-full items-center justify-center ${fullScreen ? "min-h-screen" : "min-h-[50vh]"}`}
  >
    <span className="relative flex h-12 w-12">
      <span className="absolute inset-0 animate-spin rounded-full bg-brand-gradient [mask:radial-gradient(farthest-side,transparent_calc(100%-4px),#000_calc(100%-3px))]" />
    </span>
  </div>
);

export default PageLoader;
