import { useCallback, useState } from "react";
import { LuImage } from "react-icons/lu";

// Lazy, async-decoded image that fades in once loaded and falls back to a
// neutral placeholder if the URL is broken.
const SmartImage = ({ src, alt = "", className = "", imgClassName = "", priority = false, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);

  // Images served from cache can finish before onLoad is attached, so check on mount too.
  const imgRef = useCallback((img) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className={`relative overflow-hidden bg-ink-100 ${className}`}>
      {!loaded && !failed && <div className="skeleton absolute inset-0" />}
      {failed ? (
        <div className="absolute inset-0 grid place-items-center text-ink-300">
          <LuImage className="h-8 w-8" />
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
          {...rest}
        />
      )}
    </div>
  );
};

export default SmartImage;
