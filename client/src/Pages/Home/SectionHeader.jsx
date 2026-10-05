import { useI18n } from "../../i18n/LanguageProvider";

const SectionHeader = ({ eyebrow, title, subtitle, action, align = "left" }) => {
  const { t } = useI18n();
  return (
  <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${align === "center" ? "items-center text-center sm:flex-col sm:items-center" : ""}`}>
    <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{t(eyebrow)}</p>}
      <h2 className="heading-xl mt-2">{t(title)}</h2>
      {subtitle && <p className="mt-3 text-base text-ink-500">{t(subtitle)}</p>}
    </div>
    {action}
  </div>
  );
};

export default SectionHeader;
