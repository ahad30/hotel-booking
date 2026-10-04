import { LuCircleCheck, LuCircleX, LuClock3 } from "react-icons/lu";

// Booking status with icon + label (never colour alone).
export const STATUS = {
  confirmed: { label: "Confirmed", icon: LuCircleCheck, color: "#10b981", className: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  pending: { label: "Pending", icon: LuClock3, color: "#f59e0b", className: "bg-amber-50 text-amber-700 ring-amber-100" },
  cancelled: { label: "Cancelled", icon: LuCircleX, color: "#f43f5e", className: "bg-rose-50 text-rose-700 ring-rose-100" },
};

const StatusPill = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${s.className}`}>
      <Icon className="h-3.5 w-3.5" /> {s.label}
    </span>
  );
};

export default StatusPill;
