import {
  LuAirVent,
  LuCar,
  LuCoffee,
  LuDumbbell,
  LuFlower2,
  LuLock,
  LuShieldCheck,
  LuSparkles,
  LuSun,
  LuTv,
  LuUtensils,
  LuWaves,
  LuWifi,
  LuWine,
} from "react-icons/lu";

const amenityIcons = {
  "free wifi": LuWifi,
  wifi: LuWifi,
  parking: LuCar,
  restaurant: LuUtensils,
  tv: LuTv,
  security: LuShieldCheck,
  gym: LuDumbbell,
  spa: LuFlower2,
  "swimming pool": LuWaves,
  pool: LuWaves,
  ac: LuAirVent,
  "air conditioning": LuAirVent,
  "mini bar": LuWine,
  safe: LuLock,
  balcony: LuSun,
  breakfast: LuCoffee,
};

export const getAmenityIcon = (name = "") => amenityIcons[name.trim().toLowerCase()] || LuSparkles;

export const AmenityChip = ({ name, size = "sm" }) => {
  const Icon = getAmenityIcon(name);
  return (
    <span className={`chip ${size === "md" ? "px-3.5 py-1.5 text-sm" : ""}`}>
      <Icon className="h-3.5 w-3.5 text-brand-600" />
      {name}
    </span>
  );
};
