import { LuMinus, LuPlus } from "react-icons/lu";

const StepButton = ({ onClick, disabled, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="grid h-8 w-8 place-items-center rounded-full border border-ink-200 bg-white text-ink-700 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
  >
    {children}
  </button>
);

const Stepper = ({ label, value, onDecrement, onIncrement, decDisabled, incDisabled }) => (
  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:gap-1.5">
    <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</span>
    <div className="flex items-center gap-2.5">
      <StepButton onClick={onDecrement} disabled={decDisabled} label={`Decrease ${label}`}>
        <LuMinus className="h-3.5 w-3.5" />
      </StepButton>
      <span className="w-6 text-center text-sm font-bold tabular-nums text-ink-900" aria-live="polite">
        {value}
      </span>
      <StepButton onClick={onIncrement} disabled={incDisabled} label={`Increase ${label}`}>
        <LuPlus className="h-3.5 w-3.5" />
      </StepButton>
    </div>
  </div>
);

export default Stepper;
