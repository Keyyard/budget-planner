/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      primary: 'var(--primary-color)',
      background: 'var(--bg-color)',
      text: 'var(--text-color)',
      accent: '#fce390',
      'highlight-color': '#df7559',
    },
  },
};
export const plugins = [];
