// tailwind.config.js
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
        navy: "#0b104a",
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
        // App-wide scale — every component uses these named tokens
        xs: ["0.875rem", { lineHeight: "1.4" }], // 14px — labels, badges, metadata
        sm: ["1rem", { lineHeight: "1.5" }], // 16px — body copy, inputs, buttons
        base: ["1.125rem", { lineHeight: "1.6" }], // 18px — comfortable reading
        lg: ["1.25rem", { lineHeight: "1.6" }], // 20px — section headings
        xl: ["1.5rem", { lineHeight: "1.4" }], // 24px — page titles
        "2xl": ["1.875rem", { lineHeight: "1.3" }], // 30px — hero headings
      },
    },
  },
  plugins: [],
};
