/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        body: ['"Inter"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        brand: {
          50: "#f0fdf6",
          100: "#dcfce9",
          500: "#16a34a",
          600: "#15803d",
          700: "#166534",
        },
        ink: "#0E2A1D",
        inkdeep: "#081A11",
        canvas: "#FBF8F2",
        tag: "#F4EFE2",
        rust: "#D8643A",
        sage: "#9FC2AE",
      },
      boxShadow: {
        'premium': '0 20px 60px rgba(14,42,29,0.15), 0 4px 16px rgba(14,42,29,0.08)',
        'card': '0 1px 3px rgba(14,42,29,0.08)',
        'glow-rust': '0 0 32px rgba(216,100,58,0.35)',
      },
    },
  },
  plugins: [],
};
