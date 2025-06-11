// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
      colors: {
        primary: "#1E3A5F",     // Navy Blue
        secondary: "#4A789C",   // Steel Blue
        accent: "#FF6B35",      // Orange
        background: "#F5F7FA",  // Light Gray
        text: "#2D3436",        // Dark Gray
      },
    },
  },
  plugins: [],
};
