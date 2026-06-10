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
        // Tailwind's defaults already include these, but confirm:
        // sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px'
        // Add a custom 3xl for 1920p targeting if needed:
        "3xl": "1920px",
      },
      fontSize: {
        xs: ["0.8rem", { lineHeight: "1.4" }], // was 0.75rem
        sm: ["0.925rem", { lineHeight: "1.5" }], // was 0.875rem
        base: ["1.05rem", { lineHeight: "1.6" }], // was 1rem
        lg: ["1.175rem", { lineHeight: "1.6" }], // was 1.125rem
      },
    },
  },
  plugins: [],
};
