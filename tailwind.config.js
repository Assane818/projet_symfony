/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        blueBright: '#4086C6',
        navy: '#1E2761', 
      }
    },
  },
  plugins: [],
}

