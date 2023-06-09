/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  prefix: 'tw-',
  theme: {
    extend: {
      screens: {
        'xxxs': '450px',
        // => @media (min-width: 450px) { ... }
        'xxs': '450px',
        // => @media (min-width: 450px) { ... }
        'xs': '600px',
        // => @media (min-width: 600px) { ... }
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
    
        'md': '960px',
        // => @media (min-width: 768px) { ... }
    
        'lg': '1280px',
        // => @media (min-width: 1024px) { ... }
    
        'xl': '1920px',
        // => @media (min-width: 1280px) { ... }
    
        '2xl': '2160px',
        // => @media (min-width: 1536px) { ... }
      }
    },
  },
};
