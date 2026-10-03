import barisal from "../../assets/Division/city-tile-Barisal.webp";
import khulna from "../../assets/Division/city-tile-Khulna.webp";
import mymensingh from "../../assets/Division/city-tile-Mymensingh.webp";
import rajshahi from "../../assets/Division/city-tile-Rajshahi.webp";
import rangpur from "../../assets/Division/city-tile-Rangpur.webp";
import chittagong from "../../assets/Division/city-title-Chittagong.webp";
import dhaka from "../../assets/Division/city-title-Dhaka.webp";
import sylhet from "../../assets/Division/city-title-Sylhet.webp";

const images = {
  barisal,
  barishal: barisal,
  khulna,
  mymensingh,
  rajshahi,
  rangpur,
  chittagong,
  chattagram: chittagong,
  dhaka,
  sylhet,
};

const taglines = {
  dhaka: "The capital's buzz",
  chittagong: "Port city & hills",
  chattagram: "Port city & hills",
  sylhet: "Tea gardens & lakes",
  khulna: "Gateway to the Sundarbans",
  rajshahi: "Silk & mangoes",
  barisal: "Rivers & backwaters",
  barishal: "Rivers & backwaters",
  rangpur: "Heritage of the north",
  mymensingh: "Along the Brahmaputra",
};

export const divisionImage = (name = "") => images[name.trim().toLowerCase()];
export const divisionTagline = (name = "") => taglines[name.trim().toLowerCase()] || "Explore stays";
