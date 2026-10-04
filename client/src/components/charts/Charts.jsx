import { useState } from "react";

// Lightweight dashboard charts (no chart library). Conventions:
// bars <= 24px thick with 4px rounded data-ends from a single baseline,
// 2px surface gaps between touching segments, recessive 1px gridlines,
// text in ink tokens (never the series colour), hover/focus tooltips,
// and a visually hidden table carrying every value for screen readers.

const niceMax = (value) => {
  if (value <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * exp >= value / 4) * exp;
  return Math.ceil(value / step) * step;
};

const Tooltip = ({ x, title, lines }) => (
  <div
    className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-xl bg-ink-950 px-3 py-2 text-xs text-white shadow-lift"
    style={{ left: x }}
    role="presentation"
  >
    <p className="font-bold">{title}</p>
    {lines.map((l) => (
      <p key={l} className="text-ink-300">
        {l}
      </p>
    ))}
  </div>
);

// Single-series column chart (e.g. revenue per month). No legend: the card title names the series.
export const ColumnChart = ({ data, format = (v) => v, caption, height = 220, color = "#7c3aed" }) => {
  const [active, setActive] = useState(null);
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  return (
    <figure className="relative">
      <div className="flex gap-3" style={{ height }}>
        <div className="flex flex-col-reverse justify-between pb-6 text-right text-[11px] tabular-nums text-ink-400" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="-mb-1.5 leading-none">
              {format(t)}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col-reverse justify-between" aria-hidden="true">
            {ticks.map((t) => (
              <div key={t} className="h-px bg-ink-100" />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 top-0 flex items-stretch">
            {data.map((d, i) => {
              const pct = (d.value / max) * 100;
              return (
                <div key={d.label} className="relative flex flex-1 flex-col items-center">
                  <button
                    type="button"
                    className="group relative flex w-full flex-1 items-end justify-center pb-0 outline-none"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    aria-label={`${d.label}: ${format(d.value)}${d.hint ? `, ${d.hint}` : ""}`}
                  >
                    <span
                      className="block w-full max-w-[24px] rounded-t-[4px] transition-opacity group-focus-visible:ring-2 group-focus-visible:ring-brand-400"
                      style={{ height: `${Math.max(pct, d.value > 0 ? 1.5 : 0)}%`, background: color, opacity: active === null || active === i ? 1 : 0.45 }}
                    />
                  </button>
                  <span className="h-6 pt-1.5 text-[11px] font-medium text-ink-500">{d.label}</span>
                  {active === i && <Tooltip x="50%" title={d.label} lines={[format(d.value), d.hint].filter(Boolean)} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{format(d.value)}</td>
              {d.hint && <td>{d.hint}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

// 100% stacked bar for a part-to-whole split (e.g. booking status), with a
// legend that carries icon + label + count so colour is never the only cue.
export const StackedBar = ({ segments, caption }) => {
  const [active, setActive] = useState(null);
  const total = segments.reduce((s, x) => s + x.value, 0);

  return (
    <figure>
      <div className="relative">
        <div className="flex h-6 gap-[2px] overflow-hidden rounded-[4px] bg-ink-100">
          {total > 0 &&
            segments
              .filter((s) => s.value > 0)
              .map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="h-full outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-brand-400"
                  style={{ width: `${(s.value / total) * 100}%`, background: s.color, opacity: active === null || active === s.label ? 1 : 0.45 }}
                  onMouseEnter={() => setActive(s.label)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(s.label)}
                  onBlur={() => setActive(null)}
                  aria-label={`${s.label}: ${s.value} (${Math.round((s.value / total) * 100)}%)`}
                />
              ))}
        </div>
        {active && (
          <Tooltip
            x="50%"
            title={active}
            lines={(() => {
              const s = segments.find((x) => x.label === active);
              return [`${s.value} booking${s.value === 1 ? "" : "s"} · ${Math.round((s.value / total) * 100)}%`];
            })()}
          />
        )}
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {segments.map(({ label, value, color, icon: Icon }) => (
          <li key={label} className="flex items-center gap-3 rounded-2xl bg-ink-50 px-3 py-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl text-white" style={{ background: color }}>
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-lg font-extrabold tabular-nums leading-none text-ink-950">{value}</p>
              <p className="text-xs text-ink-500">
                {label}
                {total > 0 && ` · ${Math.round((value / total) * 100)}%`}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {segments.map((s) => (
            <tr key={s.label}>
              <th scope="row">{s.label}</th>
              <td>{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

// Ranked horizontal bars with the value at the bar tip (e.g. revenue per hotel).
export const BarList = ({ items, format = (v) => v, color = "#7c3aed", caption }) => {
  const max = Math.max(...items.map((i) => i.value), 0) || 1;
  return (
    <figure>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.label} title={`${item.label}: ${format(item.value)}`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-semibold text-ink-800">{item.label}</span>
              <span className="shrink-0 font-bold tabular-nums text-ink-950">{format(item.value)}</span>
            </div>
            <div className="h-2.5 rounded-[4px] bg-ink-100">
              <div className="h-full rounded-r-[4px]" style={{ width: `${(item.value / max) * 100}%`, background: color }} />
            </div>
            {item.hint && <p className="mt-1 text-xs text-ink-400">{item.hint}</p>}
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {items.map((i) => (
            <tr key={i.label}>
              <th scope="row">{i.label}</th>
              <td>{format(i.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};
