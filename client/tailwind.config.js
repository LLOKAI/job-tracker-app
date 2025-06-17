// This configuration file is for Tailwind CSS, a utility-first CSS framework.
// It specifies the paths to the content files where Tailwind classes will be used,
// as well as the plugins and theme configuration for Tailwind CSS.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};