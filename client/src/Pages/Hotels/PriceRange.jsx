import { useEffect, useState } from "react";
import { ConfigProvider, InputNumber, Slider } from "antd";
import { formatTaka } from "../../utils/format";

const STEP = 100;
const theme = { token: { colorPrimary: "#7c3aed", borderRadius: 12, fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' } };

// Two-handle price slider plus exact-amount inputs. Dragging only updates local
// state; the filter (and URL) is committed when the handle is released, so the
// page doesn't re-filter on every pixel.
const PriceRange = ({ bounds, value, onCommit }) => {
  // Round the bounds out to the step so both ends are always reachable.
  const lo = Math.floor(bounds[0] / STEP) * STEP;
  const hi = Math.ceil(bounds[1] / STEP) * STEP;
  const committed = [value[0] ?? lo, value[1] ?? hi];
  const [range, setRange] = useState(committed);

  useEffect(() => setRange(committed), [committed[0], committed[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bounds map to "no limit" so the URL stays clean when the full range is selected.
  const commit = ([a, b]) => onCommit({ min: a <= lo ? null : a, max: b >= hi ? null : b });

  const setEnd = (index) => (v) => {
    if (v === null || Number.isNaN(Number(v))) return;
    const next = [...range];
    next[index] = Math.min(hi, Math.max(lo, Number(v)));
    if (next[0] > next[1]) next[index === 0 ? 1 : 0] = next[index];
    setRange(next);
    commit(next);
  };

  return (
    <ConfigProvider theme={theme}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-bold text-ink-950">Price per night</h3>
        <span className="text-xs font-semibold tabular-nums text-ink-500">
          {formatTaka(range[0])} – {formatTaka(range[1])}
        </span>
      </div>
      <div className="px-1.5">
        <Slider
          range
          min={lo}
          max={hi}
          step={STEP}
          value={range}
          onChange={setRange}
          onChangeComplete={commit}
          tooltip={{ formatter: formatTaka }}
          aria-label={["Minimum price", "Maximum price"]}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Min", index: 0 },
          { label: "Max", index: 1 },
        ].map(({ label, index }) => (
          <label key={label} className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-ink-400">{label}</span>
            <InputNumber
              value={range[index]}
              min={lo}
              max={hi}
              step={STEP}
              prefix="৳"
              controls={false}
              onBlur={(e) => setEnd(index)(e.target.value.replace(/[^\d]/g, ""))}
              onPressEnter={(e) => setEnd(index)(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full"
              aria-label={`${label}imum price`}
            />
          </label>
        ))}
      </div>
    </ConfigProvider>
  );
};

export default PriceRange;
