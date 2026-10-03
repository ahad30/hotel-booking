import { useCallback, useEffect, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useGetSlidersQuery } from "../../../redux/Feature/Admin/slider/sliderApi";
import SmartImage from "../../../components/ui/SmartImage";
import SectionHeader from "../SectionHeader";

// Lightweight offers carousel built on CSS scroll-snap: swipe works natively on
// touch, and there is no carousel library in the bundle.
const BannerSlider = () => {
  const { data, isLoading, isError } = useGetSlidersQuery();
  const slides = (data?.data || []).filter((s) => s?.isActive).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (i) => {
      const track = trackRef.current;
      if (!track || !slides.length) return;
      const index = (i + slides.length) % slides.length;
      track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    },
    [slides.length]
  );

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => goTo(active + 1), 6000);
    return () => clearInterval(t);
  }, [active, paused, slides.length, goTo]);

  if (isError || (!isLoading && slides.length === 0)) return null;

  return (
    <section className="container-x pt-16 sm:pt-20">
      <SectionHeader eyebrow="Deals" title="Offers on hotels right now" />
      <div
        className="group relative mt-8 overflow-hidden rounded-4xl bg-ink-100 shadow-soft"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {isLoading ? (
          <div className="skeleton aspect-[16/9] sm:aspect-[21/8]" />
        ) : (
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
            aria-roledescription="carousel"
          >
            {slides.map((s, i) => {
              const image = (
                <SmartImage
                  src={s.imageUrl}
                  alt={s.title || `Offer ${i + 1}`}
                  priority={i === 0}
                  className="aspect-[16/9] w-full sm:aspect-[21/8]"
                />
              );
              return (
                <div key={s.id} className="relative w-full shrink-0 snap-center" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
                  {s.linkUrl ? (
                    <a href={s.linkUrl} target="_blank" rel="noreferrer">
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                  {(s.title || s.description) && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/80 to-transparent p-6 sm:p-10">
                      {s.title && <h3 className="text-xl font-bold text-white sm:text-3xl">{s.title}</h3>}
                      {s.description && <p className="mt-1 max-w-xl text-sm text-white/80 sm:text-base">{s.description}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {slides.length > 1 && (
          <>
            {[
              { dir: -1, Icon: LuChevronLeft, pos: "left-4", label: "Previous offer" },
              { dir: 1, Icon: LuChevronRight, pos: "right-4", label: "Next offer" },
            ].map(({ dir, Icon, pos, label }) => (
              <button
                key={label}
                onClick={() => goTo(active + dir)}
                aria-label={label}
                className={`absolute ${pos} top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow-lift backdrop-blur transition hover:bg-white group-hover:opacity-100 sm:grid`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink-950/30 px-2.5 py-1.5 backdrop-blur">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to offer ${i + 1}`}
                  aria-current={i === active}
                  className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BannerSlider;
