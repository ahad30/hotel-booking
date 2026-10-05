import { useEffect, useRef, useState } from "react";

// Sections waiting to be built. They mount one per idle period so the first
// screen paints quickly and no single long task blocks taps on slow phones.
const queue = [];
let pumping = false;

const whenIdle = (cb) =>
  typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 60);

const pump = () => {
  const next = queue.shift();
  if (!next) {
    pumping = false;
    return;
  }
  next();
  whenIdle(pump);
};

const enqueue = (mount) => {
  queue.push(mount);
  if (!pumping) {
    pumping = true;
    whenIdle(pump);
  }
};

// Renders its children once they scroll near the viewport or the browser has
// a quiet moment, whichever comes first. Keeps space reserved until then.
const Deferred = ({ children, minHeight = 480 }) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return undefined;
    let done = false;
    const mount = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && mount(), { rootMargin: "600px 0px" });
    if (ref.current) observer.observe(ref.current);
    enqueue(mount);

    return () => {
      done = true;
      observer.disconnect();
      const i = queue.indexOf(mount);
      if (i >= 0) queue.splice(i, 1);
    };
  }, [ready]);

  return ready ? children : <div ref={ref} style={{ minHeight }} aria-hidden="true" />;
};

export default Deferred;
