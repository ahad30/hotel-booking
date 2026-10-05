import { Link } from "react-router-dom";
import icon from "../../assets/icon.png";

const Logo = ({ light = false, className = "" }) => (
  <Link to="/" className={`group flex items-center gap-2.5 ${className}`}>
    <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100 transition-transform duration-300 group-hover:-rotate-6">
      <img src={icon} alt="" width="40" height="40" className="h-9 w-9 object-contain" />
    </span>
    <span className="leading-none">
      <span className={`block text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-ink-950"}`}>
        BEHB
      </span>{" "}
      <span className={`block text-[10px] font-semibold uppercase tracking-[.22em] ${light ? "text-white/70" : "text-ink-500"}`}>
        Hotel Booking
      </span>
    </span>
  </Link>
);

export default Logo;
