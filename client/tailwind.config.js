/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Poppins : ["Poppins", "sans-serif"]
    },
    extend: {
     colors : {
      primary : "#FD3D57",
      secondary: "#232830"
      
     }

    },
  },
  plugins: [],
};
