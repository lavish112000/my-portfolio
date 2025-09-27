// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        // Device-specific breakpoints
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
        // Orientation breakpoints
        'portrait': {'raw': '(orientation: portrait)'},
        'landscape': {'raw': '(orientation: landscape)'},
        // High-DPI displays
        'retina': {'raw': '(-webkit-min-device-pixel-ratio: 2)'},
      },
      fontSize: {
        'xs': ['0.75rem', {lineHeight: '1rem'}],
        'sm': ['0.875rem', {lineHeight: '1.25rem'}],
        'base': ['1rem', {lineHeight: '1.5rem'}],
        'lg': ['1.125rem', {lineHeight: '1.75rem'}],
        'xl': ['1.25rem', {lineHeight: '1.75rem'}],
        '2xl': ['1.5rem', {lineHeight: '2rem'}],
        '3xl': ['1.875rem', {lineHeight: '2.25rem'}],
        '4xl': ['2.25rem', {lineHeight: '2.5rem'}],
        '5xl': ['3rem', {lineHeight: '1'}],
        '6xl': ['3.75rem', {lineHeight: '1'}],
        '7xl': ['4.5rem', {lineHeight: '1'}],
        '8xl': ['6rem', {lineHeight: '1'}],
        '9xl': ['8rem', {lineHeight: '1'}],
        // Responsive text sizes
        'responsive-xs': ['clamp(0.75rem, 2vw, 0.875rem)', {lineHeight: '1.2'}],
        'responsive-sm': ['clamp(0.875rem, 2.5vw, 1rem)', {lineHeight: '1.3'}],
        'responsive-base': ['clamp(1rem, 3vw, 1.125rem)', {lineHeight: '1.5'}],
        'responsive-lg': ['clamp(1.125rem, 3.5vw, 1.25rem)', {lineHeight: '1.6'}],
        'responsive-xl': ['clamp(1.25rem, 4vw, 1.5rem)', {lineHeight: '1.4'}],
        'responsive-2xl': ['clamp(1.5rem, 5vw, 2.25rem)', {lineHeight: '1.2'}],
        'responsive-3xl': ['clamp(1.875rem, 6vw, 3rem)', {lineHeight: '1.1'}],
        'responsive-4xl': ['clamp(2.25rem, 7vw, 4.5rem)', {lineHeight: '1'}],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}