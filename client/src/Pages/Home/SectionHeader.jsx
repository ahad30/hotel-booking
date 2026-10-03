const SectionHeader = ({ eyebrow, title, subtitle, action, align = "left" }) => (
  <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${align === "center" ? "items-center text-center sm:flex-col sm:items-center" : ""}`}>
    <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="heading-xl mt-2">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-ink-500">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default SectionHeader;
