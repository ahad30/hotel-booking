import { lazy, Suspense } from "react";

// Ant Design's Select is heavy, so it loads in its own chunk. Until it arrives
// a styled native <select> with the same size and options stands in, which
// keeps the home page's first paint light and the control usable immediately.
const AntSelect = lazy(() => import("./AntSelect"));

// options: [{ value, label, hint? }]
const SelectField = (props) => {
  const { value, onChange, options, placeholder, disabled, bare, ariaLabel } = props;

  const fallback = (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={
        bare
          ? "w-full cursor-pointer appearance-none truncate bg-transparent text-[15px] font-semibold text-ink-900 outline-none disabled:text-ink-300"
          : "h-12 w-full cursor-pointer rounded-2xl border border-ink-200 bg-white px-4 text-[15px] outline-none disabled:bg-ink-50"
      }
    >
      {placeholder && value === undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  const antOptions = options.map((o) => ({ ...o, searchText: `${o.label} ${o.hint || ""}` }));

  return (
    <Suspense fallback={fallback}>
      <AntSelect {...props} options={antOptions} />
    </Suspense>
  );
};

export default SelectField;
