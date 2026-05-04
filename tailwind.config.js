// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}", // Scan all files in src/
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Match the color scheme from your HTML mockups exactly
//         navy: "#1A3C5E",
//         sidebar: "#1E2A3A",
//         sidebarHover: "#2A3A50",
//         accent: "#3498DB",
//         bgLight: "#F0F2F5",
//       },
//       fontFamily: {
//         sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// };

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
    },
  },
  plugins: [],
};
