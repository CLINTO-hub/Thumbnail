/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#1a73e8', 
        headingColor: '#1a202c', 
        textColor: '#4a5568',
      },
    },
  },
  plugins: [],
}

