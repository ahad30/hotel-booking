import { toast } from "sonner";
import { LuGitCompareArrows, LuHeart } from "react-icons/lu";
import { COMPARE_LIMIT, useCompare, useSaved } from "../../utils/localCollections";
import { useI18n } from "../../i18n/LanguageProvider";

// Save and compare toggles shown on hotel cards and the hotel page.
const HotelActions = ({ hotel, variant = "overlay" }) => {
  const { t } = useI18n();
  const saved = useSaved();
  const compare = useCompare();
  const isSaved = saved.has(hotel.id);
  const isCompared = compare.has(hotel.id);

  const onSave = () => {
    const added = saved.toggle(hotel.id);
    toast.success(added ? `${hotel.name} saved` : `${hotel.name} removed from saved`);
  };

  const onCompare = () => {
    const added = compare.toggle(hotel.id);
    if (added === null) toast.warning(`You can compare up to ${COMPARE_LIMIT} hotels. Remove one first.`);
    else toast.success(added ? `${hotel.name} added to compare` : `${hotel.name} removed from compare`);
  };

  const base =
    variant === "overlay"
      ? "grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-soft backdrop-blur transition hover:scale-105"
      : "btn-ghost";

  return (
    <div className={variant === "overlay" ? "flex gap-2" : "flex flex-wrap gap-2"}>
      <button
        type="button"
        onClick={onSave}
        aria-pressed={isSaved}
        aria-label={isSaved ? `Remove ${hotel.name} from saved` : `Save ${hotel.name}`}
        className={`${base} ${isSaved ? "text-rose-600" : "text-ink-700"}`}
      >
        <LuHeart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        {variant !== "overlay" && (isSaved ? t("hotel.saved") : t("hotel.save"))}
      </button>
      <button
        type="button"
        onClick={onCompare}
        aria-pressed={isCompared}
        aria-label={isCompared ? `Remove ${hotel.name} from compare` : `Compare ${hotel.name}`}
        className={`${base} ${isCompared ? "!bg-brand-600 text-white" : "text-ink-700"}`}
      >
        <LuGitCompareArrows className="h-4 w-4" />
        {variant !== "overlay" && (isCompared ? t("hotel.comparing") : t("hotel.compare"))}
      </button>
    </div>
  );
};

export default HotelActions;
