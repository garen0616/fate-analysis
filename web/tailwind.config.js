/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f7f3fd",
          100: "#ebe1fa",
          200: "#d7c4f5",
          300: "#bb97ec",
          400: "#a26cde",
          500: "#8d4ed1",
          600: "#7737b6",
          700: "#622c92",
          800: "#4e2474",
          900: "#3f1f5d",
        },
        tarot: "#5a3d9a",
        ziwei: "#cc6b5a",
      },
      fontFamily: {
        sans: [
          "Noto Sans TC",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
