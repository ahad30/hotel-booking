import { LuLoaderCircle } from "react-icons/lu";

// Submit (and optional Close) buttons rendered by ZFormTwo in dashboard forms and modals.
const SaveAndCloseButton = ({ title, isLoading, closeModal }) => (
  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
    {closeModal && (
      <button disabled={isLoading} onClick={() => closeModal()} type="button" className="btn-ghost sm:min-w-[140px]">
        Close
      </button>
    )}
    <button disabled={isLoading} type="submit" className="btn-brand sm:min-w-[180px]">
      {isLoading && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
      {isLoading ? "Saving…" : title}
    </button>
  </div>
);

export default SaveAndCloseButton;
