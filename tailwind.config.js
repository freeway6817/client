/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          blue: "#525fe1",
          red: "#f26b65",
          dark: "#0b104a",
          body: "#4a5355",
          light: "#f5f5fd",
          input: "#ebecff",
          border: "#dddddd",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        heading: ['"Jost"', "sans-serif"],
      },
      boxShadow: {
        card: "0px 0px 150px 0px rgba(78, 67, 250, 0.06)",
        "card-soft": "10px 15px 18px rgba(23, 23, 36, 0.03)",
      },
      screens: {
        "3xl": "1920px",
      },
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.4" }], // 14px (was ~12.8px)
        sm: ["1rem", { lineHeight: "1.5" }], // 16px (was ~14.8px)
        base: ["1.125rem", { lineHeight: "1.6" }], // 18px (was ~16.8px)
        lg: ["1.25rem", { lineHeight: "1.6" }], // 20px (was ~18.8px)
      },
    },
  },
  plugins: [],
};
