/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 🚨 CRITICAL: Tells Tailwind to look inside your React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}