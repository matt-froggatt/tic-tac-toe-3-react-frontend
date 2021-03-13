module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
    },
  },
  variants: {
    extend: {
      borderStyle: ["first"],
      backgroundColor: ['active'],
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}
