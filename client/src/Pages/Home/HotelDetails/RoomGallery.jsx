import { useCallback, useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuImage } from "react-icons/lu";
import Modal from "../../../components/ui/Modal";
import SmartImage from "../../../components/ui/SmartImage";

// Full-screen photo viewer with arrow-key navigation and a thumbnail strip.
const Lightbox = ({ images, index, onClose, onChange }) => {
  const step = useCallback((dir) => onChange((index + dir + images.length) % images.length), [index, images.length, onChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  return (
    <Modal open onClose={onClose} title={`Photo ${index + 1} of ${images.length}`} size="xl">
      <div className="relative overflow-hidden rounded-3xl bg-ink-950">
        <img src={images[index].src} alt={images[index].alt} className="mx-auto max-h-[62vh] w-full object-contain" />
        {images.length > 1 &&
          [
            { dir: -1, Icon: LuChevronLeft, pos: "left-3", label: "Previous photo" },
            { dir: 1, Icon: LuChevronRight, pos: "right-3", label: "Next photo" },
          ].map(({ dir, Icon, pos, label }) => (
            <button
              key={label}
              onClick={() => step(dir)}
              aria-label={label}
              className={`absolute ${pos} top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-lift transition hover:bg-white`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
      </div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img.src + i}
            onClick={() => onChange(i)}
            aria-label={`Show photo ${i + 1}`}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition ${i === index ? "ring-brand-600" : "opacity-60 ring-transparent hover:opacity-100"}`}
          >
            <img src={img.src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </Modal>
  );
};

// Bento photo grid: one large photo plus four smaller ones.
const RoomGallery = ({ images = [] }) => {
  const [open, setOpen] = useState(null);

  if (images.length === 0) {
    return (
      <div className="grid aspect-[21/9] place-items-center rounded-4xl bg-ink-100 text-ink-400">
        <span className="flex items-center gap-2 text-sm font-medium">
          <LuImage className="h-5 w-5" /> Photos coming soon
        </span>
      </div>
    );
  }

  const shown = images.slice(0, 5);

  // Tile spans so the 4x2 grid has no gaps for 1–5 photos.
  const tileClass = (i) => {
    if (i === 0) return shown.length === 1 ? "col-span-4 row-span-2" : "col-span-4 row-span-2 sm:col-span-2";
    const small = "hidden sm:block";
    if (shown.length === 2) return `${small} sm:col-span-2 sm:row-span-2`;
    if (shown.length === 3) return `${small} sm:col-span-2`;
    if (shown.length === 4 && i === 3) return `${small} sm:col-span-2`;
    return small;
  };

  return (
    <>
      <div className="grid h-[280px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-4xl sm:h-[420px] lg:h-[480px]">
        {shown.map((img, i) => (
          <button
            key={img.src + i}
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1}`}
            className={`group relative overflow-hidden ${tileClass(i)}`}
          >
            <SmartImage
              src={img.src}
              alt={img.alt}
              priority={i === 0}
              className="h-full w-full"
              imgClassName="transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-ink-950/0 transition group-hover:bg-ink-950/10" />
          </button>
        ))}
      </div>
      <button
        onClick={() => setOpen(0)}
        className="btn-ghost relative z-10 -mt-16 ml-auto mr-4 flex w-fit shadow-lift sm:mr-6"
      >
        <LuImage className="h-4 w-4" />
        Show all {images.length} photos
      </button>

      {open !== null && <Lightbox images={images} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
};

export default RoomGallery;
