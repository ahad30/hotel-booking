import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";

// Accessible modal: bottom sheet on phones, centered dialog on larger screens.
// Closes on Escape and backdrop click, and locks page scroll while open.
const Modal = ({ open, onClose, title, children, size = "lg", footer }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { md: "sm:max-w-lg", lg: "sm:max-w-2xl", xl: "sm:max-w-4xl" };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade-in bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative flex max-h-[92vh] w-full animate-fade-up flex-col overflow-hidden rounded-t-4xl bg-white shadow-lift sm:rounded-4xl ${widths[size]}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-bold text-ink-950">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-ink-600 transition hover:bg-ink-200"
            aria-label="Close"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-ink-100 px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
