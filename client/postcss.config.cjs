// This configuration file is for PostCSS, a tool for transforming CSS with JavaScript.
// It specifies the plugins to be used, which in this case are Tailwind CSS and Autoprefixer.
// Tailwind CSS is a utility-first CSS framework, and Autoprefixer adds vendor prefixes to CSS properties.

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
