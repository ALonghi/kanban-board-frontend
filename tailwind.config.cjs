/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "theme-300": "#31D3AB",
        "theme-400": "#25C8A1",
        "theme-500": "#19BE98",
        "theme-600": "#0CB38E",
        "theme-700": "#00A884",
      },
    },
  },
  plugins: [],
};
